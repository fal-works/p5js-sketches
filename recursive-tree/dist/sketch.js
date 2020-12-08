/**
 * Recursive Tree.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/recursive-tree
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5) {
  "use strict";

  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
  }

  const p5__default = /*#__PURE__*/ _interopDefaultLegacy(p5);

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /** The id of the HTML element to which the canvas should belong. */
  const HTML_ELEMENT_ID = "RecursiveTree";

  /**
   * ---- Common ----------------------------------------------------------------
   */
  let container;
  let p;
  const initialize = (p5Instance) => {
    container = document.getElementById(HTML_ELEMENT_ID) || document.body;
    p = p5Instance;
  };

  /**
   * ---- Element ---------------------------------------------------------------
   */
  const randomColor = () => {
    return "#" + p.random(["ffcfdf", "fefdca", "e0f9b5", "a5dee5"]);
  };
  const indentWidth = 64;
  const createElement = (parent, level = 0) => {
    const mainDiv = p.createDiv();
    mainDiv.style(`background-color: ${randomColor()}`);
    mainDiv.addClass("line");
    mainDiv.addClass("new-line");
    mainDiv.addClass("item");
    const childrenDiv = p.createDiv();
    childrenDiv.style(`margin-left: ${indentWidth}px`);
    childrenDiv.addClass("item");
    if (parent) {
      parent.mainDiv.child(mainDiv);
      parent.mainDiv.child(childrenDiv);
    }
    const newElement = {
      mainDiv,
      level,
      children: [],
      childrenDiv,
      phase: 0,
    };
    setTimeout(() => {
      mainDiv.removeClass("new-line");
      mainDiv.addClass("alive-line");
      newElement.phase = 1;
      setTimeout(() => {
        newElement.phase = 2;
      }, 1000);
    }, 1);
    return newElement;
  };
  const addChild = (_this) => {
    const born = createElement(_this, _this.level + 1);
    _this.children.push(born);
    _this.childrenDiv.child(born.mainDiv);
    _this.childrenDiv.child(born.childrenDiv);
  };
  const remove = (_this) => {
    _this.phase = 3;
    _this.mainDiv.removeClass("alive-line");
    _this.mainDiv.addClass("dead-line");
    setTimeout(() => {
      _this.mainDiv.remove();
      _this.childrenDiv.remove();
    }, 1000);
    for (const child of _this.children) remove(child);
  };
  const popRandomChild = (_this) => {
    const { children } = _this;
    if (children.length === 0) return undefined;
    const deadIndex = Math.floor(Math.random() * children.length);
    const dead = children.splice(deadIndex, 1)[0];
    if (dead.phase === 3) return undefined;
    else return dead;
  };
  const updateElement = (_this) => {
    if (_this.children.length < 2 && Math.random() < 0.03) addChild(_this);
    else if (1 < _this.children.length && Math.random() < 0.005) {
      const dead = popRandomChild(_this);
      if (dead) remove(dead);
    } else if (_this.level < 2)
      for (const child of _this.children) updateElement(child);
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let rootElement;
  const setup = () => {
    p.noCanvas();
    const wrapper = p.createDiv();
    wrapper.style("margin: 10px");
    if (container) container.appendChild(wrapper.elt);
    rootElement = createElement();
    const rootP5Element = rootElement;
    wrapper.child(rootP5Element.mainDiv);
    wrapper.child(rootP5Element.childrenDiv);
  };
  const draw = () => {
    updateElement(rootElement);
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  new p5__default["default"]((p) => {
    initialize(p);
    p.setup = setup;
    p.draw = draw;
  }, container);
})(p5);
//# sourceMappingURL=sketch.js.map
