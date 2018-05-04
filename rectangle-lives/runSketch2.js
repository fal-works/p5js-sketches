rectangleLives(
  "./assets/vacuum-cleaner.rle",
  "",
  {
    alive: {
      red: 240,
      green: 224,
      blue: 232,
    },
    dying: {
      red: (ratio) => { return 224 - ratio * 240; },
      green: (ratio) => { return 4; },
      blue: (ratio) => { return 64 - ratio * 60; },
    },
    background: [4, 4, 4],
  },
  20
);
