import { Metadata } from 'next';
import ForgotPassword from '@/components/Authentication/ForgotPassword';

export const metadata: Metadata = {
  title: 'Authentication | Reset Password',
  description: 'Authentication reset password',
};
export default function PageForgotPassword() {
  return <ForgotPassword />;
}
