export default MockHistoryService;
export type HistoryService = import("./HistoryProvider.mjs").HistoryService;
export type HistoryServiceMocks = {
    getAll?: HistoryService['getAll'];
    getOne?: HistoryService['getOne'];
    save?: HistoryService['save'];
};
/**
 * @typedef {import("./HistoryProvider.mjs").HistoryService} HistoryService
 */
/**
 * @typedef {{
 *  getAll?: HistoryService['getAll'];
 *  getOne?: HistoryService['getOne'];
 *  save?: HistoryService['save'];
 * }} HistoryServiceMocks
 */
/**
 * @implements {HistoryService}
 */
declare class MockHistoryService implements HistoryService {
    /**
     * @param {HistoryServiceMocks} mocks
     */
    constructor({ getAll, getOne, save }?: HistoryServiceMocks);
    getAll(): Promise<import("./HistoryProvider.mjs").History[]>;
    getOne(item: string): Promise<import("./HistoryProvider.mjs").History | undefined>;
    save(h: import("./HistoryProvider.mjs").History): Promise<void>;
}
