export default {
  routes: [
    {
      method: 'GET',
      path: '/admissions/:id/payment-status',
      handler: 'admission.getPaymentStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admissions/:id/create-payment',
      handler: 'admission.createPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};