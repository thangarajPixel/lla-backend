export default {
  routes: [
    {
      method: "GET",
      path: "/about/founder/:slug",
      handler: "about.founderBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
