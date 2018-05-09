rectangleLives({
  rlePath: "./assets/queen-bee-turn.rle",
  color: {
    alive: {
      red: 240,
      green: 240,
      blue: 240,
    },
    dying: {
      red: (ratio, yIndex, yIndexMax) => { return (1 - yIndex / yIndexMax) * (248 - ratio * 244); },
      green: (ratio, yIndex, yIndexMax) => { return 4; },
      blue: (ratio, yIndex, yIndexMax) => { return (yIndex / yIndexMax) * (248 - ratio * 244); },
    },
    background: [4, 4, 4],
  },
  afterImageFrameCount: 20
});
