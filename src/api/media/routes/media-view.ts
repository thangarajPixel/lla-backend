export default {
  routes: [
    {
      method: 'GET',
      path: '/media/:slug',
      handler: 'media.findCard'
    },
    {
      method: 'PUT',
      path: '/media/update-cards',
      handler: 'media.updateCards'
    },
  ],
};
