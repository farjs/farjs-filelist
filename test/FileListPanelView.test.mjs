/**
 * @typedef {import("../src/FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("../src/FileListState.mjs").FileListState} FileListState
 * @typedef {import("../src/FileListPanelView.mjs").FileListPanelViewProps} FileListPanelViewProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import DoubleBorder from "@farjs/ui/border/DoubleBorder.mjs";
import HorizontalLine from "@farjs/ui/border/HorizontalLine.mjs";
import DoubleChars from "@farjs/ui/border/DoubleChars.mjs";
import SingleChars from "@farjs/ui/border/SingleChars.mjs";
import TextAlign from "@farjs/ui/TextAlign.mjs";
import TextLine from "@farjs/ui/TextLine.mjs";
import FileListTheme from "../src/theme/FileListTheme.mjs";
import withThemeContext from "../src/theme/withThemeContext.mjs";
import withStackContext from "../src/stack/withStackContext.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import FileListActions from "../src/FileListActions.mjs";
import MockFileListActions from "../src/MockFileListActions.mjs";
import FileListState from "../src/FileListState.mjs";
import FileListSort from "../src/sort/FileListSort.mjs";
import SortIndicator from "../src/sort/SortIndicator.mjs";
import FileList from "../src/FileList.mjs";
import FileListPanelView from "../src/FileListPanelView.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

FileListPanelView.doubleBorderComp = mockComponent(DoubleBorder);
FileListPanelView.horizontalLineComp = mockComponent(HorizontalLine);
FileListPanelView.fileListComp = mockComponent(FileList);
FileListPanelView.textLineComp = mockComponent(TextLine);
FileListPanelView.sortIndicator = mockComponent(SortIndicator);

const size = {
  width: 25,
  height: 15,
};
const {
  doubleBorderComp,
  horizontalLineComp,
  fileListComp,
  textLineComp,
  sortIndicator,
} = FileListPanelView;

describe("FileListPanelView.test.mjs", () => {
  it("should render empty component", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = FileListState();
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state);
  });

  it("should render component with selected one file and with diskSpace", () => {
    //given
    const date = new Date();
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      index: 2,
      currDir: {
        path: "/",
        isRoot: true,
        items: [
          { ...FileListItem("dir 1", true), size: 1 },
          { ...FileListItem("dir 2", true), size: 2 },
          { ...FileListItem("file"), size: 3, mtimeMs: date.getTime() },
        ],
      },
      selectedNames: new Set(["dir 2"]),
      diskSpace: 12345678.9,
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "file",
      expectedFileSize: "3",
      dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      selected: "2 in 1 file",
      dirSize: "3 (1)",
      diskSpace: "12,345,679",
    });
  });

  it("should render component with selected more than one file", () => {
    //given
    const date = new Date();
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      index: 2,
      currDir: {
        path: "/",
        isRoot: true,
        items: [
          { ...FileListItem("dir 1", true), size: 1 },
          { ...FileListItem("dir 2", true), size: 2 },
          { ...FileListItem("file"), size: 3, mtimeMs: date.getTime() },
        ],
      },
      selectedNames: new Set(["dir 2", "file"]),
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "file",
      expectedFileSize: "3",
      dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      selected: "5 in 2 files",
      dirSize: "3 (1)",
    });
  });

  it("should render active component with root dir and focused file", () => {
    //given
    const date = new Date();
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      index: 1,
      currDir: {
        path: "/",
        isRoot: true,
        items: [
          { ...FileListItem("file 1"), size: 1 },
          {
            ...FileListItem("file 2"),
            size: 2,
            mtimeMs: date.getTime(),
            permissions: "drwxr-xr-x",
          },
          { ...FileListItem("file 3"), size: 3 },
        ],
      },
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);
    const isActive = true;

    //when
    const result = TestRenderer.create(
      withStackContext(
        withThemeContext(h(FileListPanelView, props)),
        size,
        isActive
      )
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "file 2",
      expectedFileSize: "2",
      permissions: "drwxr-xr-x",
      dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      dirSize: "6 (3)",
      isActive,
    });
  });

  it("should render component with root dir and focused dir", () => {
    //given
    const date = new Date();
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      index: 1,
      currDir: {
        path: "/",
        isRoot: true,
        items: [
          { ...FileListItem("file 1"), size: 1 },
          {
            ...FileListItem("dir 2", true),
            size: 999999999,
            mtimeMs: date.getTime(),
            permissions: "drwxr-xr-x",
          },
          { ...FileListItem("file 3"), size: 3 },
        ],
      },
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "dir 2",
      expectedFileSize: "999,999,999",
      permissions: "drwxr-xr-x",
      dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      dirSize: "4 (2)",
    });
  });

  it("should render component with root dir and focused file of big size", () => {
    //given
    const date = new Date();
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      index: 1,
      currDir: {
        path: "/",
        isRoot: true,
        items: [
          { ...FileListItem("file 1"), size: 1 },
          {
            ...FileListItem("file 2"),
            size: 1123456789,
            mtimeMs: date.getTime(),
            permissions: "drwxr-xr-x",
          },
          { ...FileListItem("file 3"), size: 3 },
        ],
      },
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "file 2",
      expectedFileSize: "~1 G",
      permissions: "drwxr-xr-x",
      dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      dirSize: "1,123,456,793 (3)",
    });
  });

  it("should render component with sub-dir and focused dir", () => {
    //given
    const date = new Date();
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      index: 1,
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [
          FileListItem.up,
          {
            ...FileListItem("dir", true),
            size: 1,
            mtimeMs: date.getTime(),
            permissions: "dr--r--r--",
          },
          { ...FileListItem("file"), size: 2 },
        ],
      },
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "dir",
      expectedFileSize: "1",
      permissions: "dr--r--r--",
      dateTime: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      dirSize: "2 (1)",
    });
  });

  it("should render component with sub-dir and focused ..", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = {
      ...FileListState(),
      currDir: {
        path: "/sub-dir",
        isRoot: false,
        items: [
          FileListItem.up,
          { ...FileListItem("dir", true), size: 1 },
          { ...FileListItem("file"), size: 2 },
        ],
      },
    };
    const props = getFileListPanelViewProps(dispatch, actions, state);

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListPanelView, props)), size)
    ).root;

    //then
    assertFileListPanelView(result, props, state, {
      expectedFile: "..",
      dirSize: "2 (1)",
    });
  });
});

/**
 * @param {Dispatch} dispatch
 * @param {FileListActions} actions
 * @param {FileListState} state
 * @param {Partial<FileListPanelViewProps>} props
 * @returns {FileListPanelViewProps}
 */
function getFileListPanelViewProps(dispatch, actions, state, props = {}) {
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
 * @param {FileListPanelViewProps} props
 * @param {FileListState} state
 * @param {{
 *  expectedFile?: string;
 *  expectedFileSize?: string;
 *  permissions?: string;
 *  dateTime?: string;
 *  selected?: string;
 *  dirSize?: string;
 *  diskSpace?: string;
 *  isActive?: boolean;
 * }} params
 */
function assertFileListPanelView(
  result,
  props,
  state,
  {
    expectedFile = "",
    expectedFileSize = "",
    permissions = "",
    dateTime = "",
    selected,
    dirSize = "0 (0)",
    diskSpace,
    isActive = false,
  } = {}
) {
  assert.deepEqual(FileListPanelView.displayName, "FileListPanelView");

  const theme = FileListTheme.defaultTheme.fileList;
  const { width, height } = size;

  assertComponents(
    result.children,
    h(
      "box",
      {
        style: theme.regularItem,
      },
      ...[
        h(doubleBorderComp, {
          width,
          height,
          style: theme.regularItem,
        }),
        h(horizontalLineComp, {
          left: 0,
          top: height - 4,
          length: width,
          lineCh: SingleChars.horizontal,
          style: theme.regularItem,
          startCh: DoubleChars.leftSingle,
          endCh: DoubleChars.rightSingle,
        }),
        h(fileListComp, {
          dispatch: props.dispatch,
          actions: props.actions,
          state: state,
          width: width - 2,
          height: height - 5,
          columns: 2,
          onKeypress: mockFunction(),
        }),
        h(textLineComp, {
          align: TextAlign.center,
          left: 1,
          top: 0,
          width: width - 2,
          text: state.currDir.path,
          style: theme.regularItem,
          focused: isActive,
        }),
        h(sortIndicator, {
          sort: FileListSort(props.state.sort.mode, props.state.sort.asc),
        }),

        selected
          ? h(textLineComp, {
              align: TextAlign.center,
              left: 1,
              top: height - 4,
              width: width - 2,
              text: selected,
              style: theme.selectedItem,
            })
          : null,

        h(textLineComp, {
          align: TextAlign.left,
          left: 1,
          top: height - 3,
          width: width - 2 - 12,
          text: expectedFile,
          style: theme.regularItem,
          padding: 0,
        }),
        h(textLineComp, {
          align: TextAlign.right,
          left: 1 + width - 2 - 12,
          top: height - 3,
          width: 12,
          text: expectedFileSize,
          style: theme.regularItem,
          padding: 0,
        }),

        h(textLineComp, {
          align: TextAlign.left,
          left: 1,
          top: height - 2,
          width: 10,
          text: permissions,
          style: theme.regularItem,
          padding: 0,
        }),
        h(textLineComp, {
          align: TextAlign.right,
          left: 1 + width - 2 - 25,
          top: height - 2,
          width: 25,
          text: dateTime,
          style: theme.regularItem,
          padding: 0,
        }),

        h(textLineComp, {
          align: TextAlign.center,
          left: 1,
          top: height - 1,
          width: !diskSpace ? width - 2 : Math.trunc((width - 2) / 2),
          text: dirSize,
          style: theme.regularItem,
        }),
        diskSpace
          ? h(textLineComp, {
              align: TextAlign.center,
              left: Math.trunc((width - 2) / 2) + 1,
              top: height - 1,
              width: Math.trunc((width - 2) / 2),
              text: diskSpace,
              style: theme.regularItem,
            })
          : null,
      ].filter((_) => _ !== null)
    )
  );
}
