export const queryKeys = {
  ride: {
    all: ['ride'] as const,
    active: () => [...queryKeys.ride.all, 'active'] as const
  },
  fares: {
    all: ['fares'] as const,
    estimate: () => [...queryKeys.fares.all, 'estimate'] as const
  },
  routes: {
    all: ['routes'] as const,
    matchCandidates: () => [...queryKeys.routes.all, 'match-candidates'] as const
  }
};
