export default {
  routes: [
    {
      method: 'GET',
      path: '/admissions/:id/pdf',
      handler: 'api::admission.admission.generatePdf',
      config: {
        auth: false, // Disable authentication for this route
        policies: [],
        middlewares: [],
      },
    },
  ],
};