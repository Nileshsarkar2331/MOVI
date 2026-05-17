export const animation = {
  duration: {
    instant: 80,
    fast: 160,
    normal: 260,
    slow: 420
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)'
  },
  spring: {
    gentle: {
      damping: 18,
      stiffness: 180,
      mass: 1
    },
    snappy: {
      damping: 16,
      stiffness: 240,
      mass: 0.9
    }
  }
} as const;
