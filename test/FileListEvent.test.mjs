/**
 * @typedef {import("../src/FileListEvent.mjs").FileListEvent} FileListEvent
 */
import assert from "node:assert/strict";
import FileListEvent from "../src/FileListEvent.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListEvent.test.mjs", () => {
  it("should define FileListEvent enum", () => {
    //when & then
    assert.deepEqual(FileListEvent, {
      onFileListCopy: "onFileListCopy",
      onFileListMove: "onFileListMove",
    });
  });
});
