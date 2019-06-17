/**
 * Formulae from: https://how-to-build-du-e.tumblr.com/
 * @copyright 2019 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

"use strict";

// math functions

const createMonomial = (factor, angleFactor, func) => variable =>
  factor * func(angleFactor * variable);

const createMonomials = (factors, angleFactors, funcs) => {
  const len = Math.min(factors.length, angleFactors.length, funcs.length);
  return [...Array(len)].map((_, i) =>
    createMonomial(factors[i], angleFactors[i], funcs[i])
  );
};

const createPolynomial = monomials => {
  const reducer = (acc, variable, index) => acc + monomials[index](variable);
  return variables => variables.reduce(reducer, 0);
};

// parameters

const a = [-2.1, 1.4, 1.1];
const b = [0.4, 1.1, 1.0];
const f = [Math.sin, Math.cos, Math.sin];

const c = [1.1, 1.2, 0.9];
const d = [1.1, 1.0, 0.7];
const g = [Math.cos, Math.sin, Math.cos];

const dt = 0.15;

// recurrence relation

const polynomials = [
  createPolynomial(createMonomials(a, b, f)),
  createPolynomial(createMonomials(c, d, g)),
  variables => variables[2] + dt
];

const next = variables => polynomials.map(func => func(variables));
const plot = variables => point(variables[0] * 100, variables[1] * 100);

// setup & draw

let variables = [0, 0, 0];

function setup() {
  createCanvas(800, 600);
  background(252);
  noSmooth();
  stroke(0, 0, 64, 32);
}

function draw() {
  translate(400, 250);

  for (let i = 0; i < 1000; i += 1) {
    variables = next(variables);
    plot(variables);
  }
}
