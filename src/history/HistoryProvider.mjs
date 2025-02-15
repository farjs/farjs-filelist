import React, { useContext } from "react";

/**
 * @typedef {{
 *   readonly name: string;
 *   readonly maxItemsCount: number;
 * }} HistoryKind
 */

/**
 * @typedef {{
 *   readonly item: string;
 *   readonly params?: object;
 * }} History
 */

/**
 * @typedef {{
 *   getAll(): Promise<readonly History[]>;
 *   getOne(item: string): Promise<History | undefined>;
 *   save(h: History): Promise<void>;
 * }} HistoryService
 */

/**
 * @typedef {{
 *   get(kind: HistoryKind): Promise<HistoryService>;
 * }} HistoryProvider
 */

const HistoryProvider = {};

HistoryProvider.Context = React.createContext(
  /** @type {HistoryProvider | null} */ (null)
);

HistoryProvider.useHistoryProvider = () => {
  const ctx = useContext(HistoryProvider.Context);
  if (!ctx) {
    throw Error(
      "HistoryProvider.Context is not found." +
        "\nPlease, make sure you use HistoryProvider.Context.Provider in parent component."
    );
  }
  return ctx;
};

export default HistoryProvider;
