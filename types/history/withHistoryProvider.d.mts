export default withHistoryProvider;
export type HistoryProvider = import("./HistoryProvider.mjs").HistoryProvider;
/**
 * Common test util.
 *
 * @param {React.ReactElement<any>} element
 * @param {HistoryProvider} historyProvider
 * @returns {React.ReactElement<any>}
 */
declare function withHistoryProvider(element: React.ReactElement<any>, historyProvider: HistoryProvider): React.ReactElement<any>;
import React from "react";
import HistoryProvider from "./HistoryProvider.mjs";
