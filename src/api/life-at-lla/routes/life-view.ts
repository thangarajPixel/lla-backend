export default {
  routes: [
    {
      method: 'GET',
    path: '/life-at-lla/:slug',
    handler: 'life-at-lla.findCard'
    },
  ],
};