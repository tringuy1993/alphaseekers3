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
  gammadashboard: { title: 'Gamma Dashboard', href: '/gamma-dashboard' },
  profile: { title: 'Account settings', href: '/profile' },

  live0dte: { title: 'Live 0DTE', href: '/live0dte' },
  music: { title: 'Music', href: '/music' },
  about: { title: 'About', href: '/about' },
  signin: { title: 'Sign In', href: '/authentication/signin' },
  forgotpassword: { title: 'Forgot Password', href: '/authentication/forgot-password' },
  register: { title: 'Register', href: '/authentication/register' },
};

// Re-export from centralized auth config for backwards compatibility
// New code should import directly from '@/lib/auth/config'
export { PROTECTED_ROUTES as authorizedLinksList } from '@/lib/auth/config';

export type Siteconfig = typeof siteConfig;
