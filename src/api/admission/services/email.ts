import nodemailer from 'nodemailer';
import axios from 'axios';
import crypto from 'crypto';
import path from 'path';
import { encryptAdmissionId } from './id-encryption';

export default {
  async sendRequestInformationEmail(contact: any) {
    console.log('========================================');
    console.log('📧 Sending Request Information email...');
    console.log('Contact Email:', contact.Email);
    console.log('Contact Name:', contact.FirstName);
    console.log('========================================');

    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Email HTML
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #fce4d8; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Light & Life Academy</h1>
              <h3>PHOTOGRAPHY</h3>
            </div>
            <div class="content">
              <h2 style="color: #ff6b6b;">Successfully Request for Admission</h2>
              <p>Hi <strong>${contact.FirstName}</strong>,</p>
              <p>Thank you for your registration and interest in Light & Life Academy!</p>
              <p>We have received your request for information. Our team will review your inquiry and get back to you shortly.</p>
              <p>We look forward to helping you begin your photography journey with us!</p>
            </div>
            <div class="footer">
              <p>Light & Life Academy - Photography</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      console.log('📤 Sending email...');
      const result = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: contact.Email,
        subject: 'Successfully Request for Admission - Light & Life Academy',
        html: emailHtml,
      });

      console.log('✅ SUCCESS: Request Information email sent!');
      console.log('   To:', contact.Email);
      console.log('   Message ID:', result.messageId);
      console.log('========================================');

      return { success: true };
    } catch (error) {
      console.error('========================================');
      console.error('❌ ERROR: Failed to send Request Information email');
      console.error('Error details:', error);
      console.error('========================================');
      throw error;
    }
  },

  async sendRegistrationLinkEmail(admission: any) {
    console.log('========================================');
    console.log('📧 Sending registration link email...');
    console.log('Student Email:', admission.email);
    console.log('Student Name:', admission.first_name);
    console.log('========================================');

    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Generate encrypted ID
      const encryptedId = encryptAdmissionId(admission.id);
      const registrationUrl = `https://dev.lightandlifeacademy.in/admission/${encryptedId}`;

      console.log('🔐 Encrypted ID:', encryptedId);
      console.log('🔗 Registration URL:', registrationUrl);

      // Email HTML
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #fce4d8; border-radius: 0 0 8px 8px; }
            .button { 
              display: inline-block; 
              padding: 12px 30px; 
              background: #ff6b6b; 
              color: white; 
              text-decoration: none; 
              border-radius: 25px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Light & Life Academy</h1>
              <h3>PHOTOGRAPHY</h3>
            </div>
            <div class="content">
              <p>Hi <strong>${admission.first_name}</strong>,</p>
              <p>Thank you for your interest in Light & Life Academy!</p>
              <p>To complete your registration, please click the button below:</p>
              <div style="text-align: center;">
                <a href="${registrationUrl}" class="button">Complete Registration</a>
              </div>
              <p style="font-size: 12px; color: #666;">
                Or copy and paste this link in your browser:<br>
                <a href="${registrationUrl}">${registrationUrl}</a>
              </p>
              <p>We look forward to having you join our photography community!</p>
            </div>
            <div class="footer">
              <p>Light & Life Academy - Photography</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      console.log('📤 Sending email...');
      const result = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: admission.email,
        subject: 'Complete Your Registration - Light & Life Academy',
        html: emailHtml,
      });

      console.log('✅ SUCCESS: Registration link email sent!');
      console.log('   To:', admission.email);
      console.log('   Message ID:', result.messageId);
      console.log('========================================');

      return { success: true, encryptedId };
    } catch (error) {
      console.error('========================================');
      console.error('❌ ERROR: Failed to send registration link email');
      console.error('Error details:', error);
      console.error('========================================');
      throw error;
    }
  },

  async sendRegistrationEmail(admission: any) {
    console.log('========================================');
    console.log('📧 Starting email sending process...');
    console.log('Student Email:', admission.email);
    console.log('Admin Email:', process.env.SMTP_FROM);
    console.log('========================================');

    try {
      // Create transporter
      console.log('🔧 Creating email transporter...');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      console.log('✅ Transporter created successfully');

      const studentName = `${admission.name_title} ${admission.first_name} ${admission.last_name}`;
      console.log('👤 Student Name:', studentName);
const baseUrl = process.env.ADMIN_BASE_URL || 'https://dev-admin.lightandlifeacademy.in';
const siteBaseUrl = process.env.FRONTEND_URL || 'https://dev.lightandlifeacademy.in';
const pdfDownloadUrl = `${baseUrl}/api/admissions/${admission.id}/pdf`;
const viewUrl = `${siteBaseUrl}/admission/${admission.encryptedId}`;
const portfolioUrl = `${siteBaseUrl}/admission/${admission.encryptedId}/preview?section=portfolio`;
      // Email to student
      const studentEmailHtml = `
        <!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4945ff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f8f9fa; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .btn {
      display:inline-block;
      padding:10px 22px;
      border-radius:20px;
      background:#ff6b6b;
      color:#fff;
      text-decoration:none;
      font-size:13px;
      font-weight:600;
      margin-top:10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Light & Life Academy</h1>
      <h2>Application Completed Successfully</h2>
    </div>

    <div class="content">
      <p>Hello <strong>${studentName}</strong>,</p>

      <p>Greetings from <strong>Light & Life Academy!</strong></p>

      <p>
        You have completed the application process for the PG Diploma in Professional Photography & Digital Production Course 2024-2025.</strong>.
      </p>
      <p><strong>Payment Reference ID:</strong> ${admission.mihpayid || ''}</p>
      <p style="margin-top:20px;">
        Please feel free to contact us if you need any further clarification.
        Our team will reach out to you shortly with the next steps.
      </p>

      <p>
        <strong>Best Wishes!</strong><br />
        Team Light & Life Academy
      </p>
    </div>

    <div class="footer">
      <p>
        W: <a href="https://www.llacademy.org" target="_blank">www.llacademy.org</a> |
        M: +91 75982 87370
      </p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
      `;

      // Email to admin
      const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .header { background: #4945ff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f8f9fa; }
    .info {
      margin: 10px 0;
      padding: 12px;
      background: white;
      border-radius: 4px;
    }
    .info p { margin: 6px 0; }
    .btn {
      display:inline-block;
      padding:8px 18px;
      margin-right:8px;
      border-radius:18px;
      background:#4945ff;
      color:#fff;
      text-decoration:none;
      font-size:13px;
      font-weight:600;
    }
    .btn.secondary { background:#6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Student Application</h1>
    </div>

    <div class="content">
      <p>
        <strong>${studentName}</strong> has applied for the
        <strong>PG Diploma in Professional Photography & Digital Production</strong>
        for the academic year <strong>2025–2026</strong>.
      </p>

      <div class="info">
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${admission.email}</p>
        <p><strong>Phone Number:</strong> ${admission.mobile_no}</p>
        <p><strong>Unique ID (PayU):</strong> ${admission.PayUId || ''}</p>
        <p><strong>Payment Transaction ID:</strong> ${admission.txnid || ''}</p>
      </div>

      <div style="margin-top:15px;">
        <a href="${viewUrl}" target="_blank" class="btn primary">
          View Application
        </a>
        <a href="${pdfDownloadUrl}" target="_blank" class="btn secondary">
          Download Application
        </a>
         <a href="${portfolioUrl}" target="_blank" class="btn warning">
          Portfolio
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

      // Send email to student
      console.log('📤 Sending email to student...');
      const studentEmailResult = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: admission.email,
        subject: ' Light & Life Academy | Congratulations on completing your application process.',
        html: studentEmailHtml,
      });

      console.log('✅ SUCCESS: Student email sent!');
      console.log('   To:', admission.email);
      console.log('   Message ID:', studentEmailResult.messageId);

      // Send email to admin
      console.log('📤 Sending email to admin...');
      const adminEmailResult = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_FROM, // Send to admin email
        subject: `${studentName} has successfully applied for PG Diploma in Professional Photography & Digital Production
`,
        html: adminEmailHtml,
      });

      console.log('✅ SUCCESS: Admin email sent!');
      console.log('   To:', process.env.SMTP_FROM);
      console.log('   Message ID:', adminEmailResult.messageId);
      console.log('========================================');
      console.log('🎉 All emails sent successfully!');
      console.log('========================================');

      return { success: true };
    } catch (error) {
      console.error('========================================');
      console.error('❌ ERROR: Failed to send registration emails');
      console.error('Error details:', error);
      console.error('========================================');
      throw error;
    }
  },
  async getPaymentIDStatus(admission: any) {
    try {
      // =========================
      // 1️⃣ BASIC VALIDATIONS
      // =========================
      if (!admission?.id) {
        throw new Error('Admission ID missing');
      }

      if (!admission?.txnid) {
        throw new Error('Transaction ID is required');
      }

      // 🛑 VERY IMPORTANT: stop repeat calls
      if (admission.Payment_Status === 'Paid' && admission.mihpayid) {
        console.log('Payment already verified. Skipping PayU call.');
        return true;
      }

      const txnid = admission.txnid;

      // =========================
      // 2️⃣ PAYU CONFIG
      // =========================
      const payu = require(path.join(process.cwd(), 'config', 'payu'));

      const command = 'verify_payment';

      const hashString = `${payu.KEY}|${command}|${txnid}|${payu.SALT}`;
      const hash = crypto
        .createHash('sha512')
        .update(hashString)
        .digest('hex');

      const postData = new URLSearchParams({
        key: String(payu.KEY),
        command: String(command),
        var1: String(txnid),
        hash: String(hash),
      });

      // =========================
      // 3️⃣ PAYU API CALL
      // =========================
      const response = await axios.post(
        'https://info.payu.in/merchant/postservice?form=2',
        postData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 15000,
        }
      );

      const paymentStatus = response?.data;

      if (!paymentStatus || paymentStatus.status !== 1) {
        console.log('PayU verification failed or transaction not found');

        await strapi.entityService.update(
          'api::admission.admission',
          admission.id,
          {
            data: {
              Payment_Status: 'UnPaid',
            },
          }
        );

        return false;
      }

      // =========================
      // 4️⃣ FETCH TRANSACTION DATA
      // =========================
      const txnData = paymentStatus.transaction_details?.[txnid];

      if (!txnData || txnData.status !== 'success') {
        console.log('Transaction not successful yet');

        await strapi.entityService.update(
          'api::admission.admission',
          admission.id,
          {
            data: {
              Payment_Status: 'UnPaid',
              payment_response: txnData ?? {},
            },
          }
        );

        return false;
      }

      // =========================
      // 5️⃣ UPDATE ADMISSION (ONCE)
      // =========================
      await strapi.entityService.update(
        'api::admission.admission',
        admission.id,
        {
          data: {
            Payment_Status: 'Paid',
            mihpayid: txnData.mihpayid ?? '',
            PayUId: txnData.bank_ref_num ?? '',
            payment_response: txnData,
          },
        }
      );

      console.log('Payment verified & saved successfully');
      return true;
    } catch (error: any) {
      console.error(
        'Error fetching payment status:',
        error?.response?.data || error.message
      );
      throw error;
    }
  },

};
