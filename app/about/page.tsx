import { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'About | Tri Nguyen - Fullstack Developer',
  description:
    'Fullstack developer specializing in real-time financial analytics — Next.js, Django, PostgreSQL, TimescaleDB.',
};

export default function PageAbout() {
  return <AboutPage />;
}
