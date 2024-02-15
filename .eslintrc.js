/* eslint-disable import/no-commonjs */

module.exports = {
  extends: ["@nazarkulyk/esnext", "prettier"],
  root: true,
  parserOptions: {
    requireConfigFile: false,
  },
  env: {
    mocha: true,
  },
  globals: {
    assert: "readonly",
    beforeEach: "readonly",
    context: "readonly",
    cy: "readonly",
    Cypress: "readonly",
    describe: "readonly",
    expect: "readonly",
    it: "readonly",
  },
  rules: {
    "import/no-commonjs": "off",
    "import/no-nodejs-modules": "off",
  },
  overrides: [
    {
      files: ["*.test.js", "*.spec.js", "cypress/**/*.js"],
      rules: {
        "no-unused-expressions": "off",
      },
    },
  ],
};
