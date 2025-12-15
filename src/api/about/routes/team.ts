export default {
  routes: [
    {
      method: "GET",
      path: "/about/team/:slug",
      handler: "about.teamBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
