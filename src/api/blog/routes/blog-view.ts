export default {
  routes: [
    {
      method: 'GET',
      path: '/blog/:slug',
      handler: 'blog.findCard'
    },
    {
      method: 'PUT',
      path: '/blog/update-cards',
      handler: 'blog.updateCards'
    },
  ],
};