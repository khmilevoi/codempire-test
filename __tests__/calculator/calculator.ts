import { act, HookResult, renderHook } from "@testing-library/react-hooks";
import { useCalculator } from "../../src/calculator-logic/calculator-instance.hook";
import {
  CalculatorHookInterface,
  KeyType,
} from "../../src/calculator-logic/types";

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

    const actions = ["2", "-", "+", "/", "*", "+"];

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

    const actions = ["1", "+", "-", "3", "2", "-", "3", "/", "+", "8", "2"];
    const expected = ["1", "-", "32", "-", "3", "+", "82"];

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
      [["2", "*", "3", "+", "4", "-", "21", "-", "1000"], "-1011"],
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

  it("should add dot", function () {
    const { result } = renderHook(() => useCalculator());

    const expressions = [
      [["3", "."], "3"],
      [["3", ".", "1", "4"], "3.14"],
      [["3", ".", "1", "4", "+", "4", ".", "*", "2"], "11.14"],
    ] as [string[], string][];

    handleExpressions(expressions, result);
  });

  it("should correctly work with percent", function () {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handle("50");
    });
    act(() => {
      result.current.handle("%");
    });

    const [last] = result.current.store;

    expect(last.modifier).toBe("percent");

    const expressions = [
      [["50", "%"], "0.5"],
      [["10", "+", "50", "%"], "15"],
      [["10", "+", "5", "*", "2", "+", "40", "%", "+", "2"], "30"],
      [["10", "+", "5", "*", "2", "*", "40", "%", "+", "2"], "16"],
      [["50", "%", "tsign"], "-0.5"],
      [["10", "+", "50", "%", "tsign"], "5"],
      [["10", "+", "5", "*", "2", "+", "40", "%", "tsign", "+", "2"], "14"],
      [["10", "+", "5", "*", "2", "*", "40", "%", "tsign", "+", "2"], "8"],
    ] as [string[], string][];

    handleExpressions(expressions, result);
  });
});
