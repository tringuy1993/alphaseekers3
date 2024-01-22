'use client';

import { TextInput, Button, Group, Anchor, Center, Box, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import AuthFormLayout from './AuthFormLayout';

export default function ForgotPassword() {
  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  return (
    <AuthFormLayout authTitle="forgotpassword">
      <form
        onSubmit={form.onSubmit((values) => {
          const { email } = values;
          return email;
        })}
      >
        <TextInput label="Your email" placeholder="me@email.dev" required />
        <Group justify="space-between" mt="lg">
          <Anchor c="dimmed" size="sm">
            <Center inline>
              <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
          <Button>Reset password</Button>
        </Group>
      </form>
    </AuthFormLayout>
  );
}
