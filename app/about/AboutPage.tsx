'use client';

import { Container, Stack } from '@mantine/core';
import { HeroSection } from './HeroSection';
import { SkillsSection } from './SkillsSection';
import { ProjectShowcase } from './ProjectShowcase';
import { JourneyTimeline } from './JourneyTimeline';
import { PhotoCarousel } from './PhotoCarousel';
import { ContactSection } from './ContactSection';

export default function AboutPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap={60}>
        <HeroSection />
        <SkillsSection />
        <ProjectShowcase />
        <JourneyTimeline />
        <PhotoCarousel />
        <ContactSection />
      </Stack>
    </Container>
  );
}
