// store

export type KeyPattern = RegExp | string;
export type Key = string;

export enum KeyType {
  number = "number",
  action = "action",
}

export type CalculationItem = {
  type: KeyType;
  key: Key;
  modifier?: string;
};

export type CalculationSequence = CalculationItem[];

// handler

export type Handler = (
  item: Key,
  store: CalculationSequence,
  buffer: Buffer
) => { sequence: CalculationSequence; buffer: Buffer; error?: Error };

// calculator

export type Buffer = string | null | undefined;
export type Error = string | null | undefined;
export type Handle = (key: Key | number) => void;

export type CalculatorHookInterface = {
  handle: Handle;
  store: CalculationSequence;
  buffer: Buffer;
  error: Error;
};
export type CalculatorHook = (
  ...handlers: Handler[]
) => () => CalculatorHookInterface;
