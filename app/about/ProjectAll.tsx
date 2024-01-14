'use client';

import { Container } from '@mantine/core';
import { ProjectDevJourney } from './ProjectDevJourney';
import { ProjectIntro } from './ProjectIntro';
import { ProjectAS } from './ProjectAS';
import classes from './styles.about.module.css';

export default function ProjectAll() {
  return (
    <Container className={classes.root}>
      <ProjectIntro />
      <ProjectDevJourney />
      <ProjectAS />
    </Container>
  );
}
