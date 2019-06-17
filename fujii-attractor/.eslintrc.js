module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "rules": {
    "prettier/prettier": "error",
    "no-undef": "off",
    "no-unused-vars": "off"
  },
  "settings": {
    "node": {
      "tryExtensions": [".js", ".json", ".node"]
    }
  }
};
