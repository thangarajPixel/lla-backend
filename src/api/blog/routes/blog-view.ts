export default {
  routes: [
    {
      method: 'GET',
    path: '/blog/:slug',
    handler: 'blog.findCard'
    },
  ],
};