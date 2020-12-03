import { useCallback, useState } from "react";
import {
  Buffer,
  CalculationItem,
  CalculationSequence,
  CalculatorHook,
  Error,
  Handle,
  Key,
  KeyType,
} from "./types";

export const makeCalculator: CalculatorHook = (...handlers) => () => {
  const [store, setStore] = useState<CalculationSequence>([]);
  const [buffer, setBuffer] = useState<Buffer>(null);
  const [error, setError] = useState<Error>(null);

  const handle = useCallback<Handle>(
    (key: Key | number) => {
      const updatedStore = handlers.reduce<CalculationSequence>(
        (currentStore, handler) => {
          const result = handler(key.toString(), currentStore, buffer);

          if (buffer !== result.buffer?.toString()) {
            setBuffer(result.buffer?.toString());
          }

          if (error !== result.error) {
            setError(result.error || null);
          }

          return result.sequence;
        },
        store
      );

      setStore(updatedStore);
    },
    [store, buffer]
  );

  return {
    handle,
    store,
    buffer,
    error,
  };
};

export const createItem = (
  key: Key | number,
  type: KeyType
): CalculationItem => ({
  key: key.toString(),
  type,
});
