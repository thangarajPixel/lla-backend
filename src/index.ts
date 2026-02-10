// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    console.log('========================================');
    console.log('🔧 REGISTERING CUSTOM DELETE HANDLER');
    console.log('========================================');

    // Override content-manager delete controller
    const contentManagerPlugin = strapi.plugin('content-manager');
    
    if (contentManagerPlugin && contentManagerPlugin.controllers && contentManagerPlugin.controllers['collection-types']) {
      const originalDelete = contentManagerPlugin.controllers['collection-types'].delete;
      
      contentManagerPlugin.controllers['collection-types'].delete = async (ctx) => {
        const { model } = ctx.params;
        const { id } = ctx.params;

        console.log('========================================');
        console.log('🗑️ CUSTOM DELETE HANDLER called');
        console.log('Model:', model);
        console.log('ID:', id);
        console.log('========================================');

        // Check if this is admission model
        if (model === 'api::admission.admission') {
          console.log('✅ Admission model detected - using soft delete');

          try {
            // Soft delete using direct database query - BYPASSES component deletion
            const updated = await strapi.db.query('api::admission.admission').updateMany({
              where: { documentId: id },
              data: { IsDelete: true },
            });

            console.log('✅ Admission soft deleted successfully:', id);
            console.log('✅ All versions updated (draft + published)');
            console.log('✅ Component data preserved (Upload_Your_Portfolio, Work_Experience, etc.)');
            console.log('========================================');

            // Return success response
            ctx.body = {
              data: null,
            };
          } catch (error) {
            console.error('❌ Error in soft delete:', error);
            console.log('========================================');
            ctx.throw(500, 'Error deleting admission');
          }
        } else {
          // For other models, use default behavior
          console.log('ℹ️ Not admission model - using default delete');
          console.log('========================================');
          
          // Call the original delete method
          return await originalDelete(ctx);
        }
      };

      console.log('✅ Custom delete handler registered successfully');
      console.log('========================================');
    } else {
      console.error('❌ Failed to register custom delete handler - content-manager plugin not found');
      console.log('========================================');
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
