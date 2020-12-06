import { interpreter } from "./expression-interpreter.util";
import { makeKeyHandler } from "./key-handler.hook";
import { createItem, makeCalculator } from "./make-calculator.hook";
import { KeyType } from "./types";

export const useCalculator = makeCalculator(
  makeKeyHandler(/^\d*$/, (item, store, buffer) => {
    const [last] = store.slice(-1);

    if (last?.type === KeyType.number) {
      last.key = last.key + item;
    } else {
      store.push(createItem(item, KeyType.number));
    }

    return {
      sequence: store,
      buffer,
    };
  }),
  makeKeyHandler(/^\+|-|\/|\*$/, (item, store, buffer) => {
    const [last] = store.slice(-1);

    if (last?.type === KeyType.action) {
      last.key = item;
    } else if (store.length > 0) {
      store.push(createItem(item, KeyType.action));
    }

    return {
      sequence: store,
      buffer,
    };
  }),
  makeKeyHandler("=", (item, store, buffer) => {
    if (store.length) {
      const result = interpreter(store);
      store = [createItem(result, KeyType.number)];
      buffer = result.toString();
    }

    return {
      sequence: store,
      buffer: buffer,
    };
  }),
  makeKeyHandler("ac", (item, store, buffer) => ({
    sequence: [],
    buffer,
  })),
  makeKeyHandler("tsign", (item, store, buffer) => {
    const [last] = store.slice(-1);

    if (last?.type === KeyType.number) {
      last.key = (-last.key).toString();
    }

    return {
      sequence: store,
      buffer,
    };
  }),
  makeKeyHandler("mc", (item, store) => {
    return {
      sequence: store,
      buffer: null,
    };
  }),
  makeKeyHandler("mr", (item, store, buffer) => {
    store = [];

    if (buffer) {
      store.push(createItem(buffer, KeyType.number));
    }

    return {
      sequence: store,
      buffer,
    };
  }),
  makeKeyHandler(/^(?:mm|mp)$/, (item, store, buffer) => {
    if (buffer) {
      if (item === "mm") {
        store.push(createItem("-", KeyType.action));
      } else if (item === "mp") {
        store.push(createItem("+", KeyType.action));
      }

      store.push(createItem(buffer, KeyType.number));
    }

    return {
      sequence: store,
      buffer,
    };
  }),
  makeKeyHandler(".", (item, store, buffer) => {
    const [last] = store.slice(-1);

    if (last && last.type === KeyType.number && !last.key.includes(".")) {
      last.key += ".";
    }

    return {
      sequence: store,
      buffer,
    };
  }),
  makeKeyHandler("%", (item, store, buffer) => {
    const [last] = store.slice(-1);

    if (last?.type === KeyType.number) {
      last.modifier = "percent";
    }

    return {
      sequence: store,
      buffer,
    };
  })
);
