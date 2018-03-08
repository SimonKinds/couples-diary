module.exports = {
  parser: "babel-eslint",
  extends: "airbnb",
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  rules: {
    "react/prefer-stateless-function": [true, { ignorePureComponents: true }],
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }]
  }
};
