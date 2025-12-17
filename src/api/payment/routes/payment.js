module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/create',
      handler: 'payment.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST', 
      path: '/payment/success',
      handler: 'payment.success',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/failure', 
      handler: 'payment.failure',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/webhook',
      handler: 'payment.webhook',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};