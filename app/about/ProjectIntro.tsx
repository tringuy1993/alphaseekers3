'use client';

import { Grid, Space, Title, Text } from '@mantine/core';
import { Images } from './IntroImages';
import classes from './styles.about.module.css';

export function ProjectIntro() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 6, xl: 7 }}>
        <Title order={1} size="75px">
          FullStack Developer
        </Title>
        <Title size="35px">Hi, I&apos;m Tri Nguyen.</Title>
        <Space h="lg" />
        <Text size="25px" style={{ textAlign: 'justify' }}>
          I am a passionate, self-taught, full-stack developer who goes the extra mile, dedicating
          40 hours of coding after my 9-5 job. With my unwavering commitment to continuous learning
          and delivering high-quality solutions, I thrive in fast-paced environments and excel at
          turning complex ideas into functional and intuitive applications.
        </Text>
        <Space h="xl" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 6, xl: 5 }} className={classes.introColumn}>
        <Images />
      </Grid.Col>
    </Grid>
  );
}
