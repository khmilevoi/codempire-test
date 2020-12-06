import { CalculationItem, CalculationSequence } from "./types";

export const interpreter = (sequence: CalculationSequence) => {
  let iterator = 0;

  const peek = () => sequence[iterator];
  const get = () => sequence[iterator++];
  const accept = (...tokens: string[]) => tokens.includes(peek()?.key);
  const calc = (token: string, f: () => any) => accept(token) && get() && f();

  const isPercent = (item: CalculationItem) => item?.modifier === "percent";
  const isNumber = (num: CalculationItem) => !Number.isNaN(Number(num?.key));
  const number = () => Number.parseFloat(get()?.key);

  const factor = (total: number, prev?: string): number => {
    if (isPercent(peek())) {
      if (prev === "/" || prev === "*" || iterator === 0) {
        return number() / 100;
      }

      if (prev === "+" || prev === "-") {
        return total * (number() / 100);
      }
    }

    if (isNumber(peek())) {
      return number();
    }

    return 0;
  };

  const term = (total: number, prev?: string) => {
    let result = factor(total, prev);

    while (accept("*", "/")) {
      calc("*", () => (result *= factor(total + result, "*")));
      calc("/", () => (result /= factor(total + result, "/")));
    }

    return result;
  };

  const expression = (total: number = 0) => {
    let result = term(total);

    while (accept("+", "-")) {
      calc("+", () => (result += term(total + result, "+")));
      calc("-", () => (result -= term(total + result, "-")));
    }

    return result;
  };

  return expression();
};
