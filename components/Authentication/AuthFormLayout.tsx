import { ReactNode } from 'react';
import { Anchor, Paper, Title, Text, Container } from '@mantine/core';
import classes from './Auth.module.css';
import { siteLinks } from '@/config/site';

interface AuthLayoutProps {
  authTitle: 'signin' | 'forgotpassword';
  children: ReactNode;
}

const titleMap = {
  signin: 'Sign In!',
  forgotpassword: 'Forgot your password?',
};

export default function AuthFormLayout({ authTitle, children }: AuthLayoutProps) {
  const title = titleMap[authTitle];
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        {title}
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {children}
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component="a" href={siteLinks.register.href}>
            Create account
          </Anchor>
          <br />
          {authTitle === 'signin' ? (
            <Anchor component="a" href={siteLinks.forgotpassword.href} size="sm">
              Forgot password?
            </Anchor>
          ) : null}
        </Text>
      </Paper>
    </Container>
  );
}
