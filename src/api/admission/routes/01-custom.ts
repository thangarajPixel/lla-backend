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
      path: '/admissions/:id/pdf-download',
      handler: 'admission.adminGeneratePdf',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
     {
      method: 'PUT',
      path: '/admission-update/:id',
      handler: 'admission.admissionUpdate',
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
    {
      method: 'POST',
      path: '/admissions/email/check',
      handler: 'admission.checkEmailUnique',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
