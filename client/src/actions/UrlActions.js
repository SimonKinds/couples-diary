export const URL_CHANGE = 'URL_CHANGE';

export function onUrlChange(path) {
  return { type: URL_CHANGE, path };
}
