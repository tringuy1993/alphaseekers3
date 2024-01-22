'use client';

import { Container, Loader } from '@mantine/core';

export default function MainLoading() {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader size={50} type="dots" />
    </Container>
  );
}
