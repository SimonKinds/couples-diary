// @flow

let id = 0;

export default function generateId(): string {
  id += 1;
  return id.toString();
}
