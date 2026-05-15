import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.(stories|story).@(js|jsx|ts|tsx)'],
  addons: ['storybook-dark-mode', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
};

export default config;
