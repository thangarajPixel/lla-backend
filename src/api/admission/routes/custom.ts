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
    {
      method: 'GET',
      path: '/admissions/export',
      handler: 'api::admission.admission.exportAll',
      config: {
        auth: false, // Disable authentication for this route
        policies: [],
        middlewares: [],
      },
    },
  ],
};