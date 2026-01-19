export default {
  routes: [
    {
      method: 'GET',
      path: '/life-at-lla/:slug',
      handler: 'life-at-lla.findCard'
    },
    {
      method: 'PUT',
      path: '/life-at-lla/update-cards',
      handler: 'life-at-lla.updateCards'
    },
  ],
};