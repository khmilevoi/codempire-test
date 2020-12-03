import { act, HookResult, renderHook } from "@testing-library/react-hooks";

import {
  createItem,
  interpreter,
  makeCalculator,
  makeKeyHandler,
} from "../../src/calculator";
import { CalculatorHookInterface, KeyType } from "../../src/calculator/types";

const handleExpressions = (
  expressions: [string[], string][],
  result: HookResult<CalculatorHookInterface>
) => {
  expressions.forEach(([expression, answer]) => {
    act(() => {
      result.current.handle("ac");
    });

    expression.forEach((item: string) => {
      act(() => {
        result.current.handle(item);
      });
    });

    act(() => {
      result.current.handle("=");
    });

    const [res] = result.current.store;

    expect(res.key).toBe(answer);
    expect(result.current.buffer).toBe(answer);
  });
};

const useCalculator = makeCalculator(
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
  makeKeyHandler(/^\+|-|\/|\*|%$/, (item, store, buffer) => {
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
      const result = interpreter(store.map((item) => item.key));
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

    if (last.type === KeyType.number) {
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
  })
);

describe("calculator", () => {
  it("should receive numbers", () => {
    const { result } = renderHook(() => useCalculator());

    const numbers = [1, 2, 3, 4, 5];

    numbers.forEach((number, index) => {
      act(() => {
        result.current.handle(number);
      });

      const [item] = result.current.store;

      expect(item.type).toBe(KeyType.number);
      expect(item.key).toBe(numbers.slice(0, index + 1).join(""));
    });
  });

  it("should add actions to sequence", function () {
    const { result } = renderHook(() => useCalculator());

    const actions = ["2", "-", "+", "/", "*", "%"];

    actions.forEach((action) => {
      act(() => {
        result.current.handle(action);
      });

      const item = result.current.store[1];

      if (item) {
        expect(item.type).toBe(KeyType.action);
        expect(item.key).toBe(action);
      }
    });

    expect(result.current.store).toHaveLength(2);
  });

  it("should add item to sequence", function () {
    const { result } = renderHook(() => useCalculator());

    const actions = ["1", "+", "-", "3", "2", "-", "3", "/", "%", "8", "2"];
    const expected = ["1", "-", "32", "-", "3", "%", "82"];

    actions.forEach((action) => {
      act(() => {
        result.current.handle(action);
      });
    });

    expected.forEach((action, index) => {
      const item = result.current.store[index];

      expect(item.key).toBe(action);
    });
  });

  it("should calculate expressions", function () {
    const { result } = renderHook(() => useCalculator());

    const expressions = [
      [["1", "+", "2", "*", "3", "-", "3", "/", "2"], "5.5"],
      [["32", "+", "98", "*", "42", "-", "23", "/", "5"], "4143.4"],
      [["2", "*", "3", "*", "4", "*", "21", "-", "1000"], "-496"],
      [["2", "*", "3", "*", "4", "-", "21", "-", "1000"], "-997"],
      [["2", "*", "3", "%", "4", "-", "21", "-", "1000"], "-1019"],
    ] as [string[], string][];

    handleExpressions(expressions, result);
  });

  it("should work correctly with the buffer", function () {
    const { result } = renderHook(() => useCalculator());

    const expressions = [
      [["2", "*", "3", "*", "4", "*", "21", "tsign", "-", "1000"], "-1504"],
      [["5", "tsign", "tsign", "+", "10"], "15"],
      [["5", "tsign", "tsign", "tsign", "+", "10"], "5"],
      [["5", "tsign", "tsign", "tsign", "+", "tsign", "10"], "5"],
    ] as [string[], string][];

    handleExpressions(expressions, result);
  });

  it("should toggle sign of number", function () {
    const { result } = renderHook(() => useCalculator());

    const expressions = [
      [["2", "*", "3"], "6"],
      [["5", "+", "10", "mm"], "9"],
      [["5", "+", "10", "mp"], "24"],
      [["5", "mm", "+", "10", "mp"], "15"],
      [["5", "mm", "+", "mm", "10", "mp"], "-1505"],
      [["5", "mm", "+", "mm", "10", "mr"], "-1505"],
      [["5", "+", "mc", "10", "mp"], "15"],
      [["mr"], "15"],
    ] as [string[], string][];

    handleExpressions(expressions, result);
  });

  it("should handle other cases", function () {
    const { result } = renderHook(() => useCalculator());

    const expressions = [
      [["*", "3"], "3"],
      [["*", "+", "=", "3"], "3"],
    ] as [string[], string][];

    handleExpressions(expressions, result);
  });
});
