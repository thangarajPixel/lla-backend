// Track which admissions have already sent emails in this process
const emailSentCache = new Set();
// Track which admissions are being soft deleted to prevent infinite loops
const softDeleteInProgress = new Set();
// Track bulk delete operations
const bulkDeleteTracker = {
  operations: new Map(),
  timeout: 1000, // 1 second timeout to group operations
  
  addOperation(entityId: any) {
    const now = Date.now();
    this.operations.set(entityId, now);
    
    // Clean up old operations
    for (const [id, timestamp] of this.operations.entries()) {
      if (now - timestamp > this.timeout) {
        this.operations.delete(id);
      }
    }
  },
  
  isBulkOperation() {
    return this.operations.size > 1;
  },
  
  getOperationIds() {
    return Array.from(this.operations.keys());
  }
};

export default {
  async beforeDelete(event: any) {
    const { params } = event;
    console.log('========================================');
    console.log('🗑️ LIFECYCLE BEFORE DELETE called');
    console.log('Params:', params);
    console.log('Where:', params.where);
    
    // Get the entity ID
    const entityId = params.where.id || params.where.documentId;
    
    // Add to bulk delete tracker
    if (entityId) {
      bulkDeleteTracker.addOperation(entityId);
      console.log('🔍 Bulk delete tracker - Current operations:', bulkDeleteTracker.getOperationIds());
      console.log('🔍 Is bulk operation:', bulkDeleteTracker.isBulkOperation());
    }
    
    console.log('========================================');

    try {
      // Handle bulk delete (when params.where has documentIds array)
      if (params.where.documentIds && Array.isArray(params.where.documentIds)) {
        console.log('📦 BULK DELETE DETECTED - documentIds array');
        console.log('DocumentIds to soft delete:', params.where.documentIds);
        
        // Soft delete all records by documentIds
        await strapi.db.query('api::admission.admission').updateMany({
          where: { documentId: { $in: params.where.documentIds } },
          data: { IsDelete: true },
        });
        
        console.log('✅ Bulk soft delete completed for documentIds:', params.where.documentIds);
        
        // Prevent actual deletion by setting impossible condition
        params.where = { documentId: 'impossible-id-that-does-not-exist-12345' };
        return;
      }

      // Handle bulk delete with other conditions (no specific id or documentIds)
      if (!params.where.id && !params.where.documentId && !params.where.documentIds) {
        console.log('📦 BULK DELETE DETECTED - general conditions');
        
        // First, find all records that match the where conditions
        const recordsToDelete = await strapi.db.query('api::admission.admission').findMany({
          where: params.where,
          select: ['id', 'documentId']
        });
        
        console.log('Records to soft delete:', recordsToDelete.map(r => r.id || r.documentId));
        
        // Soft delete all matching records
        if (recordsToDelete.length > 0) {
          const idsToDelete = recordsToDelete.map(r => r.id).filter(Boolean);
          const documentIdsToDelete = recordsToDelete.map(r => r.documentId).filter(Boolean);
          
          if (idsToDelete.length > 0) {
            await strapi.db.query('api::admission.admission').updateMany({
              where: { id: { $in: idsToDelete } },
              data: { IsDelete: true },
            });
          }
          
          if (documentIdsToDelete.length > 0) {
            await strapi.db.query('api::admission.admission').updateMany({
              where: { documentId: { $in: documentIdsToDelete } },
              data: { IsDelete: true },
            });
          }
          
          console.log('✅ Bulk soft delete completed for IDs:', idsToDelete, 'DocumentIds:', documentIdsToDelete);
        }
        
        // Prevent actual deletion by setting impossible condition
        params.where = { id: -999999 };
        return;
      }

      // Handle single delete or individual records in bulk operation
      if (!entityId) {
        console.log('No entity ID found, allowing delete to proceed');
        return;
      }

      // Check if this entity is already being processed to prevent infinite loop
      const cacheKey = `delete_${entityId}`;
      if (softDeleteInProgress.has(cacheKey)) {
        console.log('Soft delete already in progress for:', entityId, '- skipping');
        // Prevent deletion by setting impossible condition
        params.where = { id: -999999 };
        return;
      }

      // Mark as in progress
      softDeleteInProgress.add(cacheKey);
      
      // Check if this is part of a bulk operation
      if (bulkDeleteTracker.isBulkOperation()) {
        console.log('� PART OFD BULK OPERATION - Soft deleting entity ID:', entityId);
        console.log('📦 All IDs in bulk operation:', bulkDeleteTracker.getOperationIds());
      } else {
        console.log('📄 SINGLE DELETE - Soft deleting entity ID:', entityId);
      }
      
      // Update the record to set IsDelete = true using direct database query
      if (params.where.id) {
        await strapi.db.query('api::admission.admission').update({
          where: { id: entityId },
          data: { IsDelete: true },
        });
      } else if (params.where.documentId) {
        await strapi.db.query('api::admission.admission').update({
          where: { documentId: entityId },
          data: { IsDelete: true },
        });
      }
      
      console.log('✅ Admission soft deleted via lifecycle:', entityId);
      console.log('🛑 Preventing actual deletion by modifying where clause');
      console.log('========================================');
      
      // Prevent the actual deletion by modifying the where clause to impossible condition
      params.where = { id: -999999 };
      
    } catch (error) {
      console.error('❌ Error in beforeDelete lifecycle:', error);
    } finally {
      // Clean up progress tracking
      if (entityId) {
        const cacheKey = `delete_${entityId}`;
        softDeleteInProgress.delete(cacheKey);
      }
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;
    
    // Check if result exists to prevent null reference errors
    if (!result) {
      console.log('After Update: No result data available - skipping');
      return;
    }
    
    console.log('After Update Admission Lifecycle Triggered for ID:', result.step_3, result.Payment_Status);

    // Check if step_3 is true and Payment_Status is Paid
    if (result.step_3 === true && result.Payment_Status === 'Paid') {
      
      // Check if we already sent email for this admission in this process
      const cacheKey = `${result.id}`;
      if (emailSentCache.has(cacheKey)) {
        console.log('Email already sent for admission:', result.id, '- skipping (cache)');
        return;
      }
      
      // Check if registration_email_sent flag is already set in database
      if (result.registration_email_sent === true) {
        console.log('Registration email already sent (from database) for admission:', result.id);
        return;
      }

      try {
        console.log('Registration completed for admission:', result.id);
        
        // Mark in cache immediately to prevent duplicate calls
        emailSentCache.add(cacheKey);
        
        // Get the email service
        const emailService = require('../../services/email').default;
        
        // IMPORTANT: First get payment status to update mihpayid and PayUId
        console.log('Fetching payment status from PayU...');
        await emailService.getPaymentIDStatus(result);
        
        // Fetch the updated admission data with payment details
        console.log('Fetching updated admission data...');
        const updatedAdmission = await strapi.entityService.findOne(
          'api::admission.admission',
          result.id,
          {
            populate: ['Course'],
          }
        );
        
        console.log('Payment details - mihpayid:', updatedAdmission.mihpayid, 'PayUId:', updatedAdmission.PayUId);
        
        // Now send registration emails with complete payment details
        const em = await emailService.sendRegistrationEmail(updatedAdmission);
        console.log(em);
        console.log('Registration emails sent successfully');
        
        // Mark that registration email has been sent to prevent duplicates
        // Use direct query to avoid triggering another afterUpdate
        await strapi.db.query('api::admission.admission').update({
          where: { id: result.id },
          data: {
            registration_email_sent: true,
          },
        });
        
      } catch (error) {
        console.error('Error sending registration emails:', error);
        // Remove from cache on error so it can retry
        emailSentCache.delete(cacheKey);
        // Don't throw error to prevent update from failing
      }
    }
    
  },

  async beforeFindMany(event: any) {
    const { params } = event;
    console.log('🔍 beforeFindMany: Adding IsDelete=false filter to query');
    
    // Add IsDelete = false condition to the where clause
    if (!params.where) {
      params.where = {};
    }
    
    // Force IsDelete to be false
    params.where.IsDelete = false;
    
    console.log('🔍 beforeFindMany: Updated where clause:', params.where);
  },

  async afterFindMany(event: any) {
    const { result } = event;
    
    // Filter to show only records where IsDelete is explicitly false
    if (result && Array.isArray(result)) {
      const filteredResult = result.filter(record => record.IsDelete === false);
      console.log(`🔍 afterFindMany: Showing only IsDelete=false records. Filtered out ${result.length - filteredResult.length} records`);
      console.log(`🔍 Total records found: ${result.length}, Records with IsDelete=false: ${filteredResult.length}`);
      
      // Replace the result with filtered records
      event.result = filteredResult;
    }
  },

  async beforeFindOne(event: any) {
    const { params } = event;
    console.log('🔍 beforeFindOne: Adding IsDelete=false filter to query');
    
    // Add IsDelete = false condition to the where clause
    if (!params.where) {
      params.where = {};
    }
    
    // Force IsDelete to be false
    params.where.IsDelete = false;
    
    console.log('🔍 beforeFindOne: Updated where clause:', params.where);
  },

  async afterFindOne(event: any) {
    const { result } = event;
    
    // If the record is not explicitly IsDelete = false, return null
    if (result && result.IsDelete !== false) {
      console.log(`🔍 afterFindOne: Hiding record ID: ${result.id} (IsDelete is not false)`);
      event.result = null;
    }
  },
};