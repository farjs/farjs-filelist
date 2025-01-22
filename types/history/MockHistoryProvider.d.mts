export default MockHistoryProvider;
export type HistoryProvider = import("./HistoryProvider.mjs").HistoryProvider;
export type HistoryProviderMocks = {
    get?: HistoryProvider['get'];
};
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
declare class MockHistoryProvider implements HistoryProvider {
    /**
     * @param {HistoryProviderMocks} mocks
     */
    constructor({ get }?: HistoryProviderMocks);
    get(kind: import("./HistoryProvider.mjs").HistoryKind): Promise<import("./HistoryProvider.mjs").HistoryService>;
}
