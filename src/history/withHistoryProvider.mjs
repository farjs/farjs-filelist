/**
 * @typedef {import("./HistoryProvider.mjs").HistoryProvider} HistoryProvider
 */
import React from "react";
import HistoryProvider from "./HistoryProvider.mjs";

const h = React.createElement;

/**
 * Common test util.
 *
 * @param {React.ReactElement<any>} element
 * @param {HistoryProvider} historyProvider
 * @returns {React.ReactElement<any>}
 */
const withHistoryProvider = (element, historyProvider) => {
  return h(
    HistoryProvider.Context.Provider,
    {
      value: historyProvider,
    },
    element
  );
};

export default withHistoryProvider;
