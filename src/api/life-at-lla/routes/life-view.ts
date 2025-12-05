export default {
  routes: [
    {
      method: 'GET',
    path: '/life-at-lla/:id',
    handler: 'life-at-lla.findCard',
      config: {
        auth: false,
      },
    },
  ],
};