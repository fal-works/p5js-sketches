rectangleLives({
  rlePath: "./assets/queen-bee-turn.rle",
  afterImageFrameCount: 6,
  frameRate: 30,
  marginCells: 0,
  color: {
    alive: {
      red: 24,
      green: 32,
      blue: 48,
    },
    dying: {
      red: (ratio, yIndex, yIndexMax) => { return 248 - (yIndex / yIndexMax) * (1 - ratio) * 128; },
      green: (ratio, yIndex, yIndexMax) => { return 252 - (1 - 0.5 * yIndex / yIndexMax) * (1 - ratio) * 128; },
      blue: (ratio, yIndex, yIndexMax) => { return 255; },
    },
    background: [248, 252, 255],
  },
});
