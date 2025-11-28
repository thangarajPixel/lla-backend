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
  async findOne(ctx) {
    const { id } = ctx.params;

    const populateConfig = {
      passport_size_image: true,
      state: true,
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
      // Find by numeric id with full population
      const entities = await strapi.entityService.findMany('api::admission.admission', {
        filters: { id: parseInt(id) },
        populate: populateConfig,
      });

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

        // Generate PDF buffer
        const pdfBuffer = await pdfGenerator.generateAdmissionPDF(formattedData);

        // Set response headers for PDF download
        ctx.set('Content-Type', 'application/pdf');
        ctx.set('Content-Disposition', `attachment; filename="admission-${admission.id}.pdf"`);

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
  }
}));
