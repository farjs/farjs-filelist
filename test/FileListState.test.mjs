/**
 * @typedef {import("../src/api/FileListDir").FileListDir} FileListDir
 */
import assert from "node:assert/strict";
import SortMode from "../src/sort/SortMode.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import FileListState from "../src/FileListState.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const { currentItem, selectedItems, isFileListState } = FileListState;

describe("FileListState.test.mjs", () => {
  it("should create new state when FileListState()", () => {
    //when
    const result = FileListState();

    //then
    assert.deepEqual(result, {
      offset: 0,
      index: 0,
      currDir: { path: "", isRoot: false, items: [] },
      selectedNames: new Set(),
      isActive: false,
      sort: { mode: SortMode.Name, asc: true },
    });
  });

  it("should return current item depending on state when currentItem", () => {
    //given
    const item1 = FileListItem("dir 1");
    const item2 = FileListItem("file 1");
    /** @type {FileListDir} */
    const currDir = { path: "/folder", isRoot: false, items: [item1, item2] };
    const s = FileListState();

    //when & then
    assert.deepEqual(currentItem(s), undefined);
    assert.deepEqual(currentItem({ ...s, index: 1 }), undefined);
    assert.deepEqual(currentItem({ ...s, offset: 1 }), undefined);
    assert.deepEqual(currentItem({ ...s, currDir }), item1);
    assert.deepEqual(currentItem({ ...s, index: 1, currDir }), item2);
    assert.deepEqual(currentItem({ ...s, offset: 1, currDir }), item2);
    assert.deepEqual(
      currentItem({ ...s, offset: 1, index: 1, currDir }),
      undefined
    );
  });

  it("should return selected items depending on state when selectedItems", () => {
    //given
    const item1 = FileListItem("dir 1");
    const item2 = FileListItem("file 1");
    /** @type {FileListDir} */
    const currDir = { path: "/folder", isRoot: false, items: [item1, item2] };
    const s = FileListState();

    //when & then
    assert.deepEqual(selectedItems(s), []);
    assert.deepEqual(selectedItems({ ...s, currDir }), []);
    assert.deepEqual(
      selectedItems({ ...s, currDir, selectedNames: new Set(["file 123"]) }),
      []
    );
    assert.deepEqual(
      selectedItems({ ...s, currDir, selectedNames: new Set(["dir 1"]) }),
      [item1]
    );
    assert.deepEqual(
      selectedItems({ ...s, currDir, selectedNames: new Set(["file 1"]) }),
      [item2]
    );
    assert.deepEqual(
      selectedItems({
        ...s,
        currDir,
        selectedNames: new Set(["file 1", "dir 1"]),
      }),
      [item1, item2]
    );
  });

  it("should check if valid state instance when isFileListState", () => {
    //given
    const item1 = FileListItem("dir 1");
    const item2 = FileListItem("file 1");
    /** @type {FileListDir} */
    const currDir = { path: "/folder", isRoot: false, items: [item1, item2] };
    const s = FileListState();

    //when & then
    assert.deepEqual(isFileListState(s), true);
    assert.deepEqual(isFileListState({ ...s, currDir }), true);
    assert.deepEqual(isFileListState({ ...s, additional: "any" }), true);
    assert.deepEqual(isFileListState(undefined), false);
    assert.deepEqual(isFileListState(null), false);
    assert.deepEqual(isFileListState(""), false);
    assert.deepEqual(isFileListState(123), false);
    assert.deepEqual(isFileListState({}), false);
    assert.deepEqual(isFileListState([]), false);
    assert.deepEqual(isFileListState({ ...s, offset: true }), false);
    assert.deepEqual(isFileListState({ ...s, index: "" }), false);
    assert.deepEqual(isFileListState({ ...s, currDir: "" }), false);
    assert.deepEqual(isFileListState({ ...s, currDir: {} }), false);
    assert.deepEqual(isFileListState({ ...s, currDir: undefined }), false);
    assert.deepEqual(isFileListState({ ...s, currDir: null }), false);
    assert.deepEqual(
      isFileListState({ ...s, currDir: { ...currDir, items: new Set() } }),
      false
    );
    assert.deepEqual(
      isFileListState({ ...s, currDir: { ...currDir, isRoot: "" } }),
      false
    );
    assert.deepEqual(
      isFileListState({ ...s, currDir: { ...currDir, path: true } }),
      false
    );
    assert.deepEqual(isFileListState({ ...s, selectedNames: [] }), false);
    assert.deepEqual(isFileListState({ ...s, selectedNames: "" }), false);
    assert.deepEqual(isFileListState({ ...s, selectedNames: {} }), false);
    assert.deepEqual(
      isFileListState({ ...s, selectedNames: undefined }),
      false
    );
    assert.deepEqual(isFileListState({ ...s, selectedNames: null }), false);
    assert.deepEqual(isFileListState({ ...s, isActive: "" }), false);
    assert.deepEqual(isFileListState({ ...s, sort: "" }), false);
    assert.deepEqual(isFileListState({ ...s, sort: {} }), false);
    assert.deepEqual(isFileListState({ ...s, sort: undefined }), false);
    assert.deepEqual(isFileListState({ ...s, sort: null }), false);
    assert.deepEqual(
      isFileListState({ ...s, sort: { ...s.sort, mode: 123 } }),
      false
    );
    assert.deepEqual(
      isFileListState({ ...s, sort: { ...s.sort, asc: "false" } }),
      false
    );
  });
});
