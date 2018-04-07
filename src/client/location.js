// @flow

export type LocationCallback = (path: string) => void;

const callbacks = [];

export function subscribeToLocation(callback: LocationCallback) {
  callbacks.push(callback);
}

export function pushPath(path: string) {
  window.history.pushState({}, '', path);

  callbacks.forEach(callback => callback(path));
}

export function getPath() {
  return window.location.pathname;
}
