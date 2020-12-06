import { Key } from "./types";

export const interpreter = (sequence: Key[]) => {
  let iterator = 0;

  const peek = () => sequence[iterator];
  const get = () => sequence[iterator++];
  const accept = (...tokens: string[]) => tokens.includes(peek());
  const calc = (token: string, f: () => any) => accept(token) && get() && f();

  const isNumber = (num: any) => !Number.isNaN(Number(num));
  const number = () => Number.parseFloat(get());

  const factor = (): number => {
    if (isNumber(peek())) {
      return number();
    }

    return 0;
  };

  const term = () => {
    let result = factor();

    while (accept("*", "/", "%")) {
      calc("*", () => (result *= factor()));
      calc("/", () => (result /= factor()));
      calc("%", () => (result %= factor()));
    }

    return result;
  };

  const expression = () => {
    let result = term();

    while (accept("+", "-")) {
      calc("+", () => (result += term()));
      calc("-", () => (result -= term()));
    }

    return result;
  };

  return expression();
};
