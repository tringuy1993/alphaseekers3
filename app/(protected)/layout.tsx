import RequireAuth from '../authentication/RequireAuth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
