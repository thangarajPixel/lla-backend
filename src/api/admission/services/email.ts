import nodemailer from 'nodemailer';

export default {
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Light and Life Academy</h1>
              <h2>Registration Successful!</h2>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>
              <p>Congratulations! Your registration has been successfully completed.</p>
              <p><strong>Application ID:</strong> ${admission.id}</p>
              <p><strong>Payment Status:</strong> ${admission.Payment_Status}</p>
              <p>We are excited to have you join Light and Life Academy. Our team will contact you shortly with further details.</p>
              <p>Thank you for choosing us!</p>
            </div>
            <div class="footer">
              <p>Light and Life Academy</p>
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
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4945ff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .info { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Student Registration</h1>
            </div>
            <div class="content">
              <p><strong>A new student has completed registration!</strong></p>
              <div class="info">
                <p><strong>Name:</strong> ${studentName}</p>
                <p><strong>Email:</strong> ${admission.email}</p>
                <p><strong>Mobile:</strong> ${admission.mobile_no}</p>
                <p><strong>Application ID:</strong> ${admission.id}</p>
                <p><strong>Payment Status:</strong> ${admission.Payment_Status}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
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
        subject: 'Registration Successful - Light and Life Academy',
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
        subject: `New Student Registration - ${studentName}`,
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
};
