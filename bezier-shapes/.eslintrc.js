module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  "globals": {
    "p5": "readonly",
    "CreativeCodingCore": "readonly",
    "p5ex": "readonly",
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-console": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/class-name-casing": "warn"
  }
};
