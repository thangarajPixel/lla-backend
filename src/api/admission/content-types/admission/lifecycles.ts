export default {
  async afterUpdate(event: any) {
    const { result, params } = event;

    // Check if step_3 is true and Payment_Status is Paid
    if (result.step_3 === true && result.Payment_Status === 'Paid') {
      try {
        console.log('Registration completed for admission:', result.id);
        
        // Get the email service
        const emailService = require('../../services/email').default;
        // Send registration emails
       const em= await emailService.sendRegistrationEmail(result);
       await emailService.getPaymentIDStatus(result);
        console.log(em);
        console.log('Registration emails sent successfully');
      } catch (error) {
        console.error('Error sending registration emails:', error);
        // Don't throw error to prevent update from failing
      }
    }
    
  },
};
