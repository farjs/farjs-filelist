/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("../src/api/FileListDir.mjs").FileListDir} FileListDir
 * @typedef {import("../src/sort/SortMode.mjs").SortMode} SortMode
 * @typedef {import("../src/FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("../src/FileListActions.mjs").FileListAction} FileListAction
 * @typedef {import("../src/FileListState.mjs").FileListState} FileListState
 * @typedef {import("../src/FileListPanel.mjs").FileListPanelProps} FileListPanelProps
 */
import React from "react";
import nodePath from "node:path";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import Task from "@farjs/ui/task/Task.mjs";
import TaskAction from "@farjs/ui/task/TaskAction.mjs";
import withStackContext from "../src/stack/withStackContext.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import SortMode from "../src/sort/SortMode.mjs";
import SortModesPopup from "../src/sort/SortModesPopup.mjs";
import FileListState from "../src/FileListState.mjs";
import FileListActions from "../src/FileListActions.mjs";
import MockFileListActions from "../src/MockFileListActions.mjs";
import FileListQuickSearch from "../src/FileListQuickSearch.mjs";
import FileListPanelView from "../src/FileListPanelView.mjs";
import FileListPanel from "../src/FileListPanel.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

FileListPanel.fileListPanelView = mockComponent(FileListPanelView);
FileListPanel.fileListQuickSearch = mockComponent(FileListQuickSearch);
FileListPanel.sortModesPopup = mockComponent(SortModesPopup);

const { fileListPanelView, fileListQuickSearch, sortModesPopup } =
  FileListPanel;

describe("FileListPanel.test.mjs", () => {
  it("should dispatch FileListSortAction when onKeypress", () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let onKeypressArgs = /** @type {any[]} */ ([]);
    const onKeypress = mockFunction((...args) => {
      onKeypressArgs = args;
      return false;
    });
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [
          FileListItem.up,
          FileListItem("file 1"),
          FileListItem("dir 1", true),
        ],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state, {
      onKeypress,
    });
    const screen = /** @type {BlessedScreen} */ ({});

    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    const viewProps = renderer.root.findByType(fileListPanelView).props;

    /**
     * @param {string} fullKey
     * @param {SortMode} sortMode
     */
    function check(fullKey, sortMode) {
      //given
      const dispatchTimes = dispatch.times;
      const onKeypressTimes = onKeypress.times;
      const action = { action: "FileListSortAction", mode: sortMode };

      //when
      viewProps.onKeypress(screen, fullKey);

      //then
      assert.deepEqual(dispatch.times, dispatchTimes + 1);
      assert.deepEqual(dispatchArgs, [action]);
      assert.deepEqual(onKeypress.times, onKeypressTimes + 1);
      assert.deepEqual(onKeypressArgs, [screen, fullKey]);
    }

    //when & then
    check("C-f3", SortMode.Name);
    check("C-f4", SortMode.Extension);
    check("C-f5", SortMode.ModificationTime);
    check("C-f6", SortMode.Size);
    check("C-f7", SortMode.Unsorted);
    check("C-f8", SortMode.CreationTime);
    check("C-f9", SortMode.AccessTime);
  });

  it("should show SortModesPopup when onKeypress(C-f12)", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("..")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);
    const screen = /** @type {BlessedScreen} */ ({});

    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    const viewProps = renderer.root.findByType(fileListPanelView).props;

    //when
    viewProps.onKeypress(screen, "C-f12");

    //then
    const popupProps = renderer.root.findByType(sortModesPopup).props;
    assert.deepEqual(popupProps, {
      sort: {
        mode: SortMode.Name,
        asc: true,
      },
      onClose: popupProps.onClose,
    });

    //when
    popupProps.onClose();

    //then
    assert.deepEqual(renderer.root.findAllByType(sortModesPopup).length, 0);
  });

  it("should copy parent path into clipboard when onKeypress(C-c)", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("..")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);
    let copyToClipboardArgs = /** @type {any[]} */ ([]);
    const copyToClipboard = mockFunction((...args) => {
      copyToClipboardArgs = args;
      return false;
    });
    const screen = /** @type {any} */ ({ copyToClipboard });

    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    const viewProps = renderer.root.findByType(fileListPanelView).props;

    //when
    viewProps.onKeypress(screen, "C-c");

    //then
    assert.deepEqual(copyToClipboard.times, 1);
    assert.deepEqual(copyToClipboardArgs, ["/sub-dir"]);
  });

  it("should copy item path into clipboard when onKeypress(C-c)", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("item 1")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);
    let copyToClipboardArgs = /** @type {any[]} */ ([]);
    const copyToClipboard = mockFunction((...args) => {
      copyToClipboardArgs = args;
      return false;
    });
    const screen = /** @type {any} */ ({ copyToClipboard });

    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    const viewProps = renderer.root.findByType(fileListPanelView).props;

    //when
    viewProps.onKeypress(screen, "C-c");

    //then
    assert.deepEqual(copyToClipboard.times, 1);
    assert.deepEqual(copyToClipboardArgs, [
      nodePath.join("/sub-dir", "item 1"),
    ]);
  });

  it("should dispatch action when onKeypress(C-r)", async () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let updateDirArgs = /** @type {any[]} */ ([]);
    const updateDir = mockFunction((...args) => {
      updateDirArgs = args;
      return action;
    });
    const actions = new MockFileListActions({ updateDir });
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("item 1")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;
    const updatedDir = /** @type {FileListDir} */ {
      path: "/updated/dir",
      isRoot: false,
      items: [FileListItem("file 1")],
    };
    const action = TaskAction(Task("Updating", Promise.resolve(updatedDir)));

    //when
    viewProps.onKeypress(null, "C-r");

    //then
    await action.task.result;
    assert.deepEqual(dispatch.times, 1);
    assert.deepEqual(dispatchArgs, [action]);
    assert.deepEqual(updateDir.times, 1);
    assert.deepEqual(updateDirArgs, [dispatch, "/sub-dir"]);
  });

  it("should dispatch action when onKeypress(enter)", async () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let changeDirArgs = /** @type {any[]} */ ([]);
    const changeDir = mockFunction((...args) => {
      changeDirArgs = args;
      return action;
    });
    const actions = new MockFileListActions({ changeDir });
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("dir 1", true)],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;
    const changedDir = /** @type {FileListDir} */ {
      path: "test",
      isRoot: false,
      items: [],
    };
    const action = TaskAction(
      Task("Changing dir", Promise.resolve(changedDir))
    );

    //when
    viewProps.onKeypress(null, "enter");

    //then
    await action.task.result;
    assert.deepEqual(dispatch.times, 1);
    assert.deepEqual(dispatchArgs, [action]);
    assert.deepEqual(changeDir.times, 1);
    assert.deepEqual(changeDirArgs, [dispatch, "/sub-dir", "dir 1"]);
  });

  it("should dispatch action when onKeypress(C-pageup)", async () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let changeDirArgs = /** @type {any[]} */ ([]);
    const changeDir = mockFunction((...args) => {
      changeDirArgs = args;
      return action;
    });
    const actions = new MockFileListActions({ changeDir });
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("item 1")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;
    const changedDir = /** @type {FileListDir} */ {
      path: "test",
      isRoot: false,
      items: [],
    };
    const action = TaskAction(
      Task("Changing dir", Promise.resolve(changedDir))
    );

    //when
    viewProps.onKeypress(null, "C-pageup");

    //then
    await action.task.result;
    assert.deepEqual(dispatch.times, 1);
    assert.deepEqual(dispatchArgs, [action]);
    assert.deepEqual(changeDir.times, 1);
    assert.deepEqual(changeDirArgs, [dispatch, "/sub-dir", ".."]);
  });

  it("should emit keypress(Alt-l) if root dir when onKeypress(C-pageup) in Left panel", () => {
    //given
    let capturedKey = null;
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        capturedKey = key;
      }
    );
    process.stdin.on("keypress", keyListener);

    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: true,
        items: [FileListItem("item 1")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const isRight = false;
    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props), { isRight })
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;

    //when
    viewProps.onKeypress(null, "C-pageup");

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(dispatch.times, 0);
    assert.deepEqual(capturedKey, {
      name: "l",
      ctrl: false,
      meta: true,
      shift: false,
    });
  });

  it("should emit keypress(Alt-r) if root dir when onKeypress(C-pageup) in Right panel", () => {
    //given
    let capturedKey = null;
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        capturedKey = key;
      }
    );
    process.stdin.on("keypress", keyListener);

    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: true,
        items: [FileListItem("item 1")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const isRight = true;
    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props), { isRight })
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;

    //when
    viewProps.onKeypress(null, "C-pageup");

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(dispatch.times, 0);
    assert.deepEqual(capturedKey, {
      name: "r",
      ctrl: false,
      meta: true,
      shift: false,
    });
  });

  it("should dispatch action when onKeypress(C-pagedown)", async () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let changeDirArgs = /** @type {any[]} */ ([]);
    const changeDir = mockFunction((...args) => {
      changeDirArgs = args;
      return action;
    });
    const actions = new MockFileListActions({ changeDir });
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("dir 1", true)],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;
    const changedDir = /** @type {FileListDir} */ {
      path: "test",
      isRoot: false,
      items: [],
    };
    const action = TaskAction(
      Task("Changing dir", Promise.resolve(changedDir))
    );

    //when
    viewProps.onKeypress(null, "C-pagedown");

    //then
    await action.task.result;
    assert.deepEqual(dispatch.times, 1);
    assert.deepEqual(dispatchArgs, [action]);
    assert.deepEqual(changeDir.times, 1);
    assert.deepEqual(changeDirArgs, [dispatch, "/sub-dir", "dir 1"]);
  });

  it("should not dispatch action if file when onKeypress(C-pagedown)", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [FileListItem("file 1")],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);

    const comp = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    ).root;
    const viewProps = comp.findByType(fileListPanelView).props;

    //when
    viewProps.onKeypress(null, "C-pagedown");

    //then
    assert.deepEqual(dispatch.times, 0);
  });

  it("should show quick Search box when onKeypress(C-s)", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = FileListState();
    const props = getFileListPanelProps(dispatch, actions, state);
    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    const viewProps = renderer.root.findByType(fileListPanelView).props;

    //when
    TestRenderer.act(() => {
      viewProps.onKeypress(null, "C-s");
    });

    //then
    assert.deepEqual(
      renderer.root.findByType(fileListQuickSearch).props.text,
      ""
    );
  });

  it("should hide quick Search box when onKeypress(key.length > 1)", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = FileListState();
    const props = getFileListPanelProps(dispatch, actions, state);
    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    renderer.root.findByType(fileListPanelView).props.onKeypress(null, "C-s");
    assert.deepEqual(
      renderer.root.findAllByType(fileListQuickSearch).length,
      1
    );

    //when
    TestRenderer.act(() => {
      renderer.root
        .findByType(fileListPanelView)
        .props.onKeypress(null, "unknown");
    });

    //then
    assert.deepEqual(
      renderer.root.findAllByType(fileListQuickSearch).length,
      0
    );
  });

  it("should hide quick Search box when panel is deactivated", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = FileListState();
    const props = getFileListPanelProps(dispatch, actions, state);
    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props), {}, true)
    );
    renderer.root.findByType(fileListPanelView).props.onKeypress(null, "C-s");
    assert.deepEqual(
      renderer.root.findAllByType(fileListQuickSearch).length,
      1
    );

    //when
    TestRenderer.act(() => {
      renderer.update(withStackContext(h(FileListPanel, props)));
    });

    //then
    assert.deepEqual(
      renderer.root.findAllByType(fileListQuickSearch).length,
      0
    );
  });

  it("should hide quick Search box when onClose", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = FileListState();
    const props = getFileListPanelProps(dispatch, actions, state);
    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    renderer.root.findByType(fileListPanelView).props.onKeypress(null, "C-s");
    const searchProps = renderer.root.findByType(fileListQuickSearch).props;

    //when
    searchProps.onClose();

    //then
    assert.deepEqual(
      renderer.root.findAllByType(fileListQuickSearch).length,
      0
    );
  });

  it("should dispatch actions when quick Search", () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [
          FileListItem.up,
          FileListItem("aB 1"),
          FileListItem("aBc1"),
          FileListItem("aBc 2"),
          FileListItem("aBc+3"),
          FileListItem("aBc-4"),
        ],
      },
    };
    const props = getFileListPanelProps(dispatch, actions, state);
    const renderer = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    );
    renderer.root.findByType(fileListPanelView).props.onKeypress(null, "C-s");

    /** @type {(params: {key: string, index: number, text: string, dispatchAction: boolean}) => void} */
    function check({ key, index, text, dispatchAction }) {
      //given
      const dispatchTimes = dispatch.times;
      /** @type {FileListAction} */
      const action = {
        action: "FileListParamsChangedAction",
        offset: 0,
        index: index,
        selectedNames: props.state.selectedNames,
      };

      //when
      renderer.root.findByType(fileListPanelView).props.onKeypress(null, key);

      //then
      assert.deepEqual(
        renderer.root.findByType(fileListQuickSearch).props.text,
        text
      );
      if (dispatchAction) {
        assert.deepEqual(dispatch.times, dispatchTimes + 1);
        assert.deepEqual(dispatchArgs, [action]);
      }
    }

    //when & then
    check({ key: "a", index: 1, text: "a", dispatchAction: true });
    check({ key: "S-b", index: 1, text: "aB", dispatchAction: true });
    check({ key: "c", index: 2, text: "aBc", dispatchAction: true });
    check({ key: "backspace", index: 2, text: "aB", dispatchAction: false });
    check({ key: "d", index: 2, text: "aB", dispatchAction: false });
    check({ key: "c", index: 2, text: "aBc", dispatchAction: true });
    check({ key: "space", index: 3, text: "aBc ", dispatchAction: true });
    check({ key: "backspace", index: 3, text: "aBc", dispatchAction: false });
    check({ key: "1", index: 2, text: "aBc1", dispatchAction: true });
    check({ key: "backspace", index: 2, text: "aBc", dispatchAction: false });
    check({ key: "+", index: 4, text: "aBc+", dispatchAction: true });
    check({ key: "backspace", index: 4, text: "aBc", dispatchAction: false });
    check({ key: "-", index: 5, text: "aBc-", dispatchAction: true });
    check({ key: "4", index: 5, text: "aBc-4", dispatchAction: true });
  });

  it("should render initial component", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const props = getFileListPanelProps(dispatch, actions, FileListState());

    //when
    const result = TestRenderer.create(
      withStackContext(h(FileListPanel, props))
    ).root;

    //then
    assertFileListPanel(result, props);
  });
});

/**
 * @param {Dispatch} dispatch
 * @param {FileListActions} actions
 * @param {FileListState} state
 * @param {Partial<FileListPanelProps>} props
 * @returns {FileListPanelProps}
 */
function getFileListPanelProps(dispatch, actions, state, props = {}) {
  return {
    dispatch,
    actions,
    state,
    onKeypress: mockFunction(),
    ...props,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {FileListPanelProps} props
 */
function assertFileListPanel(result, props) {
  assert.deepEqual(FileListPanel.displayName, "FileListPanel");

  assertComponents(
    result.children,
    h(fileListPanelView, {
      dispatch: props.dispatch,
      actions: props.actions,
      state: props.state,
      onKeypress: mockFunction(),
    })
  );
}
