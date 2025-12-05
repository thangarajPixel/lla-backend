/**
 * custom course router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/view/:slug',
      handler: 'course.findBySlug',
      config: {
        auth: false,
      },
    },
  ],
};
