/**
 * admission controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::admission.admission', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    // Check if id is numeric (for swagger compatibility)
    if (/^\d+$/.test(id)) {
      // Find by numeric id and get documentId
      const entity = await strapi.entityService.findMany('api::admission.admission', {
        filters: { id: parseInt(id) },
        populate: ctx.query.populate,
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound('Admission not found');
      }

      // Use the documentId for the actual lookup
      ctx.params.id = entity[0].documentId;
    }

    // Call the default findOne method
    return super.findOne(ctx);
  },

  async generatePdf(ctx) {
    const { id } = ctx.params;

    try {
      // Find admission by numeric id
      let admission;
      if (/^\d+$/.test(id)) {
        const entities = await strapi.entityService.findMany('api::admission.admission', {
          filters: { id: parseInt(id) },
          populate: '*',
        });
        admission = entities[0];
      } else {
        // Find by documentId
        admission = await strapi.entityService.findOne('api::admission.admission', id, {
          populate: '*',
        });
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

        // Generate PDF buffer
        const pdfBuffer = await pdfGenerator.generateAdmissionPDF(formattedData);

        // Set response headers for PDF
        ctx.set('Content-Type', 'application/pdf');
        ctx.set('Content-Disposition', `inline; filename="admission-${admission.id}.pdf"`);

        // Return PDF buffer
        ctx.body = pdfBuffer;

      } catch (pdfError) {
        console.error('PDF generation failed, falling back to HTML:', pdfError);

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
  }
}));
