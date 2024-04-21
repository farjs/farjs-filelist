import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import FileListItem from "../../src/api/FileListItem.mjs";
import FileListApi from "../../src/api/FileListApi.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListApi.test.mjs", () => {
  it("should throw error when constructing FileListApi directly", () => {
    //given
    let error = null;

    try {
      //when
      new FileListApi();
    } catch (e) {
      error = e;
    }

    //then
    assert.deepEqual(
      error,
      TypeError(
        "Cannot construct FileListApi instances directly." +
          " Subclasses should at least implement readDir api."
      )
    );
  });

  it("should construct subclass of FileListApi with default props", async () => {
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
    const result = new TestFileListApi();

    //then
    assert.deepEqual(result.isLocal, false);
    assert.deepEqual(result.capabilities, new Set());
    await checkRejected(result.readDir("test"));
    await checkRejected(result.delete("test", []));
    await checkRejected(result.mkDirs(["test"]));
    await checkRejected(result.readFile("test", FileListItem("file"), 0));
    await checkRejected(result.writeFile("test", "file", mockFunction()));
    assert.deepEqual(await result.getDriveRoot("test"), undefined);
  });
});

class TestFileListApi extends FileListApi {
  constructor() {
    super();
  }

  /** @inheritdoc @type {FileListApi['readDir']} */
  readDir(path, dir) {
    return super.readDir(path, dir);
  }
}
