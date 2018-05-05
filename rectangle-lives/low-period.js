rectangleLives({
  rlePath: "./assets/low-period.rle",
  color: {
    alive: {
      red: 240,
      green: 240,
      blue: 240,
    },
    dying: {
      red: (ratio, yIndex, yIndexMax) => { return (1 - yIndex / yIndexMax) * (208 - ratio * 200); },
      green: (ratio, yIndex, yIndexMax) => { return 4; },
      blue: (ratio, yIndex, yIndexMax) => { return (yIndex / yIndexMax) * (208 - ratio * 200); },
    },
    background: [8, 8, 8],
  },
  afterImageFrameCount: 4,
  marginCells: 4,
  frameRate: 10,
});
