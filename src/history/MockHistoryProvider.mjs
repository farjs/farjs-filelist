/**
 * @typedef {import("./HistoryProvider.mjs").HistoryProvider} HistoryProvider
 */

/**
 * @typedef {{
 *  get?: HistoryProvider['get'];
 * }} HistoryProviderMocks
 */

/**
 * @implements {HistoryProvider}
 */
class MockHistoryProvider {
  /**
   * @param {HistoryProviderMocks} mocks
   */
  constructor({ get } = {}) {
    this.get = get ?? this.get;
  }

  /** @type {HistoryProvider['get']} */
  get() {
    throw new Error("Not implemented!");
  }
}

export default MockHistoryProvider;
