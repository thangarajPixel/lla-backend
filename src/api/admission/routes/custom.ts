export default {
  routes: [
    {
      method: 'GET',
      path: '/admissions/:id/pdf',
      handler: 'admission.generatePdf',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/admissions/export',
      handler: 'admission.exportAll',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};