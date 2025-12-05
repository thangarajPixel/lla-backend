export default {
  routes: [
    {
      method: 'GET',
    path: '/life/:id',
    handler: 'life.findCard',
      config: {
        auth: false,
      },
    },
  ],
};