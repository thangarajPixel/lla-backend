/**
 * admission controller
 */

import { factories } from '@strapi/strapi'

// Helper function to add base URL to media fields
const addBaseUrlToMedia = (data: any, baseUrl: string): any => {
  if (!data) return data;

  // Handle single media object
  if (data.url && typeof data.url === 'string') {
    return {
      ...data,
      url: data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`,
    };
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => addBaseUrlToMedia(item, baseUrl));
  }

  // Handle objects
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      result[key] = addBaseUrlToMedia(data[key], baseUrl);
    }
    return result;
  }

  return data;
};

export default factories.createCoreController('api::admission.admission', ({ strapi }) => ({
  async create(ctx) {
    console.log('========================================');
    console.log('📝 CREATE API called');
    console.log('========================================');

    // Remove publishedAt from request body
    if (ctx.request.body.data) {
      delete ctx.request.body.data.publishedAt;
    }

    // Call default create
    const response = await super.create(ctx);

    console.log('✅ Initial record created - ID:', response.data?.id, 'DocumentId:', response.data?.documentId);

    // Find draft record with publishedAt = null
    let createdRecord = response.data;
    if (response.data?.documentId) {
      const draftRecords = await strapi.entityService.findMany('api::admission.admission', {
        filters: {
          documentId: response.data.documentId,
          publishedAt: { $null: true }
        },
        limit: 1,
      });

      if (draftRecords && draftRecords.length > 0) {
        console.log('✅ Found draft record - ID:', draftRecords[0].id);
        createdRecord = draftRecords[0];
      }
    }

    // Check if step_0 is false and send registration link email
    if (createdRecord && createdRecord.step_0 === true && createdRecord.email && createdRecord.first_name) {
      console.log('📧 step_0 is false, sending registration link email...');
      try {
        const emailService = require('../services/email').default;
        await emailService.sendRegistrationLinkEmail(createdRecord);
        console.log('✅ Registration link email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send registration link email:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log('========================================');
    const baseUrl = process.env.ADMIN_BASE_URL || `${ctx.request.protocol}://${ctx.request.host}`;
    if (createdRecord) {
      return { data: addBaseUrlToMedia(createdRecord, baseUrl) };
    }
    
    if (response?.data) {
      response.data = addBaseUrlToMedia(response.data, baseUrl);
    }
    return response;
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const populateConfig = {
      passport_size_image: true,
      state: true,
      Course:true,
      Language_Proficiency: true,
      Parent_Guardian_Spouse_Details: {
        populate: {
          state: true,
        },
      },
      Education_Details: {
        populate: {
          Education_Details_12th_std: true,
          Education_Details_10th_std: true,
        },
      },
      Under_Graduate: {
        populate: {
          marksheet: true,
        },
      },
      Post_Graduate: {
        populate: {
          marksheet: true,
        },
      },
      Work_Experience: {
        populate: {
          reference_letter: true,
        },
      },
      Upload_Your_Portfolio: {
        populate: {
          images: true,
        },
      },
    };

    let admission;

    // Check if id is numeric (for swagger compatibility)
    if (/^\d+$/.test(id)) {
      // First, find the record by ID to get its documentId
      const entities = await strapi.entityService.findMany('api::admission.admission', {
         filters: { id: parseInt(id) },
         populate: populateConfig, 
      });

      // if (!initialRecord || initialRecord.length === 0) {
      //   return ctx.notFound('Admission not found');
      // }

      //const documentId = initialRecord[0].documentId;

      // Now find all records with same documentId using db query
      // const allRecords = await strapi.db.query('api::admission.admission').findMany({
      //   where: { documentId: documentId },
      //   orderBy: { id: 'desc' },
      //   limit: 1,
      // });

      // if (!allRecords || allRecords.length === 0) {
      //   return ctx.notFound('Admission not found');
      // }

      // Get the latest record with full population
      // const entities = await strapi.entityService.findMany('api::admission.admission', {
      //   filters: { id: allRecords[0].id },
      //   populate: populateConfig,
      //   limit: 1,
      // });

      // if (!entities || entities.length === 0) {
      //   return ctx.notFound('Admission not found');
      // }

       if (!entities || entities.length === 0) {
        return ctx.notFound('Admission not found');
      }
      admission = entities[0];
    } else {
      // Find by documentId with full population
      admission = await strapi.entityService.findOne('api::admission.admission', id, {
        populate: populateConfig,
      });

      if (!admission) {
        return ctx.notFound('Admission not found');
      }
    }

    // Add base URL to all media fields
    const baseUrl = process.env.ADMIN_BASE_URL || `${ctx.request.protocol}://${ctx.request.host}`;
    const transformedData = addBaseUrlToMedia(admission, baseUrl);

    // Return formatted response
    return { data: transformedData };
  },

  async generatePdf(ctx) {
    const { id } = ctx.params;

    try {
      // Find admission by numeric id with deep population
      let admission;
      const populateConfig = {
        populate: {
          passport_size_image: true,
          state: true,
          Course:true,
          Language_Proficiency: true,
          Parent_Guardian_Spouse_Details: {
            populate: {
              state: true,
            },
          },
          Education_Details: {
            populate: {
              Education_Details_12th_std: true,
              Education_Details_10th_std: true,
            },
          },
          Under_Graduate: {
            populate: {
              marksheet: true,
            },
          },
          Post_Graduate: {
            populate: {
              marksheet: true,
            },
          },
          Work_Experience: {
            populate: {
              reference_letter: true,
            },
          },
          Upload_Your_Portfolio: {
            populate: {
              images: true,
            },
          },
        },
      };

      if (/^\d+$/.test(id)) {
        const entities = await strapi.entityService.findMany('api::admission.admission', {
          filters: { id: parseInt(id) },
          ...populateConfig,
        });
        admission = entities[0];
      } else {
        // Find by documentId
        admission = await strapi.entityService.findOne('api::admission.admission', id, populateConfig);
      }

      if (!admission) {
        return ctx.notFound('Admission not found');
      }

      try {
        // Use the PDF generator service
        const PDFGenerator = require('../services/pdf-generator').default;
        const pdfGenerator = new PDFGenerator();

        // Format admission data
        const formattedData = pdfGenerator.formatAdmissionData(admission);

        console.log('Generating PDF for admission:', admission.id);
        console.log('Formatted data:', JSON.stringify(formattedData, null, 2));

        // Generate PDF buffer
        const pdfBuffer = await pdfGenerator.generateAdmissionPDF(formattedData);

        console.log('PDF generated successfully, buffer size:', pdfBuffer.length);

        // Validate PDF buffer
        if (!pdfBuffer || pdfBuffer.length === 0) {
          throw new Error('PDF buffer is empty');
        }

        // Set response headers for PDF download
        ctx.set('Content-Type', 'application/pdf');
        ctx.set('Content-Disposition', `attachment; filename="admission-${admission.id}.pdf"`);
        ctx.set('Content-Length', pdfBuffer.length.toString());

        // Return PDF buffer
        ctx.body = pdfBuffer;

      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        console.error('Error stack:', pdfError.stack);

        // Fallback to simple HTML
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Admission Form - ${admission.first_name} ${admission.last_name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4945ff; padding-bottom: 20px; }
              .field { margin: 10px 0; padding: 8px; background: #f8f9fa; border-radius: 4px; }
              .label { font-weight: bold; color: #4945ff; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="color: #4945ff;">Light and Life Academy</h1>
              <h2>Admission Form</h2>
            </div>
            
            <div class="field">
              <span class="label">Application ID:</span> ${admission.id}
            </div>
            <div class="field">
              <span class="label">Name:</span> ${admission.name_title} ${admission.first_name} ${admission.last_name}
            </div>
            <div class="field">
              <span class="label">Email:</span> ${admission.email}
            </div>
            <div class="field">
              <span class="label">Date of Birth:</span> ${admission.date_of_birth}
            </div>
            <div class="field">
              <span class="label">Nationality:</span> ${admission.nationality}
            </div>
            <div class="field">
              <span class="label">Mobile:</span> ${admission.mobile_no || 'N/A'}
            </div>
            <div class="field">
              <span class="label">City:</span> ${admission.city || 'N/A'}
            </div>
            <div class="field">
              <span class="label">District:</span> ${admission.district || 'N/A'}
            </div>
            <div class="field">
              <span class="label">Pincode:</span> ${admission.pincode || 'N/A'}
            </div>
            <div class="field">
              <span class="label">Step 1 Completed:</span> ${admission.step_1 ? 'Yes' : 'No'}
            </div>
            <div class="field">
              <span class="label">Step 2 Completed:</span> ${admission.step_2 ? 'Yes' : 'No'}
            </div>
            <div class="field">
              <span class="label">Step 3 Completed:</span> ${admission.step_3 ? 'Yes' : 'No'}
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
              Generated on ${new Date().toLocaleString()}
            </div>
          </body>
          </html>
        `;

        // Set response headers for HTML
        ctx.set('Content-Type', 'text/html');
        ctx.body = html;
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      ctx.throw(500, 'Error generating PDF: ' + error.message);
    }
  },

  async exportAll(ctx) {
    try {
      // Get all admissions without any date filters
      const admissions = await strapi.entityService.findMany('api::admission.admission', {
        populate: '*',
        pagination: {
          start: 0,
          limit: -1, // Get all records
        },
      });

      if (!admissions || admissions.length === 0) {
        return ctx.notFound('No admissions found');
      }

      // Convert to CSV format
      const csvHeaders = [
        'ID',
        'Name Title',
        'First Name',
        'Last Name',
        'Email',
        'Date of Birth',
        'Nationality',
        'Mobile No',
        'City',
        'District',
        'Pincode',
        'Step 1',
        'Step 2',
        'Step 3',
        'Created At',
        'Updated At'
      ];

      const csvRows = admissions.map(admission => [
        admission.id,
        admission.name_title || '',
        admission.first_name || '',
        admission.last_name || '',
        admission.email || '',
        admission.date_of_birth || '',
        admission.nationality || '',
        admission.mobile_no || '',
        admission.city || '',
        admission.district || '',
        admission.pincode || '',
        admission.step_1 ? 'Yes' : 'No',
        admission.step_2 ? 'Yes' : 'No',
        admission.step_3 ? 'Yes' : 'No',
        admission.createdAt || '',
        admission.updatedAt || ''
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Set response headers for CSV download
      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename="admissions-export-${new Date().toISOString().split('T')[0]}.csv"`);

      // Return CSV content
      ctx.body = csvContent;

    } catch (error) {
      console.error('Error exporting admissions:', error);
      ctx.throw(500, 'Error exporting admissions: ' + error.message);
    }
  },

  async checkEmailUnique(ctx) {
    try {
      const { email, id } = ctx.request.body;

      console.log('========================================');
      console.log('📧 Checking email uniqueness');
      console.log('Email:', email);
      console.log('Exclude ID:', id);
      console.log('========================================');

      // Validate email
      if (!email) {
        return ctx.badRequest('Email is required');
      }

      // Build filters
      const filters: any = {
        email: email,
      };

      // If ID is provided (for edit), get document_id and exclude all records with that document_id
      if (id) {
        // First, find the record by ID to get its document_id
        const currentRecord = await strapi.entityService.findMany('api::admission.admission', {
          filters: { id: parseInt(id) },
          limit: 1,
        });

        if (currentRecord && currentRecord.length > 0 && currentRecord[0].documentId) {
          const documentId = currentRecord[0].documentId;
          console.log('📄 Found document_id:', documentId);
          console.log('   Excluding all records with this document_id');
          
          // Exclude all records with the same document_id
          filters.documentId = { $ne: documentId };
        } else {
          console.log('⚠️  Record not found or no document_id, excluding by ID only');
          filters.id = { $ne: parseInt(id) };
        }
      }

      console.log('🔍 Filters:', JSON.stringify(filters, null, 2));

      // Check if email exists
      const existingAdmissions = await strapi.entityService.findMany('api::admission.admission', {
        filters: filters,
        limit: 1,
      });

      const isUnique = !existingAdmissions || existingAdmissions.length === 0;

      console.log('✅ Email check result:', isUnique ? 'UNIQUE' : 'EXISTS');
      if (!isUnique && existingAdmissions.length > 0) {
        console.log('   Found in record ID:', existingAdmissions[0].id);
        console.log('   Document ID:', existingAdmissions[0].documentId);
      }
      console.log('========================================');

      return {
        email: email,
        isUnique: isUnique,
        exists: !isUnique,
        message: isUnique ? 'Email is available' : 'Email already exists',
      };

    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      ctx.throw(500, 'Error checking email: ' + error.message);
    }
  },

  async generatePaymentLink(ctx) {
    try {
      const { id } = ctx.params;
      const { amount } = ctx.request.body;

      console.log('========================================');
      console.log('💳 PAYMENT LINK GENERATION');
      console.log('Admission ID:', id);
      console.log('Amount:', amount);
      console.log('========================================');

      // Find admission
      let admission;
      if (/^\d+$/.test(id)) {
        const entities = await strapi.entityService.findMany('api::admission.admission', {
          filters: { id: parseInt(id) },
          populate: ['Course'],
        });
        admission = entities[0];
      } else {
        admission = await strapi.entityService.findOne('api::admission.admission', id, {
          populate: ['Course'],
        });
      }

      if (!admission) {
        console.log('❌ Admission not found');
        return ctx.notFound('Admission not found');
      }

      console.log('✅ Admission found:', admission.first_name, admission.last_name);
      console.log('📊 Current Payment Status:', admission.Payment_Status);

      // Check if already completed
      if (admission.Payment_Status === 'Completed') {
        console.log('✅ Payment already completed');
        return {
          success: true,
          status: 'already_completed',
          message: 'Payment already completed for this admission',
          admission: {
            id: admission.id,
            name: `${admission.first_name} ${admission.last_name}`,
            email: admission.email,
            course: admission.Course?.title || 'Course',
            paymentStatus: admission.Payment_Status
          }
        };
      }

      // Use provided amount or default to 1 rupee
      const paymentAmount = amount || process.env.DEFAULT_PAYMENT_AMOUNT || '1';
      console.log('💰 Payment amount:', paymentAmount);

      // Generate payment link directly
      const crypto = require("crypto");
      const { v4: uuidv4 } = require("uuid");
      const payu = require("../../../../config/payu");

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
        udf1: admission.id.toString(), // Store admission ID for reference
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

      // Update payment status to Pending
      await strapi.entityService.update('api::admission.admission', admission.id, {
        data: {
          Payment_Status: 'Pending'
        }
      });

      const paymentResponse = {
        success: true,
        status: 'payment_link_generated',
        checkoutUrl: payu.BASE_URL,
        method: "POST",
        data: {
          key: payu.KEY,
          ...paymentData,
          hash
        }
      };

      console.log('✅ Payment link generated successfully');
      console.log('🔗 Checkout URL:', payu.BASE_URL);
      console.log('🆔 Transaction ID:', txnid);
      console.log('========================================');

      // Return complete response with saved API data
      return {
        success: true,
        admission: {
          id: admission.id,
          name: `${admission.first_name} ${admission.last_name}`,
          email: admission.email,
          course: admission.Course?.title || 'Course',
          paymentStatus: 'Pending'
        },
        payment: paymentResponse,
        // Additional metadata for saving
        metadata: {
          transactionId: txnid,
          amount: paymentData.amount,
          generatedAt: new Date().toISOString(),
          admissionId: admission.id
        }
      };

    } catch (error) {
      console.error('❌ Error generating payment link:', error);
      ctx.throw(500, 'Error generating payment link: ' + error.message);
    }
  },

  async getPaymentStatus(ctx) {
    try {
      const { id } = ctx.params;

      console.log('========================================');
      console.log('💳 GET PAYMENT STATUS');
      console.log('Admission ID:', id);
      console.log('========================================');

      // Find admission
      let admission;
      if (/^\d+$/.test(id)) {
        const entities = await strapi.entityService.findMany('api::admission.admission', {
          filters: { id: parseInt(id) },
          populate: ['Course'],
        });
        admission = entities[0];
      } else {
        admission = await strapi.entityService.findOne('api::admission.admission', id, {
          populate: ['Course'],
        });
      }

      if (!admission) {
        console.log('❌ Admission not found');
        return ctx.notFound('Admission not found');
      }

      console.log('✅ Admission found:', admission.first_name, admission.last_name);
      console.log('📊 Payment Status:', admission.Payment_Status);
      console.log('========================================');

      return {
        success: true,
        admission: {
          id: admission.id,
          name: `${admission.first_name} ${admission.last_name}`,
          email: admission.email,
          course: admission.Course?.title || 'Course',
          paymentStatus: admission.Payment_Status,
          step1: admission.step_1,
          step2: admission.step_2,
          step3: admission.step_3,
          createdAt: admission.createdAt,
          updatedAt: admission.updatedAt
        }
      };

    } catch (error) {
      console.error('❌ Error getting payment status:', error);
      ctx.throw(500, 'Error getting payment status: ' + error.message);
    }
  },

  async createPayment(ctx) {
    try {
      const { id } = ctx.params;
      const { amount } = ctx.request.body;

      console.log('========================================');
      console.log('💳 CREATE PAYMENT');
      console.log('Admission ID:', id);
      console.log('Amount:', amount);
      console.log('========================================');

      // Use provided amount or default to 1 rupee
      const paymentAmount = amount || process.env.DEFAULT_PAYMENT_AMOUNT || '1';

      // Find admission
      let admission;
      if (/^\d+$/.test(id)) {
        const entities = await strapi.entityService.findMany('api::admission.admission', {
          filters: { id: parseInt(id) },
          populate: ['Course'],
        });
        admission = entities[0];
      } else {
        admission = await strapi.entityService.findOne('api::admission.admission', id, {
          populate: ['Course'],
        });
      }

      if (!admission) {
        console.log('❌ Admission not found');
        return ctx.notFound('Admission not found');
      }

      console.log('✅ Admission found:', admission.first_name, admission.last_name);

      // Check if already completed
      if (admission.Payment_Status === 'Completed') {
        console.log('✅ Payment already completed');
        return {
          success: true,
          status: 'already_completed',
          message: 'Payment already completed for this admission',
          admission: {
            id: admission.id,
            name: `${admission.first_name} ${admission.last_name}`,
            email: admission.email,
            course: admission.Course?.title || 'Course',
            paymentStatus: admission.Payment_Status
          }
        };
      }

      // Create payment using payment controller
      const paymentController = require('../../payment/controllers/payment');
      
      // Create a mock context for payment creation
      const paymentCtx = {
        request: {
          body: {
            admissionId: admission.id,
            amount: paymentAmount
          }
        },
        send: (data) => data,
        badRequest: (msg) => { throw new Error(msg); },
        notFound: (msg) => { throw new Error(msg); },
        internalServerError: (msg) => { throw new Error(msg); }
      };

      const paymentData = await paymentController.create(paymentCtx);

      console.log('✅ Payment created successfully');
      console.log('========================================');

      return {
        success: true,
        admission: {
          id: admission.id,
          name: `${admission.first_name} ${admission.last_name}`,
          email: admission.email,
          course: admission.Course?.title || 'Course',
          paymentStatus: 'Pending'
        },
        payment: paymentData
      };

    } catch (error) {
      console.error('❌ Error creating payment:', error);
      ctx.throw(500, 'Error creating payment: ' + error.message);
    }
  }
}));
