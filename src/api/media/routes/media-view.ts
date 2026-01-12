export default {
  routes: [
    {
      method: 'GET',
    path: '/media/:slug',
    handler: 'media.findCard'
    },
  ],
};
