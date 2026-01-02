// Track which admissions have already sent emails in this process
const emailSentCache = new Set();

export default {
  async afterUpdate(event: any) {
    const { result, params } = event;
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
        
        // Send registration emails
        const em = await emailService.sendRegistrationEmail(result);
        await emailService.getPaymentIDStatus(result);
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
};
