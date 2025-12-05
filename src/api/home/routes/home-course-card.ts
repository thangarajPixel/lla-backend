export default {
  routes: [
    {
      method: "GET",
      path: "/courses-list",
      handler: "api::home.home.findCourse",
      config: { auth: false },
    },
  ],
};
