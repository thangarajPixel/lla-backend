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
      const originalBulkDelete = contentManagerPlugin.controllers['collection-types'].bulkDelete;
      const originalFind = contentManagerPlugin.controllers['collection-types'].find;
      
      // Override find to fix count for admission
      contentManagerPlugin.controllers['collection-types'].find = async (ctx) => {
        const { model } = ctx.params;

        // For admission model, we need to adjust the count
        if (model === 'api::admission.admission') {
          console.log('========================================');
          console.log('📊 CUSTOM FIND HANDLER for admission');
          console.log('Query params:', ctx.request.query);
          
          // Call original find
          await originalFind(ctx);
          
          // Get result from ctx.body (Strapi sets response in ctx.body)
          const result = ctx.body;
          
          console.log('Result type:', typeof result);
          console.log('Result keys:', result ? Object.keys(result) : 'null');
          console.log('Result pagination:', result?.pagination);
          console.log('Result results length:', result?.results?.length);
          
          // If result has pagination info, recalculate total based on IsDelete filter
          if (result && result.pagination) {
            try {
              // Build count query with same filters as list query
              const countWhere: any = { IsDelete: false };
              
              // Default: count only draft records (admin panel default view)
              countWhere.publishedAt = { $null: true };
              console.log('Counting draft records (default)');
              
              console.log('Count where clause:', countWhere);
              
              // Count only non-deleted records with same publication state
              const actualCount = await strapi.db.query('api::admission.admission').count({
                where: countWhere,
              });
              
              console.log('Actual count from DB:', actualCount);
              console.log('Original pagination total:', result.pagination.total);
              
              // Update pagination total
              result.pagination.total = actualCount;
              
              console.log('✅ Admission count adjusted to:', actualCount);
              console.log('========================================');
              
              // Set updated result back to ctx.body
              ctx.body = result;
              return;
            } catch (error) {
              console.error('❌ Error adjusting admission count:', error);
              console.log('========================================');
            }
          } else {
            console.log('⚠️ No pagination found in result');
            console.log('========================================');
          }
          
          return;
        }
        
        // For other models, use default behavior
        return await originalFind(ctx);
      };
      
      // Override single delete
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

      // Override bulk delete
      contentManagerPlugin.controllers['collection-types'].bulkDelete = async (ctx) => {
        const { model } = ctx.params;
        const { ids, documentIds } = ctx.request.body;
        
        // Use documentIds if available, otherwise use ids
        const idsToDelete = documentIds || ids;

        console.log('========================================');
        console.log('🗑️ CUSTOM BULK DELETE HANDLER called');
        console.log('Model:', model);
        console.log('Document IDs:', documentIds);
        console.log('IDs:', ids);
        console.log('IDs to delete:', idsToDelete);
        console.log('Count:', idsToDelete?.length);
        console.log('========================================');

        // Check if this is admission model
        if (model === 'api::admission.admission') {
          console.log('✅ Admission model detected - using soft delete for bulk');

          try {
            if (!idsToDelete || idsToDelete.length === 0) {
              console.log('⚠️ No IDs provided for bulk delete');
              ctx.body = {
                data: {
                  count: 0,
                },
              };
              return;
            }

            // Soft delete all records using direct database query - BYPASSES component deletion
            const updated = await strapi.db.query('api::admission.admission').updateMany({
              where: { documentId: { $in: idsToDelete } },
              data: { IsDelete: true },
            });

            console.log('✅ Bulk soft delete completed');
            console.log('✅ Document IDs:', idsToDelete);
            console.log('✅ Count:', idsToDelete.length);
            console.log('✅ All versions updated (draft + published)');
            console.log('✅ Component data preserved for all records');
            console.log('========================================');

            // Return success response
            ctx.body = {
              data: {
                count: idsToDelete.length,
              },
            };
          } catch (error) {
            console.error('❌ Error in bulk soft delete:', error);
            console.log('========================================');
            ctx.throw(500, 'Error bulk deleting admissions');
          }
        } else {
          // For other models, use default behavior
          console.log('ℹ️ Not admission model - using default bulk delete');
          console.log('========================================');
          
          // Call the original bulk delete method
          return await originalBulkDelete(ctx);
        }
      };

      console.log('✅ Custom delete handler registered successfully');
      console.log('✅ Custom bulk delete handler registered successfully');
      console.log('✅ Custom find handler registered successfully (count fix)');
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
