export const siteConfig = {
  name: 'AlphaSeekers',
  url: 'https://alpha-seekers.com',
  description: 'Seeking Greek Alphas',
  links: {
    github: 'https://github.com/tringuy1993',
  },
};

export const siteLinks = {
  optionsdata: { title: 'Options Data', href: '/options-data' },
  backtest: { title: 'Back Test', href: '/backtest' },
  optionstime: { title: 'Options Time', href: '/options-time' },

  live0dte: { title: 'Live 0DTE', href: '/live0dte' },
  music: { title: 'Music', href: '/music' },
  about: { title: 'About', href: '/about' },
  signin: { title: 'Sign In', href: '/authentication/signin' },
  forgotpassword: { title: 'Forgot Password', href: '/authentication/forgot-password' },
  register: { title: 'Register', href: '/authentication/register' },
};

export type Siteconfig = typeof siteConfig;
