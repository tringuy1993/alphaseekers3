'use client';

import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Paper, Button, rem } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';

import classes from './styles.about.module.css';
import '@mantine/carousel/styles.css';

const data = [
  {
    image: '/static/images/Me.jpg',
    title: 'Pattaya, Thailand',
    category: 'Nature',
    link: 'https://www.pattayaelephantsanctuary.org/',
    priority: true,
  },
  {
    image: '/static/images/Me2.jpg',
    title: 'Hawaii, US',
    category: 'Nature',
    link: 'https://wailuaheritagetrail.org/',
    priority: false,
  },
  {
    image: '/static/images/Me3.jpg',
    title: 'Houston, US',
    category: 'Nature',
    link: 'https://spacecenter.org/',
    priority: false,
  },
  {
    image: '/static/images/Me4.jpg',
    title: 'Alaska, US',
    category: 'Nature',
    link: 'https://goo.gl/maps/a8qpZHfNtGJgpyGo9',
    priority: false,
  },
];

interface PaperCardProps {
  image: string;
  title: string;
  // category: string;
  link: string;
}

function PaperCard({ image, title, link }: PaperCardProps) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    >
      <Button color="dark" className={classes.category} component="a" target="_blank" href={link}>
        {title}
      </Button>
    </Paper>
  );
}

export const Images: React.FC = () => {
  const autoplay = useRef(Autoplay({ delay: 15000 }));
  const slides = data.map((img) => (
    <Carousel.Slide key={img.title}>
      <PaperCard {...img} />
    </Carousel.Slide>
  ));

  return (
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
      // sx={classes.carousel}
      className={classes.carousel}
    >
      {slides}
    </Carousel>
  );
};
