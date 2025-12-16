
export default {
  routes: [
    {
      method: 'GET',
      path: '/faculty/view/:key/:slug',
      handler: 'faculty.findOne',
      config: {
        auth: false,
      },
    },
  ],
};