export default {
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'LLA Academy API',
        description: 'API documentation for LLA Academy',
        license: {
          name: 'MIT',
        },
      },
      'x-strapi-config': {
        plugins: ['users-permissions', 'upload'],
      },
    },
  },
  'admission-manager': {
    enabled: true,
    resolve: './src/plugins/admission-manager',
  },
}
