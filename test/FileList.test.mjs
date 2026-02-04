/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("../src/api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("../src/FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("../src/FileListActions.mjs").FileListAction} FileListAction
 * @typedef {import("../src/FileListState.mjs").FileListState} FileListState
 * @typedef {import("../src/FileList.mjs").FileListProps} FileListProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import Task from "@farjs/ui/task/Task.mjs";
import TaskAction from "@farjs/ui/task/TaskAction.mjs";
import withStackContext from "../src/stack/withStackContext.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import FileListActions from "../src/FileListActions.mjs";
import MockFileListActions from "../src/MockFileListActions.mjs";
import FileListState from "../src/FileListState.mjs";
import FileListView from "../src/FileListView.mjs";
import FileList from "../src/FileList.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

FileList.fileListViewComp = mockComponent(FileListView);

const { fileListViewComp } = FileList;

describe("FileList.test.mjs", () => {
  it("should dispatch action only once when mount but not when update", async () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let changeDirArgs = /** @type {any[]} */ ([]);
    const changeDir = mockFunction((...args) => {
      changeDirArgs = args;
      return action;
    });
    const actions = new MockFileListActions({ changeDir });
    const state1 = FileListState();
    const props1 = getFileListProps(dispatch, actions, state1, {
      width: 7,
      height: 2,
      columns: 2,
    });
    const state2 = { ...state1, offset: state1.offset + 1 };
    const props2 = { ...props1, state: state2 };
    const action = TaskAction(
      Task("Changing dir", Promise.resolve(state1.currDir)),
    );

    //when
    const renderer = TestRenderer.create(withStackContext(h(FileList, props1)));
    renderer.update(withStackContext(h(FileList, props2)));

    //cleanup
    renderer.unmount();

    //then
    assert.deepEqual(dispatch.times, 1);
    assert.deepEqual(dispatchArgs, [action]);
    assert.deepEqual(changeDir.times, 1);
    assert.deepEqual(changeDirArgs, [dispatch, "", FileListItem.currDir.name]);

    await action.task.result;
  });

  it("should focus item when onWheel and active", () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    const actions = new MockFileListActions();
    const props = getFileListProps(
      dispatch,
      actions,
      {
        ...FileListState(),
        currDir: {
          path: "/",
          isRoot: true,
          items: [
            FileListItem("item 1"),
            FileListItem("item 2"),
            FileListItem("item 3"),
            FileListItem("item 4"),
            FileListItem("item 5"),
          ],
        },
      },
      {
        width: 7,
        height: 3,
        columns: 2,
      },
    );
    const renderer = TestRenderer.create(
      withStackContext(h(FileList, props), {}, true),
    );
    assert.deepEqual(
      renderer.root.findByType(fileListViewComp).props.focusedIndex,
      0,
    );

    /**
     * @type {(params: {up: boolean, offset: number, index: number, changed?: boolean}) => void}
     */
    function check({ up, offset, index, changed = true }) {
      const dispatchTimes = dispatch.times;
      const state = { ...props.state, offset, index };

      //when
      renderer.root.findByType(fileListViewComp).props.onWheel(up);
      renderer.update(
        withStackContext(h(FileList, { ...props, state }), {}, true),
      );

      //then
      assert.deepEqual(
        renderer.root.findByType(fileListViewComp).props.focusedIndex,
        index,
      );
      if (changed) {
        assert.deepEqual(dispatch.times, dispatchTimes + 1);
        /** @type {FileListAction} */
        const action = {
          action: "FileListParamsChangedAction",
          offset,
          index,
          selectedNames: new Set(),
        };
        assert.deepEqual(dispatchArgs, [action]);
      } else {
        assert.deepEqual(dispatch.times, dispatchTimes);
      }
    }

    //when & then
    check({ up: false, offset: 1, index: 0 });
    check({ up: false, offset: 1, index: 1 });
    check({ up: false, offset: 1, index: 2 });
    check({ up: false, offset: 1, index: 3 });
    check({ up: false, offset: 1, index: 3, changed: false });

    //when & then
    check({ up: true, offset: 0, index: 3 });
    check({ up: true, offset: 0, index: 2 });
    check({ up: true, offset: 0, index: 1 });
    check({ up: true, offset: 0, index: 0 });
    check({ up: true, offset: 0, index: 0, changed: false });
  });

  it("should not focus item when onWheel and not active", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const props = getFileListProps(
      dispatch,
      actions,
      {
        ...FileListState(),
        currDir: {
          path: "/",
          isRoot: true,
          items: [FileListItem("item 1"), FileListItem("item 2")],
        },
      },
      {
        width: 7,
        height: 3,
        columns: 2,
      },
    );
    const comp = TestRenderer.create(withStackContext(h(FileList, props))).root;
    const viewProps = comp.findByType(fileListViewComp).props;
    assert.deepEqual(viewProps.focusedIndex, -1);

    //when
    viewProps.onWheel(false);
    viewProps.onWheel(true);

    //then
    assert.deepEqual(dispatch.times, 0);
  });

  it("should focus item when onClick", () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    const actions = new MockFileListActions();
    const props = getFileListProps(
      dispatch,
      actions,
      {
        ...FileListState(),
        currDir: {
          path: "/",
          isRoot: true,
          items: [
            FileListItem("item 1"),
            FileListItem("item 2"),
            FileListItem("item 3"),
          ],
        },
      },
      {
        width: 7,
        height: 3,
        columns: 2,
      },
    );
    const renderer = TestRenderer.create(
      withStackContext(h(FileList, props), {}, true),
    );
    assert.deepEqual(
      renderer.root.findByType(fileListViewComp).props.focusedIndex,
      0,
    );

    /**
     * @type {(params: {clickIndex: number, index: number, changed?: boolean}) => void}
     */
    function check({ clickIndex, index, changed = true }) {
      const dispatchTimes = dispatch.times;
      const state = { ...props.state, offset: 0, index };

      //when
      renderer.root.findByType(fileListViewComp).props.onClick(clickIndex);
      renderer.update(
        withStackContext(h(FileList, { ...props, state }), {}, true),
      );

      //then
      assert.deepEqual(
        renderer.root.findByType(fileListViewComp).props.focusedIndex,
        index,
      );
      if (changed) {
        assert.deepEqual(dispatch.times, dispatchTimes + 1);
        /** @type {FileListAction} */
        const action = {
          action: "FileListParamsChangedAction",
          offset: 0,
          index,
          selectedNames: new Set(),
        };
        assert.deepEqual(dispatchArgs, [action]);
      } else {
        assert.deepEqual(dispatch.times, dispatchTimes);
      }
    }

    //when & then
    check({ clickIndex: 0, index: 0, changed: false }); // first item in col 1
    check({ clickIndex: 1, index: 1 }); // second item in col 1
    check({ clickIndex: 2, index: 2 }); // first item in col 2
    check({ clickIndex: 3, index: 2, changed: false }); // last item in col 2
  });

  it("should focus and select item when onKeypress", () => {
    //given
    let onKeypressArgs = /** @type {any[]} */ ([]);
    const onKeypress = mockFunction((...args) => (onKeypressArgs = args));
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    const actions = new MockFileListActions();
    const items = [
      FileListItem("item 1"),
      FileListItem("item 2"),
      FileListItem("item 3"),
      FileListItem("item 4"),
      FileListItem("item 5"),
      FileListItem("item 6"),
      FileListItem("item 7"),
    ];
    const rootProps = getFileListProps(
      dispatch,
      actions,
      {
        ...FileListState(),
        currDir: {
          path: "/",
          isRoot: true,
          items,
        },
      },
      {
        width: 7,
        height: 3,
        columns: 2,
        onKeypress,
      },
    );
    const screen = /** @type {BlessedScreen} */ ({});
    const renderer = TestRenderer.create(
      withStackContext(h(FileList, rootProps), {}, true),
    );
    assert.deepEqual(
      renderer.root.findByType(fileListViewComp).props.focusedIndex,
      0,
    );

    /**
     * @type {(params: {
     *  key: string,
     *  items: string[],
     *  offset: number,
     *  index: number,
     *  selected: string[],
     *  changed?: boolean,
     *  props?: FileListProps,
     * }) => void}
     */
    function check({
      key,
      items,
      offset,
      index,
      selected,
      changed = true,
      props = rootProps,
    }) {
      const onKeypressTimes = onKeypress.times;
      const dispatchTimes = dispatch.times;
      const selectedSet = new Set(selected);
      const state = {
        ...props.state,
        offset,
        index,
        selectedNames: selectedSet,
      };

      //when
      renderer.root.findByType(fileListViewComp).props.onKeypress(screen, key);
      renderer.update(
        withStackContext(h(FileList, { ...props, state }), {}, true),
      );

      //then
      assert.deepEqual(onKeypress.times, onKeypressTimes + 1);
      assert.deepEqual(onKeypressArgs, [screen, key]);

      const viewItems = items.map((name) =>
        FileListItem(name, name === FileListItem.up.name),
      );
      const res = renderer.root.findByType(fileListViewComp).props;
      assert.deepEqual(res.items, viewItems);
      assert.deepEqual(res.focusedIndex, index);
      assert.deepEqual(res.selectedNames, selectedSet);
      if (changed) {
        assert.deepEqual(dispatch.times, dispatchTimes + 1);
        /** @type {FileListAction} */
        const action = {
          action: "FileListParamsChangedAction",
          offset,
          index,
          selectedNames: selectedSet,
        };
        assert.deepEqual(dispatchArgs, [action]);
      } else {
        assert.deepEqual(dispatch.times, dispatchTimes);
      }
    }

    //prettier-ignore
    {
    //when & then
    check({key: "unknown", items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: [], changed: false});

    //when & then
    check({key: "S-down",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 1, selected: ["item 1"]});
    check({key: "S-down",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 2, selected: ["item 1", "item 2"]});
    check({key: "down",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 3, selected: ["item 1", "item 2"]});
    check({key: "down",    items: ["item 2", "item 3", "item 4", "item 5"], offset: 1, index: 3, selected: ["item 1", "item 2"]});
    check({key: "S-down",  items: ["item 3", "item 4", "item 5", "item 6"], offset: 2, index: 3, selected: ["item 1", "item 2", "item 5"]});
    check({key: "S-down",  items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6"]});
    check({key: "S-down",  items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6", "item 7"]});
    check({key: "S-down",  items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6"]});
    check({key: "S-down",  items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6", "item 7"]});
    check({key: "down",    items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6", "item 7"], changed: false});

    //when & then
    check({key: "S-up",    items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 2, selected: ["item 1", "item 2", "item 5", "item 6"]});
    check({key: "S-up",    items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 1, selected: ["item 1", "item 2", "item 5"]});
    check({key: "S-up",    items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 0, selected: ["item 1", "item 2"]});
    check({key: "up",      items: ["item 3", "item 4", "item 5", "item 6"], offset: 2, index: 0, selected: ["item 1", "item 2"]});
    check({key: "up",      items: ["item 2", "item 3", "item 4", "item 5"], offset: 1, index: 0, selected: ["item 1", "item 2"]});
    check({key: "S-up",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: ["item 1"]});
    check({key: "S-up",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: []});
    check({key: "S-up",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: ["item 1"]});
    check({key: "S-up",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: []});
    check({key: "up",      items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: [], changed: false});

    //when & then
    check({key: "S-right", items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 2, selected: ["item 1", "item 2"]});
    check({key: "right",   items: ["item 3", "item 4", "item 5", "item 6"], offset: 2, index: 2, selected: ["item 1", "item 2"]});
    check({key: "S-right", items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6", "item 7"]});
    check({key: "right",   items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 5", "item 6", "item 7"], changed: false});

    //when & then
    check({key: "S-left",  items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 1, selected: ["item 1", "item 2", "item 5"]});
    check({key: "left",    items: ["item 2", "item 3", "item 4", "item 5"], offset: 1, index: 1, selected: ["item 1", "item 2", "item 5"]});
    check({key: "S-left",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: ["item 1", "item 2", "item 3", "item 5"]});
    check({key: "left",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: ["item 1", "item 2", "item 3", "item 5"], changed: false});

    //when & then
    check({key: "S-pagedown", items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 3, selected: ["item 5"]});
    check({key: "S-pagedown", items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 4", "item 5", "item 6", "item 7"]});
    check({key: "pagedown",   items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 4", "item 5", "item 6", "item 7"], changed: false});

    //when & then
    check({key: "S-pageup",items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 0, selected: ["item 4"]});
    check({key: "S-pageup",items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: []});
    check({key: "pageup",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: [], changed: false});

    //when & then
    check({key: "end",     items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: []});
    check({key: "end",     items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: [], changed: false});

    //when & then
    check({key: "home",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: []});
    check({key: "home",    items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: [], changed: false});

    //when & then
    check({key: "S-end",   items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6", "item 7"]});
    check({key: "S-end",   items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6"]});
    check({key: "S-end",   items: ["item 4", "item 5", "item 6", "item 7"], offset: 3, index: 3, selected: ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6", "item 7"]});

    //when & then
    check({key: "S-home",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: []});
    check({key: "S-home",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: ["item 1"]});
    check({key: "S-home",  items: ["item 1", "item 2", "item 3", "item 4"], offset: 0, index: 0, selected: []});

    //given
    const nonRootProps = {...rootProps, state: {...rootProps.state, currDir: {...rootProps.state.currDir, items: [FileListItem.up, ...items]}}};
    renderer.update(withStackContext(h(FileList, nonRootProps), {}, true));
    assert.deepEqual(renderer.root.findByType(fileListViewComp).props.focusedIndex, 0);

    //when & then
    check({key: "S-down",  items: ["..", "item 1", "item 2", "item 3"], offset: 0, index: 1, selected: [], props: nonRootProps});
    check({key: "S-down",  items: ["..", "item 1", "item 2", "item 3"], offset: 0, index: 2, selected: ["item 1"], props: nonRootProps});
    check({key: "up",      items: ["..", "item 1", "item 2", "item 3"], offset: 0, index: 1, selected: ["item 1"], props: nonRootProps});
    check({key: "S-up",    items: ["..", "item 1", "item 2", "item 3"], offset: 0, index: 0, selected: [], props: nonRootProps});
    } //prettier-ignore
  });

  it("should render empty component", async () => {
    //given
    let dispatchArgs = /** @type {any[]} */ ([]);
    const dispatch = mockFunction((...args) => (dispatchArgs = args));
    let changeDirArgs = /** @type {any[]} */ ([]);
    const changeDir = mockFunction((...args) => {
      changeDirArgs = args;
      return action;
    });
    const actions = new MockFileListActions({ changeDir });
    const props = getFileListProps(dispatch, actions, FileListState(), {
      width: 7,
      height: 2,
      columns: 2,
    });
    const action = TaskAction(
      Task("Changing dir", Promise.resolve(props.state.currDir)),
    );

    //when
    const result = TestRenderer.create(
      withStackContext(h(FileList, props)),
    ).root;

    //then
    assert.deepEqual(dispatch.times, 1);
    assert.deepEqual(dispatchArgs, [action]);
    assert.deepEqual(changeDir.times, 1);
    assert.deepEqual(changeDirArgs, [dispatch, "", FileListItem.currDir.name]);

    await action.task.result;
    assertFileList(result, props, {
      viewItems: [],
      focusedIndex: -1,
    });
  });

  it("should render non-empty component and focus first item", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const props = getFileListProps(
      dispatch,
      actions,
      {
        ...FileListState(),
        currDir: {
          path: "/",
          isRoot: true,
          items: [
            FileListItem("item 1"),
            FileListItem("item 2"),
            FileListItem("item 3"),
          ],
        },
      },
      {
        width: 7,
        height: 2,
        columns: 2,
      },
    );

    //when
    const result = TestRenderer.create(
      withStackContext(h(FileList, props), {}, true),
    ).root;

    //then
    assert.deepEqual(dispatch.times, 0);
    assertFileList(result, props, {
      viewItems: [FileListItem("item 1"), FileListItem("item 2")],
      focusedIndex: 0,
    });
  });

  it("should render non-empty component and focus last item", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const props = getFileListProps(
      dispatch,
      actions,
      {
        ...FileListState(),
        index: 2,
        currDir: {
          path: "/",
          isRoot: true,
          items: [
            FileListItem("item 1"),
            FileListItem("item 2"),
            FileListItem("item 3"),
          ],
        },
      },
      {
        width: 7,
        height: 2,
        columns: 2,
      },
    );

    //when
    const result = TestRenderer.create(
      withStackContext(h(FileList, props), {}, true),
    ).root;

    //then
    assert.deepEqual(dispatch.times, 0);
    assertFileList(result, props, {
      viewItems: [FileListItem("item 2"), FileListItem("item 3")],
      focusedIndex: 1,
    });
  });
});

/**
 * @param {Dispatch} dispatch
 * @param {FileListActions} actions
 * @param {FileListState} state
 * @param {Partial<FileListProps>} props
 * @returns {FileListProps}
 */
function getFileListProps(dispatch, actions, state, props = {}) {
  return {
    dispatch,
    actions,
    state,
    width: 1,
    height: 2,
    columns: 3,
    onKeypress: mockFunction(),
    ...props,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {FileListProps} props
 * @param {{
 *  viewItems: FileListItem[];
 *  focusedIndex: number;
 * }} params
 */
function assertFileList(result, props, { viewItems, focusedIndex }) {
  assert.deepEqual(FileList.displayName, "FileList");

  assertComponents(
    result.children,
    h(fileListViewComp, {
      width: props.width,
      height: props.height,
      columns: props.columns,
      items: viewItems,
      focusedIndex: focusedIndex,
      selectedNames: new Set(),
      onWheel: mockFunction(),
      onClick: mockFunction(),
      onKeypress: mockFunction(),
    }),
  );
}
