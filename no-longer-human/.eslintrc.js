module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  "plugins": [
    "@typescript-eslint"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "settings": {
    "node": {
      "tryExtensions": [".ts", ".js", ".json", ".node"]
    }
  },
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
  },
  "env": {
    "browser": true
  }
}
