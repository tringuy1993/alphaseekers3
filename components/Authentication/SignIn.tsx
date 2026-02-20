'use client';

import { useCallback } from 'react';
import { TextInput, PasswordInput, Checkbox, Group, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

import AuthFormLayout from './AuthFormLayout';
import { type SignInCredential, useAuth } from '@/app/authentication/context';

export default function SignIn() {
  const { handleSignIn, errAuth } = useAuth();
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? null : 'Invalid email',
      password: (value) => (value.length < 8 ? 'Password must be at least 8 characters' : null),
    },
  });

  const handleOnSubmit = useCallback((values: SignInCredential) => {
    handleSignIn(values);
    // Reset Password Fields
    form.setFieldValue('password', '');
  }, []);

  return (
    <AuthFormLayout authTitle="signin">
      <form onSubmit={form.onSubmit((values) => handleOnSubmit(values))}>
        <TextInput
          label="Email"
          placeholder="you@email.dev"
          {...form.getInputProps('email')}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          required
          mt="md"
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
        </Group>

        <Button type="submit" fullWidth mt="xl">
          Sign in
        </Button>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          {errAuth}
        </Text>
      </form>
    </AuthFormLayout>
  );
}
