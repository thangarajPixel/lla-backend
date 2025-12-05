/**
 * contact controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    console.log('========================================');
    console.log('📝 CONTACT CREATE API called');
    console.log('========================================');

    // Call default create
    const response = await super.create(ctx);

    console.log('✅ Contact record created - ID:', response.data?.id);

    // Check if Type is "Request Information" and send email
    const contactData = response.data;
    if (contactData && contactData.Type === 'Request Information' && contactData.Email && contactData.FirstName) {
      console.log('📧 Type is "Request Information", sending email...');
      try {
        const emailService = require('../../admission/services/email').default;
        await emailService.sendRequestInformationEmail(contactData);
        console.log('✅ Request Information email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send Request Information email:', emailError);
        // Don't fail the request if email fails
      }
    }

    console.log('========================================');
    return response;
  },
}));
