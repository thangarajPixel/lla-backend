import { App } from './pages/App';

export default {
  register(app: any) {
    app.addMenuLink({
      to: '/plugins/admission-manager',
      icon: () => '📋',
      intlLabel: {
        id: 'admission-manager.plugin.name',
        defaultMessage: 'Admissions',
      },
      Component: App,
    });

    app.registerPlugin({
      id: 'admission-manager',
      name: 'admission-manager',
    });
  },

  bootstrap() {},
  
  async registerTrads() {
    return [];
  },
};
