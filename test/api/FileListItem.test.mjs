/**
 * @typedef {import("../../src/api/FileListItem.mjs").FileListItem} FileListItem
 */
import assert from "node:assert/strict";
import FileListItem from "../../src/api/FileListItem.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListItem.test.mjs", () => {
  it("should create new file item when FileListItem()", () => {
    //when
    const result = FileListItem("test.file");

    //then
    assert.deepEqual(result, {
      ...defaultItem(),
      name: "test.file",
      isDir: false,
    });
  });

  it("should create new dir item when FileListItem(isDir = true)", () => {
    //when
    const result = FileListItem("dir", true);

    //then
    assert.deepEqual(result, {
      ...defaultItem(),
      name: "dir",
      isDir: true,
    });
  });

  it("should return .. dir item when FileListItem.up", () => {
    //when
    const result = FileListItem.up;

    //then
    assert.deepEqual(result, {
      ...defaultItem(),
      name: "..",
      isDir: true,
    });
  });

  it("should return . dir item when FileListItem.currDir", () => {
    //when
    const result = FileListItem.currDir;

    //then
    assert.deepEqual(result, {
      ...defaultItem(),
      name: ".",
      isDir: true,
    });
  });
});

/**
 * @returns {FileListItem}
 */
function defaultItem() {
  return {
    name: "",
    isDir: false,
    isSymLink: false,
    size: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    permissions: "",
  };
}
