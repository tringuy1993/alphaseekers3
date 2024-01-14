import { Metadata } from 'next';
import SignIn from '@/components/Authentication/SignIn';

export const metadata: Metadata = {
  title: 'Authentication | Signin',
  description: 'Authentication Signin',
};

export default function PageSignIn() {
  return <SignIn />;
}
