/**
 * @typedef {import("../../src/api/MockFileTarget.mjs").FileTargetMocks} FileTargetMocks
 */
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import FileListItem from "../../src/api/FileListItem.mjs";
import MockFileTarget from "../../src/api/MockFileTarget.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MockFileTarget.test.mjs", () => {
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
    const result = new MockFileTarget();

    //then
    assert.deepEqual(result.file, "file.mock");
    await checkRejected(result.writeNextBytes(new Uint8Array(), 0));
    await checkRejected(result.setAttributes(FileListItem("test.item")));
    await checkRejected(result.close());
    await checkRejected(result.delete());
  });

  it("should construct instance with mocks", () => {
    //given
    /** @type {FileTargetMocks} */
    const mocks = {
      file: "mock.file",
      writeNextBytes: mockFunction(),
      setAttributes: mockFunction(),
      close: mockFunction(),
      delete: mockFunction(),
    };

    //when
    const result = new MockFileTarget(mocks);

    //then
    assert.deepEqual(result.file === mocks.file, true);
    assert.deepEqual(result.writeNextBytes === mocks.writeNextBytes, true);
    assert.deepEqual(result.setAttributes === mocks.setAttributes, true);
    assert.deepEqual(result.close === mocks.close, true);
    assert.deepEqual(result.delete === mocks.delete, true);
  });
});
