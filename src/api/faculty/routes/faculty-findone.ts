
export default {
  routes: [
    {
      method: 'GET',
      path: '/faculty/view/:slug',
      handler: 'faculty.findOne',
      config: {
        auth: false,
      },
    },
  ],
};