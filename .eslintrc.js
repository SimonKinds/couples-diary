module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb", "plugin:flowtype/recommended"],
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  plugins: ["flowtype"],
  rules: {
    "react/prefer-stateless-function": [true, { ignorePureComponents: true }],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }]
  }
};
