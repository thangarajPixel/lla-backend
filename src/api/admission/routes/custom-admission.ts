export default {
  routes: [
    {
      method: 'GET',
      path: '/admissions/:id/pdf',
      handler: 'admission.generatePdf',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/admissions/export',
      handler: 'admission.exportAll',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admissions/check-email',
      handler: 'admission.checkEmailUnique',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/admissions/:id/payment-link',
      handler: 'admission.generatePaymentLink',
      config: {
        policies: [],
        middlewares: [],
      },
    },
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