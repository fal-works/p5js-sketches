module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    // "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "prettier/prettier": "error",
    // "node/no-missing-import": "error",

    "camelcase": "off",
    "@typescript-eslint/camelcase": "error",
    "indent": "off",
    // "@typescript-eslint/indent": "error",
    "no-array-constructor": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",

    "no-dupe-class-members": "off",
    "@typescript-eslint/no-parameter-properties": "off",

    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  "settings": {
    "node": {
      "tryExtensions": [".ts", ".js", ".json", ".node"]
    }
  }
};
