// @flow
import type { $Response } from 'express';

export default function send(
  result: ApiResponse | Promise<ApiResponse>,
  res: $Response,
) {
  if (result instanceof Promise) {
    result
      .then(plain => sendPlain(plain, res))
      .catch(() => sendPlain({ status: 500 }, res));
  } else {
    sendPlain(result, res);
  }
}

function sendPlain(result: ApiResponse, res: $Response) {
  res.status(result.status);
  if (result.body) {
    res.send(result.body);
  } else {
    res.send();
  }
}
