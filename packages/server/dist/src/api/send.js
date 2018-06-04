'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = send;
function send(result, res) {
  if (result instanceof Promise) {
    result.then(function (plain) {
      return sendPlain(plain, res);
    }).catch(function () {
      return sendPlain({ status: 500 }, res);
    });
  } else {
    sendPlain(result, res);
  }
}


function sendPlain(result, res) {
  res.status(result.status);
  if (result.body) {
    res.send(result.body);
  } else {
    res.send();
  }
}