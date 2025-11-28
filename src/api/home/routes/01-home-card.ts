export default {
  routes: [
    {
      method: "GET",
      path: "/home/find-cards",
      handler: "api::home.home.findCards",
      config: { auth: false },
    }
  ],
};
