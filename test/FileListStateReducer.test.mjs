/**
 * @typedef {import("../src/FileListAction.mjs").FileListAction} FileListAction
 */
import assert from "node:assert/strict";
import FileListDir from "../src/api/FileListDir.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import SortMode from "../src/sort/SortMode.mjs";
import FileListState from "../src/FileListState.mjs";
import FileListStateReducer from "../src/FileListStateReducer.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListStateReducer.test.mjs", () => {
  it("should return current state if action is not supported", () => {
    //given
    const state = FileListState();

    //when & then
    assert.deepEqual(
      FileListStateReducer(state, "test_action") === state,
      true
    );
    assert.deepEqual(
      FileListStateReducer(state, { action: "unknown" }) === state,
      true
    );
  });

  it("should set params when FileListParamsChangedAction", () => {
    //given
    const state = FileListState();
    /** @type {FileListAction} */
    const action = {
      action: "FileListParamsChangedAction",
      offset: 1,
      index: 2,
      selectedNames: new Set(["test"]),
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: action.offset,
      index: action.index,
      selectedNames: action.selectedNames,
    });
  });

  it("should set sorted items when FileListDirChangedAction(root)", () => {
    //given
    const state = { ...FileListState(), selectedNames: new Set(["file 1"]) };
    const currDir = FileListDir("/", true, [
      FileListItem("file 2"),
      FileListItem("file 1"),
      FileListItem("dir 2", true),
      FileListItem("dir 1", true),
    ]);
    /** @type {FileListAction} */
    const action = {
      action: "FileListDirChangedAction",
      dir: FileListItem.currDir.name,
      currDir,
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      currDir: {
        ...currDir,
        items: [
          FileListItem("dir 1", true),
          FileListItem("dir 2", true),
          FileListItem("file 1"),
          FileListItem("file 2"),
        ],
      },
      selectedNames: new Set(),
    });
  });

  it("should add .. to items and set index when FileListDirChangedAction(non-root)", () => {
    //given
    const stateDir = FileListDir("/root/sub-dir/dir 2", false, []);
    const state = {
      ...FileListState(),
      currDir: stateDir,
      selectedNames: new Set(["file 1"]),
    };
    const currDir = FileListDir("/root/sub-dir", false, [
      FileListItem("file 2"),
      FileListItem("file 1"),
      FileListItem("dir 2", true),
      FileListItem("dir 1", true),
    ]);
    /** @type {FileListAction} */
    const action = {
      action: "FileListDirChangedAction",
      dir: FileListItem.up.name,
      currDir,
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      index: 2,
      currDir: {
        ...currDir,
        items: [
          FileListItem.up,
          FileListItem("dir 1", true),
          FileListItem("dir 2", true),
          FileListItem("file 1"),
          FileListItem("file 2"),
        ],
      },
      selectedNames: new Set(),
    });
  });

  it("should update state and keep current item when FileListDirUpdatedAction", () => {
    //given
    const state = {
      ...FileListState(),
      offset: 1,
      currDir: {
        path: "/root/sub-dir/dir 2",
        isRoot: false,
        items: [FileListItem.up, FileListItem("file 1")],
      },
      selectedNames: new Set(["test", "dir 1"]),
    };
    const currDir = FileListDir("/root/sub-dir", false, [
      FileListItem("file 1"),
      FileListItem("dir 1", true),
    ]);
    /** @type {FileListAction} */
    const action = { action: "FileListDirUpdatedAction", currDir };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: 0,
      index: 2,
      currDir: {
        ...currDir,
        items: [
          FileListItem.up,
          FileListItem("dir 1", true),
          FileListItem("file 1"),
        ],
      },
      selectedNames: new Set(["dir 1"]),
    });
  });

  it("should update state and keep current index when FileListDirUpdatedAction", () => {
    //given
    const state = {
      ...FileListState(),
      offset: 1,
      currDir: FileListDir("/root/sub-dir/dir 2", false, [
        FileListItem.up,
        FileListItem("file 1"),
      ]),
      selectedNames: new Set(["test", "file 1"]),
    };
    const currDir = FileListDir("/root/sub-dir", false, [
      FileListItem("dir 1", true),
    ]);
    /** @type {FileListAction} */
    const action = { action: "FileListDirUpdatedAction", currDir };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: 1,
      index: 0,
      currDir: {
        ...currDir,
        items: [FileListItem.up, FileListItem("dir 1", true)],
      },
      selectedNames: new Set(),
    });
  });

  it("should update state and reset index when FileListDirUpdatedAction", () => {
    //given
    const state = {
      ...FileListState(),
      offset: 1,
      index: 1,
      currDir: FileListDir("/root/sub-dir/dir 2", false, [
        FileListItem.up,
        FileListItem("file 1"),
        FileListItem("dir 1", true),
      ]),
      selectedNames: new Set(["file 1"]),
    };
    const currDir = FileListDir("/root/sub-dir", false, []);
    /** @type {FileListAction} */
    const action = { action: "FileListDirUpdatedAction", currDir };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: 0,
      index: 0,
      currDir: {
        ...currDir,
        items: [FileListItem.up],
      },
      selectedNames: new Set(),
    });
  });

  it("should update state and set default index when FileListDirUpdatedAction", () => {
    //given
    const state = {
      ...FileListState(),
      offset: 1,
      index: 1,
      currDir: FileListDir("/root/sub-dir/dir 2", true, []),
    };
    const currDir = FileListDir("/root/sub-dir", false, [
      FileListItem("file 1"),
      FileListItem("Fixes"),
      FileListItem("Food", true),
      FileListItem("dir 1", true),
    ]);
    /** @type {FileListAction} */
    const action = { action: "FileListDirUpdatedAction", currDir };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: 0,
      index: 0,
      currDir: {
        ...currDir,
        items: [
          FileListItem.up,
          FileListItem("dir 1", true),
          FileListItem("Food", true),
          FileListItem("file 1"),
          FileListItem("Fixes"),
        ],
      },
      selectedNames: new Set(),
    });
  });

  it("should update state when FileListItemCreatedAction", () => {
    //given
    const stateDir = FileListDir("/", true, []);
    const state = {
      ...FileListState(),
      offset: 1,
      currDir: stateDir,
      selectedNames: new Set(["test1"]),
    };
    const dir = "dir 2";
    const currDir = {
      ...stateDir,
      items: [
        FileListItem("file 2"),
        FileListItem("File 1"),
        FileListItem(dir, true),
        FileListItem("Dir 1", true),
      ],
    };
    /** @type {FileListAction} */
    const action = { action: "FileListItemCreatedAction", name: dir, currDir };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: 0,
      index: 1,
      currDir: {
        ...currDir,
        items: [
          FileListItem("Dir 1", true),
          FileListItem("dir 2", true),
          FileListItem("File 1"),
          FileListItem("file 2"),
        ],
      },
    });
  });

  it("should keep current sate if item not found when FileListItemCreatedAction", () => {
    //given
    const stateDir = {
      path: "/",
      isRoot: true,
      items: [
        FileListItem("Dir 1", true),
        FileListItem("dir 2", true),
        FileListItem("File 1"),
        FileListItem("file 2"),
      ],
    };
    const state = {
      ...FileListState(),
      offset: 1,
      currDir: stateDir,
      selectedNames: new Set(["test1"]),
    };
    /** @type {FileListAction} */
    const action = {
      action: "FileListItemCreatedAction",
      name: "non-existing",
      currDir: stateDir,
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, state);
  });

  it("should update state when FileListSortAction", () => {
    //given
    const state = {
      ...FileListState(),
      offset: 1,
      currDir: {
        path: "/",
        isRoot: false,
        items: [
          FileListItem.up,
          FileListItem("file 2"),
          FileListItem("File 1"),
          FileListItem("dir 2", true),
          FileListItem("Dir 1", true),
        ],
      },
      selectedNames: new Set(["test1"]),
    };
    /** @type {FileListAction} */
    const action = {
      action: "FileListSortAction",
      mode: SortMode.Name,
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      offset: 0,
      index: 3,
      currDir: {
        ...state.currDir,
        items: [
          FileListItem.up,
          FileListItem("dir 2", true),
          FileListItem("Dir 1", true),
          FileListItem("file 2"),
          FileListItem("File 1"),
        ],
      },
      sort: { ...state.sort, asc: false },
    });
  });

  it("should keep current offset/index if item not found when FileListSortAction", () => {
    //given
    const state = {
      ...FileListState(),
      offset: 1,
      currDir: { path: "/", isRoot: true, items: [] },
    };
    /** @type {FileListAction} */
    const action = {
      action: "FileListSortAction",
      mode: SortMode.Name,
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, {
      ...state,
      sort: { ...state.sort, asc: false },
    });
  });

  it("should update state when FileListDiskSpaceUpdatedAction", () => {
    //given
    const state = FileListState();
    assert.deepEqual(state.diskSpace, undefined);
    /** @type {FileListAction} */
    const action = {
      action: "FileListDiskSpaceUpdatedAction",
      diskSpace: 123.45,
    };

    //when
    const result = FileListStateReducer(state, action);

    //then
    assert.deepEqual(result, { ...state, diskSpace: 123.45 });
  });
});
