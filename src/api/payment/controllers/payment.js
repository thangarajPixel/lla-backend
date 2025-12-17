const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const payu = require(path.join(process.cwd(), 'config', 'payu'));

module.exports = {
  async create(ctx) {
    try {
      const { admissionId, amount } = ctx.request.body;

      if (!admissionId) {
        return ctx.badRequest('Admission ID is required');
      }

      // Use provided amount or default to 1 rupee
      const paymentAmount = amount || process.env.DEFAULT_PAYMENT_AMOUNT || '1';

      // Get admission details
      const admission = await strapi.entityService.findOne('api::admission.admission', admissionId, {
        populate: ['Course']
      });

      if (!admission) {
        return ctx.notFound('Admission not found');
      }

      // Check if already paid
      if (admission.Payment_Status === 'Paid' || admission.Payment_Status === 'Completed') {
        return ctx.badRequest('Payment already completed for this admission');
      }

      // Generate unique transaction ID
      const txnid = uuidv4().replace(/-/g, "").substring(0, 20);
      
      // Prepare payment data
      const paymentData = {
        amount: parseFloat(paymentAmount).toFixed(2),
        productinfo: `Admission Fee - ${admission.Course?.title || 'Course'}`,
        firstname: admission.first_name,
        lastname: admission.last_name || '',
        email: admission.email,
        phone: admission.mobile_no?.toString() || '',
        txnid,
        surl: `${strapi.config.server.url}/api/payment/success`,
        furl: `${strapi.config.server.url}/api/payment/failure`,
        udf1: admissionId.toString(), // Store admission ID for reference
        udf2: '', 
        udf3: '',
        udf4: '',
        udf5: ''
      };

      // Create hash for PayU
      const hashString = 
        `${payu.KEY}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|${paymentData.udf1}|${paymentData.udf2}|${paymentData.udf3}|${paymentData.udf4}|${paymentData.udf5}||||||${payu.SALT}`;

      const hash = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex");

      // Save payment attempt in admission record
      await strapi.entityService.update('api::admission.admission', admissionId, {
        data: {
          Payment_Status: 'Pending'
        }
      });

      // Return payment form data
      return ctx.send({
        success: true,
        checkoutUrl: payu.BASE_URL,
        method: "POST",
        data: {
          key: payu.KEY,
          ...paymentData,
          hash
        }
      });

    } catch (error) {
      strapi.log.error('Payment creation error:', error);
      return ctx.internalServerError('Failed to create payment');
    }
  },

  async success(ctx) {
    try {
      const {
        status,
        firstname,
        amount,
        txnid,
        hash,
        key,
        productinfo,
        email,
        udf1, // admission ID
        mihpayid,
        mode,
        bankcode,
        bank_ref_num,
        cardnum,
        name_on_card,
        issuing_bank,
        card_type
      } = ctx.request.body;

      // Verify hash
      const hashString = 
        `${payu.SALT}|${status}|||||||||||${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;

      const verifyHash = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex");

      if (hash !== verifyHash) {
        strapi.log.error('Invalid hash in payment success callback');
        return ctx.badRequest("Invalid Hash");
      }

      const admissionId = parseInt(udf1);
      
      if (status === 'success') {
        // Update admission payment status
        await strapi.entityService.update('api::admission.admission', admissionId, {
          data: {
            Payment_Status: 'Completed',
            step_3: true // Mark step 3 as completed
          }
        });

        // Log successful payment
        strapi.log.info(`Payment successful for admission ${admissionId}, transaction: ${txnid}`);
        
        // Redirect to success page
        return ctx.redirect(`${process.env.FRONTEND_URL || 'https://dev.lightandlifeacademy.in'}/admission/payment-success?txn=${txnid}`);
      } else {
        // Payment failed
        await strapi.entityService.update('api::admission.admission', admissionId, {
          data: {
            Payment_Status: 'UnPaid'
          }
        });

        strapi.log.warn(`Payment failed for admission ${admissionId}, transaction: ${txnid}`);
        return ctx.redirect(`${process.env.FRONTEND_URL || 'https://dev.lightandlifeacademy.in'}/admission/payment-failed?txn=${txnid}`);
      }

    } catch (error) {
      strapi.log.error('Payment success callback error:', error);
      return ctx.internalServerError('Payment processing failed');
    }
  },

  async failure(ctx) {
    try {
      const { txnid, udf1 } = ctx.request.body;
      const admissionId = parseInt(udf1);

      if (admissionId) {
        await strapi.entityService.update('api::admission.admission', admissionId, {
          data: {
            Payment_Status: 'UnPaid'
          }
        });
      }

      strapi.log.warn(`Payment failed for admission ${admissionId}, transaction: ${txnid}`);
      return ctx.redirect(`${process.env.FRONTEND_URL || 'https://dev.lightandlifeacademy.in'}/admission/payment-failed?txn=${txnid}`);

    } catch (error) {
      strapi.log.error('Payment failure callback error:', error);
      return ctx.internalServerError('Payment processing failed');
    }
  },

  async webhook(ctx) {
    try {
      // PayU webhook for additional payment notifications
      const paymentData = ctx.request.body;
      
      strapi.log.info('PayU webhook received:', paymentData);
      
      // Process webhook data if needed
      // This is for additional payment status updates from PayU
      
      return ctx.send({ status: 'received' });

    } catch (error) {
      strapi.log.error('Payment webhook error:', error);
      return ctx.internalServerError('Webhook processing failed');
    }
  }
};