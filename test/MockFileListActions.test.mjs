/**
 * @typedef {import("../src/MockFileListActions.mjs").FileListActionsMocks} FileListActionsMocks
 */
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import MockFileListApi from "../src/api/MockFileListApi.mjs";
import MockFileListActions from "../src/MockFileListActions.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("MockFileListActions.test.mjs", () => {
  it("should construct instance with default props", async () => {
    //given
    /** @param {any} callback */
    function checkThrown(callback) {
      let error = null;
      try {
        //when
        callback();
      } catch (e) {
        error = e;
      }

      //then
      assert.deepEqual(error, Error("Not implemented!"));
    }
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
    const result = new MockFileListActions();

    //then
    assert.deepEqual(typeof result.api === "object", true);
    checkThrown(result.changeDir);
    checkThrown(result.updateDir);
    checkThrown(result.createDir);
    checkThrown(result.deleteItems);
    checkThrown(result.scanDirs);
    await checkRejected(result.copyFile);
  });

  it("should construct instance with mocks", () => {
    //given
    /** @type {FileListActionsMocks} */
    const mocks = {
      api: new MockFileListApi(),
      changeDir: mockFunction(),
      updateDir: mockFunction(),
      createDir: mockFunction(),
      deleteItems: mockFunction(),
      scanDirs: mockFunction(),
      copyFile: mockFunction(),
    };

    //when
    const result = new MockFileListActions(mocks);

    //then
    assert.deepEqual(result.api === mocks.api, true);
    assert.deepEqual(result.changeDir === mocks.changeDir, true);
    assert.deepEqual(result.updateDir === mocks.updateDir, true);
    assert.deepEqual(result.createDir === mocks.createDir, true);
    assert.deepEqual(result.deleteItems === mocks.deleteItems, true);
    assert.deepEqual(result.scanDirs === mocks.scanDirs, true);
    assert.deepEqual(result.copyFile === mocks.copyFile, true);
  });
});
