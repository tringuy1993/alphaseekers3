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
  profile: { title: 'Account settings', href: '/profile' },

  live0dte: { title: 'Live 0DTE', href: '/live0dte' },
  music: { title: 'Music', href: '/music' },
  about: { title: 'About', href: '/about' },
  signin: { title: 'Sign In', href: '/authentication/signin' },
  forgotpassword: { title: 'Forgot Password', href: '/authentication/forgot-password' },
  register: { title: 'Register', href: '/authentication/register' },
};

export const authorizedLinksList = [
  siteLinks.optionsdata.href,
  siteLinks.backtest.href,
  siteLinks.optionstime.href,
  siteLinks.profile.href,
];

export type Siteconfig = typeof siteConfig;
