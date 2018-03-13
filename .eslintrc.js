module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "plugin:flowtype/recommended", "plugin:jest/recommended"],
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  plugins: ["flowtype", "jest"],
  rules: {
    "react/prefer-stateless-function": [true, { ignorePureComponents: true }],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }]
  }
};
