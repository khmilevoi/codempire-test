import { Handler, KeyPattern } from "./types";

export const makeKeyHandler = (
  pattern: KeyPattern,
  callback: Handler
): Handler => (item, store, buffer) => {
  if (
    (pattern instanceof RegExp && !pattern.test(item)) ||
    (typeof pattern === "string" && pattern !== item)
  ) {
    return { sequence: [...store], buffer };
  }

  return callback(item, [...store], buffer);
};
