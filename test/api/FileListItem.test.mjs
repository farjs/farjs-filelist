/**
 * @typedef {import("../../src/api/FileListItem").FileListItem} FileListItem
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
      ...defaultItem(result),
      name: "test.file",
      isDir: false,
    });
  });

  it("should create new dir item when FileListItem(isDir = true)", () => {
    //when
    const result = FileListItem("dir", true);

    //then
    assert.deepEqual(result, {
      ...defaultItem(result),
      name: "dir",
      isDir: true,
    });
  });

  it("should return .. dir item when FileListItem.up", () => {
    //when
    const result = FileListItem.up;

    //then
    assert.deepEqual(result, {
      ...defaultItem(result),
      name: "..",
      isDir: true,
    });
  });

  it("should return . dir item when FileListItem.currDir", () => {
    //when
    const result = FileListItem.currDir;

    //then
    assert.deepEqual(result, {
      ...defaultItem(result),
      name: ".",
      isDir: true,
    });
  });

  it("should return normalized name when item.nameNormalized()", () => {
    //given
    const item = FileListItem("TEst");

    //when
    const result = item.nameNormalized();

    //then
    assert.deepEqual(result, "test");

    //when & then
    assert.deepEqual(item.nameNormalized() === result, true);
    assert.deepEqual(FileListItem("").nameNormalized(), "");
    assert.deepEqual(FileListItem("test").nameNormalized(), "test");
    assert.deepEqual(FileListItem("A").nameNormalized(), "a");
    assert.deepEqual(FileListItem("aB").nameNormalized(), "ab");
    assert.deepEqual(FileListItem.up.nameNormalized(), "..");
    assert.deepEqual(FileListItem.currDir.nameNormalized(), ".");
  });

  it("should return file extension when item.ext()", () => {
    //given
    const item = FileListItem("Test.txt");

    //when
    const result = item.ext();

    //then
    assert.deepEqual(result, "txt");

    //when & then
    assert.deepEqual(item.ext() === result, true);
    assert.deepEqual(FileListItem("").ext(), "");
    assert.deepEqual(FileListItem(".").ext(), "");
    assert.deepEqual(FileListItem("test.").ext(), "");
    assert.deepEqual(FileListItem("test").ext(), "test");
    assert.deepEqual(FileListItem(".Test2").ext(), "Test2");
    assert.deepEqual(FileListItem("A").ext(), "A");
    assert.deepEqual(FileListItem("aB").ext(), "aB");
  });

  it("should return normalized extension when item.extNormalized()", () => {
    //given
    const item = FileListItem("Test.TXT");

    //when
    const result = item.extNormalized();

    //then
    assert.deepEqual(result, "txt");

    //when & then
    assert.deepEqual(item.extNormalized() === result, true);
    assert.deepEqual(FileListItem("").extNormalized(), "");
    assert.deepEqual(FileListItem(".").extNormalized(), "");
    assert.deepEqual(FileListItem("Test.").extNormalized(), "");
    assert.deepEqual(FileListItem("Test").extNormalized(), "test");
    assert.deepEqual(FileListItem(".Test2").extNormalized(), "test2");
    assert.deepEqual(FileListItem("A").extNormalized(), "a");
    assert.deepEqual(FileListItem("aB").extNormalized(), "ab");
  });

  it("should return name when item.toString()", () => {
    //given
    const item = FileListItem("Test.file");

    //when & then
    assert.deepEqual(item.toString(), "Test.file");
    assert.deepEqual(`${item}`, "Test.file");
  });
});

/**
 * @param {FileListItem} result
 * @returns {FileListItem}
 */
function defaultItem(result) {
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
    nameNormalized: result.nameNormalized,
    ext: result.ext,
    extNormalized: result.extNormalized,
    toString: result.toString,
  };
}
