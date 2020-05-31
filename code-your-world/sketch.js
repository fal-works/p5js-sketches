示せ在処 = () => ({
  東: 乱(余白率 * 東西, (壱 - 余白率) * 東西),
  南: 乱(余白率 * 南北, (壱 - 余白率) * 南北),
  径: 乱(最小径, 最大径),
});

出でよ円 = (点) => 円(点.東, 点.南, 点.径);
出でよ方 = (点) => 方(点.東, 点.南, 方拡率 * 点.径);

出でよ線 = (甲, 乙) => {
  角 = 逆正接(乙.南 - 甲.南, 乙.東 - 甲.東);
  線(
    甲.東 + 甲.径 * 余弦(角),
    甲.南 + 甲.径 * 正弦(角),
    乙.東 - 乙.径 * 余弦(角),
    乙.南 - 乙.径 * 正弦(角)
  );
};

出でよ道 = () => {
  出でよ円((点 = 示せ在処()));
  for (_ = 零; _ < 円数; ++_) {
    出でよ線(点, (次点 = 示せ在処()));
    出でよ円((点 = 次点));
  }
};

出でよ方円 = () => {
  出でよ空();
  出でよ道();
  出でよ方(示せ在処());
  出でよ方(示せ在処());
};

// ----------------------------------------------------------------

const scaleFactor = 0.75;

const 出でよ空 = () => {
  createCanvas(scaleFactor * 東西, scaleFactor * 南北);
  scale(scaleFactor);

  background(248);
  stroke(32);
  strokeWeight(4);
  noFill();
  ellipseMode(RADIUS);

  square(2, 2, 東西 - 4, 南北 - 4);

  drawingContext.shadowOffsetX = scaleFactor * 20;
  drawingContext.shadowOffsetY = scaleFactor * 20;
  drawingContext.shadowBlur = scaleFactor * 16;
  drawingContext.shadowColor = `rgba(0, 0, 0, 0.5)`;
};

const 零 = 0;
const 壱 = 1;
const 東西 = 960;
const 南北 = 960;
const 円数 = 4;
const 最小径 = 30;
const 最大径 = 80;
const 方拡率 = 5;
const 余白率 = 0.1;
const 乱 = (min, max) => random(min, max);
const 円 = (x, y, d) => circle(x, y, d);
const 方 = (x, y, d) => square(x, y, d);
const 線 = (x1, y1, x2, y2) => line(x1, y1, x2, y2);
const 正弦 = Math.sin;
const 余弦 = Math.cos;
const 逆正接 = Math.atan2;

setup = 出でよ方円;

function keyTyped() {
  if (key == "s") save();
}
function mouseClicked() {
  出でよ方円();
}
