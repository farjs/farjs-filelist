/**
 * @typedef {import("../../src/history/MockHistoryProvider.mjs").HistoryProviderMocks} HistoryProviderMocks
 */
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import MockHistoryProvider from "../../src/history/MockHistoryProvider.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MockHistoryProvider.test.mjs", () => {
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
    const result = new MockHistoryProvider();

    //then
    await checkRejected(result.get);
  });

  it("should construct instance with mocks", () => {
    //given
    /** @type {HistoryProviderMocks} */
    const mocks = {
      get: mockFunction(),
    };

    //when
    const result = new MockHistoryProvider(mocks);

    //then
    assert.deepEqual(result.get === mocks.get, true);
  });
});
