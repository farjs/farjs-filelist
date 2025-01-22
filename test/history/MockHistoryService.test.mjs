/**
 * @typedef {import("../../src/history/MockHistoryService.mjs").HistoryServiceMocks} HistoryServiceMocks
 */
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import MockHistoryService from "../../src/history/MockHistoryService.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MockHistoryService.test.mjs", () => {
  it("should construct instance with default props", async () => {
    //given
    /** @param {any} callback */
    async function checkRejected(callback) {
      let error = null;
      try {
        //when
        await callback();
      } catch (e) {
        error = e;
      }

      //then
      assert.deepEqual(error, Error("Not implemented!"));
    }

    //when
    const result = new MockHistoryService();

    //then
    await checkRejected(result.getAll);
    await checkRejected(result.getOne);
    await checkRejected(result.save);
  });

  it("should construct instance with mocks", () => {
    //given
    /** @type {HistoryServiceMocks} */
    const mocks = {
      getAll: mockFunction(),
      getOne: mockFunction(),
      save: mockFunction(),
    };

    //when
    const result = new MockHistoryService(mocks);

    //then
    assert.deepEqual(result.getAll === mocks.getAll, true);
    assert.deepEqual(result.getOne === mocks.getOne, true);
    assert.deepEqual(result.save === mocks.save, true);
  });
});
