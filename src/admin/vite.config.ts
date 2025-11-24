import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    define: {
      'process.env.ADMISSION_VIEW_URL': JSON.stringify(process.env.ADMISSION_VIEW_URL),
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
};
