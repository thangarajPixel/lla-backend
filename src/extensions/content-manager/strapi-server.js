module.exports = (plugin) => {
  // Get the default delete controller
  const defaultDelete = plugin.controllers['collection-types'].delete;

  // Override the delete method
  plugin.controllers['collection-types'].delete = async (ctx) => {
    const { model } = ctx.params;
    const { id } = ctx.params;

    console.log('========================================');
    console.log('🗑️ CONTENT MANAGER DELETE called');
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
      return await defaultDelete(ctx);
    }
  };

  return plugin;
};
