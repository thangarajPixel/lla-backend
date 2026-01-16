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
