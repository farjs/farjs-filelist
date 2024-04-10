import assert from "node:assert/strict";
import FileListActions from "../src/FileListActions.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListActions.test.mjs", () => {
  it("should throw error when constructing FileListActions directly", () => {
    //when
    let error = null;
    try {
      new FileListActions();
    } catch (e) {
      error = e;
    }

    //then
    assert.deepEqual(
      error,
      TypeError("Cannot construct FileListActions instances directly")
    );
  });

  it("should construct valid subclass of FileListActions without errors", () => {
    //when
    let error = null;
    try {
      new TestFileListActions();
    } catch (e) {
      error = e;
    }

    //then
    assert.deepEqual(error, null);
  });
});

class TestFileListActions extends FileListActions {
  constructor() {
    super();
  }
}
