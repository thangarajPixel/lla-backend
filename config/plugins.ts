module.exports = {
  documentation: {
    enabled: true,
    config: {
      info: {
        title: "API Documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: process.env.SERVER_URL || "https://dev-admin.lightandlifeacademy.in/api/",
          description: "Live Server",
        },
        {
          url: "http://localhost:8000/api/",
          description: "Local Server",
        }
      ]
    },
  },
  "strapi-csv-import-export": {

          config: {

            authorizedExports: ["api::admission.admission"],

            authorizedImports: ["api::admission.admission"]

  }

}
};
