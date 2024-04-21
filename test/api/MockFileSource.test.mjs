/**
 * @typedef {import("../../src/api/MockFileSource.mjs").FileSourceMocks} FileSourceMocks
 */
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import MockFileSource from "../../src/api/MockFileSource.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MockFileSource.test.mjs", () => {
  it("should construct instance with default props", async () => {
    //given
    /** @param {Promise<?>} p */
    async function checkRejected(p) {
      let error = null;
      try {
        //when
        await p;
      } catch (e) {
        error = e;
      }

      //then
      assert.deepEqual(error, Error("Not implemented!"));
    }

    //when
    const result = new MockFileSource();

    //then
    assert.deepEqual(result.file, "file.mock");
    await checkRejected(result.readNextBytes(new Uint8Array()));
    await checkRejected(result.close());
  });

  it("should construct instance with mocks", () => {
    //given
    /** @type {FileSourceMocks} */
    const mocks = {
      file: "mock.file",
      readNextBytes: mockFunction(),
      close: mockFunction(),
    };

    //when
    const result = new MockFileSource(mocks);

    //then
    assert.deepEqual(result.file === mocks.file, true);
    assert.deepEqual(result.readNextBytes === mocks.readNextBytes, true);
    assert.deepEqual(result.close === mocks.close, true);
  });
});
