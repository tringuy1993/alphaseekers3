import { Metadata } from 'next';
import ProjectAll from './ProjectAll';

export const metadata: Metadata = {
  title: 'About Tree',
  description: 'About Tree',
};

export default function PageAbout() {
  return <ProjectAll />;
}
