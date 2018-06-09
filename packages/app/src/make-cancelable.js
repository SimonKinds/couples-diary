/**
 * From: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * Author: @istarkov with minor edits by @simonkindstrom
 */

export default function makeCancelable(promise) {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      /* eslint-disable prefer-promise-reject-errors */
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
  };
}
