東西 = 960;
南北 = 960;

示せ在処 = () => ({
  東: 乱(0.1 * 東西, 0.9 * 東西),
  南: 乱(0.1 * 南北, 0.9 * 南北),
  径: 乱(30, 80),
});

出でよ円 = (点) => 円(点.東, 点.南, 点.径);
出でよ四方 = (点) => 四方(点.東, 点.南, 伍 * 点.径);

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
  for (_ = 零; _ < 四; ++_) {
    出でよ線(点, (次点 = 示せ在処()));
    出でよ円((点 = 次点));
  }
};

出でよ方円 = () => {
  出でよ空();
  出でよ道();
  出でよ四方(示せ在処());
  出でよ四方(示せ在処());
};

// ----------------------------------------------------------------

const scaleFactor = 0.75;

const 出でよ空 = () => {
  createCanvas(scaleFactor * 東西, scaleFactor * 南北);
  scale(scaleFactor);
  strokeWeight(4);
  noFill();
  ellipseMode(RADIUS);

  background(248);
  stroke(32);
  square(1, 1, 東西 - 2, 南北 - 2);
  noFill();

  drawingContext.shadowOffsetX = scaleFactor * 20;
  drawingContext.shadowOffsetY = scaleFactor * 20;
  drawingContext.shadowBlur = scaleFactor * 16;
  drawingContext.shadowColor = `rgba(0, 0, 0, 0.5)`;
};

const 零 = 0;
const 四 = 4;
const 伍 = 5;
const 乱 = (min, max) => random(min, max);
const 円 = (x, y, d) => circle(x, y, d);
const 四方 = (x, y, d) => square(x, y, d);
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
