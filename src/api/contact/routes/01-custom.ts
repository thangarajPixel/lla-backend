export default {
  routes: [
    {
      method: 'GET',
      path: '/contacts/export',
      handler: 'contact.exportAll',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
