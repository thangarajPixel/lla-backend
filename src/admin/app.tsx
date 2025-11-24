import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    auth: {
      logo: 'http://localhost:8000/uploads/logo.png',
    },
    menu:{
       logo:"http://localhost:8000/uploads/logo.png",
    },
    tutorials: false,
    notifications: { release: false },
    locales: ['en', 'fr'],
    translations: {
      en: {
         'Auth.form.welcome.title': 'Welcome to Light & Life Academy',
         'Auth.form.welcome.subtitle': 'Log in to manage your content',
      },
      fr: {
         'Auth.form.welcome.title': 'Bienvenue à Light & Life Academy',
         'Auth.form.welcome.subtitle': 'Connectez-vous pour gérer votre contenu',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log('Custom admin loaded', app);
  },
};
