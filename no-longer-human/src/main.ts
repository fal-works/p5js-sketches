import * as p5ex from "p5ex";

const SKETCH_NAME = "NoLongerHuman";

class CharacterSprite extends p5ex.PhysicsBody implements p5ex.CleanableSprite {
  public isToBeRemoved = false;
  private birthTimer = new p5ex.NonLoopedFrameCounter(30, () => {
    this.deathTimer.on();
  });
  private deathTimer = new p5ex.NonLoopedFrameCounter(60, () => {
    this.isToBeRemoved = true;
  }).off();
  private alphaValue = 0;

  public constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly character: string,
    protected readonly shapeColor: p5ex.ShapeColor
  ) {
    super();
  }

  public setPosition(position: p5.Vector): CharacterSprite {
    this.position.set(position);
    return this;
  }

  public step(): void {
    super.step();

    this.birthTimer.step();
    this.deathTimer.step();

    this.alphaValue = Math.ceil(
      255 *
        (this.birthTimer.isOn
          ? this.birthTimer.getProgressRatio()
          : 1 - this.deathTimer.getProgressRatio())
    );
  }

  public draw(): void {
    this.shapeColor.applyColor(this.alphaValue);
    this.p.push();
    this.p.translate(this.position.x, this.position.y);
    this.p.text(this.character, 0, 0);
    this.p.pop();
  }

  public clean(): void {}
}

interface Page {
  lineList: string[];
}

const sketch = (p: p5ex.p5exClass): void => {
  // ---- constants
  const ASSET_PATH =
    "https://fal-works.github.io/p5js-sketches/no-longer-human/assets/";
  const FONT_SIZE = 32;
  const LINE_INTERVAL = FONT_SIZE * 1.5;

  // ---- variables
  const characters = new p5ex.CleanableSpriteArray();
  const shapeColor = new p5ex.ShapeColor(p, undefined, p.color(32), true);
  let backgroundColor: p5.Color;
  let currentFont: p5.Font;
  let pageList: Page[] = [];
  let currentPageIndex = 0;
  let currentLineList: string[] = [];
  let currentLineIndex = 0;
  let currentCharacterIndex = 0;
  let characterPosition = p.createVector();
  let defaultCharacterPositionY: number;
  let sentenceReaderTimer: p5ex.NonLoopedFrameCounter;
  let characterGeneraterTimer: p5ex.LoopedFrameCounter;

  // ---- functions
  function splitWithoutRemove(s: string, deliminator: string): string[] {
    let index = 0;
    const len = s.length;
    const result: string[] = [];

    while (index < len) {
      const nextIndex = s.indexOf(deliminator, index) + 1;

      if (nextIndex <= 0) {
        result.push(s.substring(index));
        return result;
      } else {
        result.push(s.substring(index, nextIndex));
      }
      index = nextIndex;
    }

    return result;
  }

  /**
   * Formats a given sentence and returns a list of lines.
   * @param sentence
   * @param minLineLength
   * @param maxLineLength
   */
  function formatSentence(
    sentence: string,
    minLineLength: number = 13,
    maxLineLength: number = 17
  ): string[] {
    const phrases = splitWithoutRemove(sentence, "\u3001");
    const emptyString = "";
    let lineList: string[] = [];
    let line = emptyString;
    let phraseIndex = 0;
    const len = phrases.length;
    let phrase = phrases[phraseIndex];

    while (phraseIndex < len) {
      if (line.length < minLineLength && phrase.length > maxLineLength) {
        const substringLength = maxLineLength - line.length;
        line = line.concat(phrase.substring(0, substringLength));
        phrase = phrase.substring(substringLength);

        if (phrase.startsWith("\u3001") || phrase.startsWith("\u3002")) {
          line = line.concat(phrase.substring(0, 1));
          phrase = phrase.substring(1);
        }

        lineList.push(line);
        line = emptyString;

        continue;
      }

      if (line.length + phrase.length <= maxLineLength) {
        line = line.concat(phrase);
        phraseIndex += 1;

        if (phraseIndex >= len) break;

        phrase = phrases[phraseIndex];

        continue;
      }

      lineList.push(line);
      line = emptyString;
    }

    if (line !== emptyString) lineList.push(line);

    return lineList;
  }

  function nextPage(
    pageList: Page[],
    index: number
  ): { page: Page; index: number } {
    const currentIndex = index >= pageList.length || index < 0 ? 0 : index;
    const incrementedIndex = currentIndex + 1;

    return {
      page: pageList[currentIndex],
      index: incrementedIndex >= pageList.length ? 0 : incrementedIndex
    };
  }

  function updatePageIndex(value: number): void {
    currentPageIndex = value;
  }

  /*
    function isKanji(character: string): boolean {
      const code = character.charCodeAt(0);
  
      return (
        (code >= 0x4e00 && code <= 0x9fcf) ||
        (code >= 0x3400 && code <= 0x4dbf) ||
        (code >= 0x20000 && code <= 0x2a6df) ||
        (code >= 0xf900 && code <= 0xfadf) ||
        (code >= 0x2f800 && code <= 0x2fa1f)
      );
    }
  */

  function setLineList(lineList: string[]): void {
    currentLineList = lineList;
    currentLineIndex = 0;
    currentCharacterIndex = 0;

    characterPosition.set(
      p.nonScaledWidth / 2 + 0.5 * (lineList.length - 1) * LINE_INTERVAL,
      defaultCharacterPositionY
    );

    window.console.log(lineList);

    characterGeneraterTimer.resetCount();
    characterGeneraterTimer.on();
  }

  function devideArray<T>(array: T[], maxCountPerSegment: number): T[][] {
    const segmentCount = Math.ceil(array.length / maxCountPerSegment);

    const countPerSegment = Math.ceil(array.length / segmentCount);
    const result: T[][] = [];

    while (array.length > 0) {
      result.push(array.splice(0, countPerSegment));
    }

    return result;
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
    currentFont = p.loadFont(`${ASSET_PATH}OradanoGSRR-subset.ttf`);

    p.loadStrings(`${ASSET_PATH}sentences.txt`, (paragraphList: string[]) => {
      pageList = paragraphList
        .map(paragraph => splitWithoutRemove(paragraph, "\u3002"))
        .reduce((pre, current) => {
          pre.push(...current);
          return pre;
        }, [])
        .map(sentence => sentence.trim())
        .map(sentence => devideArray(formatSentence(sentence), 12))
        .reduce((pre, current) => {
          pre.push(...current);
          return pre;
        }, [])
        .map(
          (lines): Page => {
            return { lineList: lines };
          }
        );
    });
  };

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.SQUARE640x640);

    backgroundColor = p.color(244, 244, 250);
    p.textFont(currentFont, FONT_SIZE);
    p.textAlign(p.CENTER);

    defaultCharacterPositionY = p.nonScaledHeight * 0.1;

    sentenceReaderTimer = new p5ex.NonLoopedFrameCounter(60, () => {
      const next = nextPage(pageList, currentPageIndex);
      setLineList(next.page.lineList);
      updatePageIndex(next.index);
    });

    characterGeneraterTimer = new p5ex.LoopedFrameCounter(2, () => {
      characters.push(
        new CharacterSprite(
          p,
          currentLineList[currentLineIndex].charAt(currentCharacterIndex),
          shapeColor
        ).setPosition(characterPosition)
      );
      currentCharacterIndex += 1;
      characterPosition.add(0, FONT_SIZE);

      if (currentCharacterIndex >= currentLineList[currentLineIndex].length) {
        currentCharacterIndex = 0;
        currentLineIndex += 1;
        characterPosition.set(
          characterPosition.x - LINE_INTERVAL,
          defaultCharacterPositionY
        );
      }

      if (currentLineIndex >= currentLineList.length) {
        characterGeneraterTimer.off();
        sentenceReaderTimer.resetCount();
        sentenceReaderTimer.on();
      }
    }).off();
  };

  p.draw = () => {
    p.background(backgroundColor);

    sentenceReaderTimer.step();
    characterGeneraterTimer.step();

    characters.step();
    characters.clean();

    p.scalableCanvas.scale();
    characters.draw();
    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {};

  p.mousePressed = () => {
    // if (!p5ex.mouseIsInCanvas(p)) return;
    // p.noLoop();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
