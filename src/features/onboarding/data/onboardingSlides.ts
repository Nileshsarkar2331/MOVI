import { ComponentProps } from 'react';

import { MobilityVisual } from '@/features/onboarding/components/MobilityVisual';

export type OnboardingSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  visual: ComponentProps<typeof MobilityVisual>['variant'];
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'cheaper-rides',
    eyebrow: 'Split the route',
    title: 'Cheaper rides without waiting forever.',
    body: 'MOVI finds people moving your way and shares the fare intelligently.',
    visual: 'fare'
  },
  {
    id: 'smart-sharing',
    eyebrow: 'Smarter sharing',
    title: 'Your route becomes a live ride network.',
    body: 'Pick a destination, watch nearby shared paths wake up, and join the best match.',
    visual: 'network'
  },
  {
    id: 'live-mobility',
    eyebrow: 'Live city flow',
    title: 'Autos and cabs that move with the city.',
    body: 'See timing, passenger count, and shared ride movement in one calm map-first flow.',
    visual: 'motion'
  }
];
