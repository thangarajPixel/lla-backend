
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
    {
      method: 'GET',
      path: '/faculty/founder/:slug',
      handler: 'faculty.founderBySlug',
      config: {
        auth: false,
      },
    },
  ],
};