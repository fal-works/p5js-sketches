rectangleLives({
  rlePath: "./assets/ark2.rle",
  color: {
    alive: {
      red: 80,
      green: 80,
      blue: 80,
    },
    dying: {
      red: (ratio, yIndex, yIndexMax) => { return 96 + ratio * 156; },
      green: (ratio, yIndex, yIndexMax) => { return 208 + ratio * 47; },
      blue: (ratio, yIndex, yIndexMax) => { return 192 + ratio * 56; },
    },
    background: [252, 255, 248],
  },
  marginCells: 80,
  afterImageFrameCount: 6,
  frameRate: 20
});
