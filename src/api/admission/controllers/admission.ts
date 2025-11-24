/**
 * admission controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::admission.admission', ({ strapi }) => ({
  // Custom action endpoint
  async performAction(ctx) {
    const { id } = ctx.params;
    
    try {
      // Your custom action logic here
      console.log('Performing action for admission:', id);
      
      // Example: Update status, send email, etc.
      const admission = await strapi.entityService.findOne('api::admission.admission', id);
      
      return ctx.send({
        success: true,
        message: 'Action completed successfully',
        data: admission
      });
    } catch (error) {
      return ctx.badRequest('Action failed');
    }
  },
}));
