export default function send(result, res) {
  if (result instanceof Promise) {
    result
      .then(plain => sendPlain(plain, res))
      .catch(() => sendPlain({ status: 500 }, res));
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
