'use client';

import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Paper, Button, Text, Stack, rem } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import classes from './styles.about.module.css';
import '@mantine/carousel/styles.css';

const data = [
  {
    image: '/static/images/Me.jpg',
    title: 'Pattaya, Thailand',
    link: 'https://www.pattayaelephantsanctuary.org/',
  },
  {
    image: '/static/images/Me2.jpg',
    title: 'Hawaii, US',
    link: 'https://wailuaheritagetrail.org/',
  },
  {
    image: '/static/images/Me3.jpg',
    title: 'Houston, US',
    link: 'https://spacecenter.org/',
  },
  {
    image: '/static/images/Me4.jpg',
    title: 'Alaska, US',
    link: 'https://goo.gl/maps/a8qpZHfNtGJgpyGo9',
  },
];

interface PaperCardProps {
  image: string;
  title: string;
  link: string;
}

function PaperCard({ image, title, link }: PaperCardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.carouselCard}
    >
      <Button
        color="dark"
        className={classes.carouselCategory}
        component="a"
        target="_blank"
        href={link}
      >
        {title}
      </Button>
    </Paper>
  );
}

export function PhotoCarousel() {
  const autoplay = useRef(Autoplay({ delay: 15000 }));

  return (
    <Stack align="center" gap="sm">
      <Text c="dimmed" ta="center">
        When I&apos;m Not Coding
      </Text>
      <Carousel
        slideGap={{ base: rem(2), sm: 'xl' }}
        align="start"
        withIndicators
        nextControlIcon={<IconArrowRight style={{ width: rem(16), height: rem(16) }} />}
        previousControlIcon={<IconArrowLeft style={{ width: rem(16), height: rem(16) }} />}
        slidesToScroll={1}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        withControls
        className={classes.carousel}
      >
        {data.map((img) => (
          <Carousel.Slide key={img.title}>
            <PaperCard {...img} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Stack>
  );
}
