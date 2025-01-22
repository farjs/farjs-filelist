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
class MockHistoryService {
  /**
   * @param {HistoryServiceMocks} mocks
   */
  constructor({ getAll, getOne, save } = {}) {
    this.getAll = getAll ?? this.getAll;
    this.getOne = getOne ?? this.getOne;
    this.save = save ?? this.save;
  }

  /** @type {HistoryService['getAll']} */
  getAll() {
    throw new Error("Not implemented!");
  }

  /** @type {HistoryService['getOne']} */
  getOne() {
    throw new Error("Not implemented!");
  }

  /** @type {HistoryService['save']} */
  save() {
    throw new Error("Not implemented!");
  }
}

export default MockHistoryService;
