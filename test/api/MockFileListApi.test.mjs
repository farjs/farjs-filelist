/**
 * @typedef {import("../../src/api/MockFileListApi.mjs").FileListApiMocks} FileListApiMocks
 */
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import FileListItem from "../../src/api/FileListItem.mjs";
import FileListCapability from "../../src/api/FileListCapability.mjs";
import MockFileListApi from "../../src/api/MockFileListApi.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MockFileListApi.test.mjs", () => {
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
    const result = new MockFileListApi();

    //then
    assert.deepEqual(result.isLocal, true);
    assert.deepEqual(result.capabilities, new Set());
    await checkRejected(result.readDir("test"));
    await checkRejected(result.delete("test", []));
    await checkRejected(result.mkDirs(["test"]));
    await checkRejected(result.readFile("test", FileListItem("file"), 0));
    await checkRejected(result.writeFile("test", "file", mockFunction()));
    await checkRejected(result.getDriveRoot("test"));
  });

  it("should construct instance with mocks", () => {
    //given
    /** @type {FileListApiMocks} */
    const mocks = {
      isLocal: false,
      capabilities: new Set([FileListCapability.read]),
      readDir: mockFunction(),
      delete: mockFunction(),
      mkDirs: mockFunction(),
      readFile: mockFunction(),
      writeFile: mockFunction(),
      getDriveRoot: mockFunction(),
    };

    //when
    const result = new MockFileListApi(mocks);

    //then
    assert.deepEqual(result.isLocal === mocks.isLocal, true);
    assert.deepEqual(result.capabilities === mocks.capabilities, true);
    assert.deepEqual(result.readDir === mocks.readDir, true);
    assert.deepEqual(result.delete === mocks.delete, true);
    assert.deepEqual(result.mkDirs === mocks.mkDirs, true);
    assert.deepEqual(result.readFile === mocks.readFile, true);
    assert.deepEqual(result.writeFile === mocks.writeFile, true);
    assert.deepEqual(result.getDriveRoot === mocks.getDriveRoot, true);
  });
});
