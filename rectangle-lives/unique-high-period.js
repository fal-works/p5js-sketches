rectangleLives({
  rlePath: "./assets/unique-high-period.rle",
  color: {
    alive: {
      red: 240,
      green: 240,
      blue: 240,
    },
    dying: {
      red: (ratio, yIndex, yIndexMax) => { return 208 - ratio * 200; },
      green: (ratio, yIndex, yIndexMax) => { return (1 - yIndex / yIndexMax) * (208 - ratio * 200); },
      blue: (ratio, yIndex, yIndexMax) => { return 4; },
    },
    background: [8, 8, 8],
  },
  afterImageFrameCount: 6,
  marginCells: 12,
  frameRate: 30,
});
