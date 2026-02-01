/**
 * contact controller
 */

import { factories } from '@strapi/strapi';
import { googleRecaptchaVerify } from '../../../helper';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    console.log('========================================');
    console.log('📝 CONTACT CREATE API called');
    console.log('========================================');
    console.log('📋 Request Body:', JSON.stringify(ctx.request.body, null, 2));
    console.log('🌐 Request Headers:', JSON.stringify(ctx.request.headers, null, 2));
    console.log('🔗 Request Origin:', ctx.request.header.origin);
    console.log('📍 Request IP:', ctx.request.ip);
    
    const { captchaToken, recaptchaToken, ...contactData } = ctx.request.body;
    const token = ctx.request.body.data.captchaToken;
    
    console.log('🔐 reCAPTCHA Token received:', token ? 'Yes' : 'No');
    console.log('🔐 Token length:', token ? token.length : 0);
    
    if (token) {
      console.log('🔍 Starting reCAPTCHA verification...');
      
      try {
        const result = await googleRecaptchaVerify(token);
        
        console.log('📊 reCAPTCHA Verification Result:', JSON.stringify(result, null, 2));
        
        if (!result.success) {
          console.error('❌ reCAPTCHA verification failed:', result.error);
          return ctx.badRequest(`reCAPTCHA verification failed: ${result.error}`);
        }
        
        if (result.score !== undefined) {
          console.log('📈 reCAPTCHA Score:', result.score);
          if (result.score < 0.5) {
            console.error('❌ reCAPTCHA score too low:', result.score);
            return ctx.badRequest('reCAPTCHA score too low. Please try again.');
          }
        }
        
        console.log('✅ reCAPTCHA verification succeeded');
        
        // Add verification info to contact data
        contactData.recaptcha_verified = true;
        contactData.recaptcha_score = result.score || null;
        
      } catch (error) {
        console.error('❌ reCAPTCHA verification error:', error);
        return ctx.internalServerError(`reCAPTCHA verification error: ${error.message}`);
      }
    } else {
      console.log('⚠️ No reCAPTCHA token provided - proceeding without verification');
      contactData.recaptcha_verified = false;
    }

    console.log('💾 Creating contact record with data:', JSON.stringify(contactData, null, 2));

    // Update the request body with the modified data
    ctx.request.body = contactData;

    // Call default create
    const response = await super.create(ctx);

    console.log('✅ Contact record created successfully');
    console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
    
    const createdContact = response.data;
    if (createdContact && createdContact.Email && createdContact.FirstName) {
      const emailService = require('../../admission/services/email').default;
      
      if (createdContact.Type === 'Request Information') {
        console.log('📧 Type is "Request Information", sending user email...');
        try {
          await emailService.sendRequestInformationEmail(createdContact);
          console.log('✅ Request Information email sent successfully to user');
        } catch (emailError) {
          console.error('❌ Failed to send Request Information email:', emailError);
          // Don't fail the request if email fails
        }
      } else {
        console.log('📧 Sending contact form email...');
        try {
          await emailService.sendContactFormEmail(createdContact);
          console.log('✅ Contact form email sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send contact form email:', emailError);
          // Don't fail the request if email fails
        }
      }
    } else {
      console.log('⚠️ Skipping email - missing required fields (Email or FirstName)');
    }
    
    console.log('========================================');
    console.log('✅ CONTACT CREATE API completed successfully');
    console.log('========================================');
    
    return response;
  },

  async exportAll(ctx) {
    try {
      console.log('📊 Exporting all contacts...');
      
      // Get all contacts without any filters
      const contacts = await strapi.entityService.findMany('api::contact.contact', {
        populate: '*',
        sort: { id: 'desc' },
        pagination: {
          start: 0,
          limit: -1, // Get all records
        },
      });

      if (!contacts || contacts.length === 0) {
        return ctx.notFound('No contacts found');
      }

      console.log(`✅ Found ${contacts.length} contacts to export`);

      // Convert to CSV format
      const csvHeaders = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'Mobile',
        'Type',
      ];

      const csvRows = contacts.map(contact => [
        contact.id,
        contact.FirstName || '',
        contact.LastName || '',
        contact.Email || '',
        contact.Mobile || '',
        contact.Type || '',
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Set response headers for CSV download
      ctx.set('Content-Type', 'text/csv; charset=utf-8');
      ctx.set('Content-Disposition', `attachment; filename="contacts-export-${new Date().toISOString().split('T')[0]}.csv"`);

      console.log('✅ CSV export generated successfully');
      
      // Return CSV content with BOM for Excel compatibility
      ctx.body = '\uFEFF' + csvContent;

    } catch (error) {
      console.error('❌ Error exporting contacts:', error);
      ctx.throw(500, 'Error exporting contacts: ' + error.message);
    }
  },
}));
