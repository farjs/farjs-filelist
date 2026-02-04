/**
 * @typedef {import("../src/theme/FileListTheme.mjs").FileListTheme} FileListTheme
 * @typedef {import("../src/api/FileListItem.mjs").FileListItem} FileListItem
 * @typedef {import("../src/FileListView.mjs").FileListViewProps} FileListViewProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import DoubleChars from "@farjs/ui/border/DoubleChars.mjs";
import SingleChars from "@farjs/ui/border/SingleChars.mjs";
import VerticalLine from "@farjs/ui/border/VerticalLine.mjs";
import FileListTheme from "../src/theme/FileListTheme.mjs";
import withThemeContext from "../src/theme/withThemeContext.mjs";
import withStackContext from "../src/stack/withStackContext.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import FileListColumn from "../src/FileListColumn.mjs";
import FileListView from "../src/FileListView.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

FileListView.verticalLineComp = mockComponent(VerticalLine);
FileListView.fileListColumnComp = mockComponent(FileListColumn);

const { verticalLineComp, fileListColumnComp } = FileListView;

describe("FileListView.test.mjs", () => {
  /**
   * @typedef {{
   *  readonly name: string;
   *  readonly listener: any;
   * }} ListenerInfo
   */

  it("should call onWheel when onWheelup/onWheeldown", () => {
    //given
    /** @type {any} */
    let capturedOnWheelArg = null;
    const onWheel = mockFunction((up) => {
      capturedOnWheelArg = up;
    });
    const props = getFileListViewProps({ onWheel });
    /** @type {ListenerInfo[]} */
    const capturedOnListeners = [];
    /** @type {(name: string) => any} */
    const getListener = (name) =>
      capturedOnListeners.find((_) => _.name === name)?.listener;
    const onMock = mockFunction((name, listener) => {
      capturedOnListeners.push({ name, listener });
    });
    /** @type {ListenerInfo[]} */
    const capturedOffListeners = [];
    const offMock = mockFunction((name, listener) => {
      capturedOffListeners.push({ name, listener });
    });
    const renderer = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), {
        panelInput: /** @type {any} */ ({
          on: onMock,
          off: offMock,
        }),
      }),
      {
        createNodeMock: (el) => {
          return el.type === "box" ? { aleft: 5, atop: 3 } : null;
        },
      },
    );

    /** @type {(arg: {up: boolean, shift: boolean}) => void} */
    function check({ up, shift }) {
      //given
      const onWheelTimes = onWheel.times;

      //when
      if (up) getListener("wheelup")({ shift });
      else getListener("wheeldown")({ shift });

      //then
      if (!shift) {
        assert.deepEqual(onWheel.times, onWheelTimes + 1);
        assert.deepEqual(capturedOnWheelArg, up);
      } else {
        assert.deepEqual(onWheel.times, onWheelTimes);
      }
    }

    //when & then
    check({ up: false, shift: false });
    check({ up: true, shift: false });
    check({ up: false, shift: true });
    check({ up: true, shift: true });

    //when & then
    renderer.unmount();
    assert.deepEqual(capturedOffListeners, capturedOnListeners);
  });

  it("should call onClick when onClick", () => {
    //given
    /** @type {any} */
    let capturedOnClickArg = null;
    const onClick = mockFunction((index) => {
      capturedOnClickArg = index;
    });
    const props = getFileListViewProps({
      width: 7,
      height: 3,
      columns: 2,
      items: [
        FileListItem("item 1"),
        FileListItem("item 2"),
        FileListItem("item 3"),
      ],
      onClick,
    });
    /** @type {ListenerInfo[]} */
    const capturedOnListeners = [];
    /** @type {(name: string) => any} */
    const getListener = (name) =>
      capturedOnListeners.find((_) => _.name === name)?.listener;
    const onMock = mockFunction((name, listener) => {
      capturedOnListeners.push({ name, listener });
    });
    /** @type {ListenerInfo[]} */
    const capturedOffListeners = [];
    const offMock = mockFunction((name, listener) => {
      capturedOffListeners.push({ name, listener });
    });
    const renderer = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), {
        panelInput: /** @type {any} */ ({
          on: onMock,
          off: offMock,
        }),
      }),
      {
        createNodeMock: (el) => {
          return el.type === "box" ? { aleft: 5, atop: 3 } : null;
        },
      },
    );

    /** @type {(arg: {x: number, y: number, index: number}) => void} */
    function check({ x, y, index }) {
      //given
      const onClickTimes = onClick.times;

      //when
      getListener("click")({ x, y });

      //then
      assert.deepEqual(onClick.times, onClickTimes + 1);
      assert.deepEqual(capturedOnClickArg, index);
    }

    //when & then
    check({ x: 6, y: 3, index: 0 }); // header in col 1
    check({ x: 6, y: 4, index: 0 }); // first item in col 1
    check({ x: 6, y: 5, index: 1 }); // second item in col 1

    //when & then
    check({ x: 8, y: 3, index: 2 }); // header in col 2
    check({ x: 8, y: 4, index: 2 }); // first item in col 2
    check({ x: 8, y: 5, index: 3 }); // last item in col 2

    //when & then
    renderer.unmount();
    assert.deepEqual(capturedOffListeners, capturedOnListeners);
  });

  it("should call onKeypress when onKeypress(...)", () => {
    //given
    /** @type {any[]} */
    let capturedonKeypressArgs = [];
    const onKeypress = mockFunction((...args) => {
      capturedonKeypressArgs = args;
    });
    const props = getFileListViewProps({
      width: 7,
      height: 3,
      columns: 2,
      items: [FileListItem("item 1"), FileListItem("item 2")],
      onKeypress,
    });
    /** @type {ListenerInfo[]} */
    const capturedOnListeners = [];
    /** @type {(name: string) => any} */
    const getListener = (name) =>
      capturedOnListeners.find((_) => _.name === name)?.listener;
    const onMock = mockFunction((name, listener) => {
      capturedOnListeners.push({ name, listener });
    });
    /** @type {ListenerInfo[]} */
    const capturedOffListeners = [];
    const offMock = mockFunction((name, listener) => {
      capturedOffListeners.push({ name, listener });
    });
    const screen = {};
    const renderer = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), {
        panelInput: /** @type {any} */ ({
          screen,
          on: onMock,
          off: offMock,
        }),
      }),
      {
        createNodeMock: (el) => {
          return el.type === "box" ? { aleft: 5, atop: 3 } : null;
        },
      },
    );
    const keyFull = "some-key";

    //when
    getListener("keypress")(null, { full: keyFull });

    //then
    assert.deepEqual(onKeypress.times, 1);
    assert.deepEqual(capturedonKeypressArgs, [screen, keyFull]);

    //when & then
    renderer.unmount();
    assert.deepEqual(capturedOffListeners, capturedOnListeners);
  });

  it("should re-subscribe listeners when input element changes", () => {
    //given
    const props = getFileListViewProps();
    /** @type {string[]} */
    const capturedOffListeners = [];
    const offMock = mockFunction((n) => capturedOffListeners.push(n));
    const renderer = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), {
        panelInput: /** @type {any} */ ({
          on: mockFunction(),
          off: offMock,
        }),
      }),
    );

    //when
    TestRenderer.act(() =>
      renderer.update(
        withStackContext(withThemeContext(h(FileListView, props)), {
          panelInput: /** @type {any} */ ({
            on: mockFunction(),
            off: offMock,
          }),
        }),
      ),
    );

    //then
    assert.deepEqual(capturedOffListeners, [
      "keypress",
      "wheelup",
      "wheeldown",
      "click",
    ]);
  });

  it("should render empty component when height < 2", () => {
    //given
    const props = getFileListViewProps({
      width: 13,
      height: 1,
      columns: 2,
      items: [FileListItem("item 1"), FileListItem("item 2")],
    });

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), {
        panelInput: /** @type {any} */ ({
          on: mockFunction(),
          off: mockFunction(),
        }),
      }),
    ).root;

    //then
    assertComponents(
      result.children,
      h("box", { width: props.width, height: props.height }),
    );
  });

  it("should render component with 2 columns", () => {
    //given
    const props = getFileListViewProps({
      width: 7,
      height: 2,
      columns: 2,
      items: [FileListItem("item 1"), FileListItem("item 2")],
      focusedIndex: 1,
      selectedNames: new Set(["item 2"]),
    });

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), {
        panelInput: /** @type {any} */ ({
          on: mockFunction(),
          off: mockFunction(),
        }),
      }),
    ).root;

    //then
    assertFileListView(result, props, [
      {
        items: [FileListItem("item 1")],
        colLeft: 0,
        colWidth: 2,
        focusedIndex: -1,
      },
      {
        items: [FileListItem("item 2")],
        colLeft: 3,
        colWidth: 4,
        focusedIndex: 0,
      },
    ]);
  });

  it("should re-render when width changes", () => {
    //given
    const stack = {
      panelInput: /** @type {any} */ ({
        on: mockFunction(),
        off: mockFunction(),
      }),
    };
    const props = getFileListViewProps({
      width: 7,
      height: 2,
      columns: 2,
      items: [FileListItem("item 1"), FileListItem("item 2")],
      focusedIndex: 1,
      selectedNames: new Set(["item 2"]),
    });
    const renderer = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), stack),
    );
    const updatedProps = { ...props, width: 8 };

    //when
    TestRenderer.act(() =>
      renderer.update(
        withStackContext(
          withThemeContext(h(FileListView, updatedProps)),
          stack,
        ),
      ),
    );

    //then
    assertFileListView(renderer.root, updatedProps, [
      {
        items: [FileListItem("item 1")],
        colLeft: 0,
        colWidth: 3,
        focusedIndex: -1,
      },
      {
        items: [FileListItem("item 2")],
        colLeft: 4,
        colWidth: 4,
        focusedIndex: 0,
      },
    ]);
  });

  it("should re-render when columns changes", () => {
    //given
    const stack = {
      panelInput: /** @type {any} */ ({
        on: mockFunction(),
        off: mockFunction(),
      }),
    };
    const props = getFileListViewProps({
      width: 7,
      height: 2,
      columns: 2,
      items: [FileListItem("item 1"), FileListItem("item 2")],
      focusedIndex: 1,
      selectedNames: new Set(["item 2"]),
    });
    const renderer = TestRenderer.create(
      withStackContext(withThemeContext(h(FileListView, props)), stack),
    );
    const updatedProps = { ...props, columns: 1 };

    //when
    TestRenderer.act(() =>
      renderer.update(
        withStackContext(
          withThemeContext(h(FileListView, updatedProps)),
          stack,
        ),
      ),
    );

    //then
    assertFileListView(renderer.root, updatedProps, [
      {
        items: [FileListItem("item 1")],
        colLeft: 0,
        colWidth: 7,
        focusedIndex: -1,
      },
    ]);
  });
});

/**
 * @param {Partial<FileListViewProps>} props
 * @returns {FileListViewProps}
 */
function getFileListViewProps(props = {}) {
  return {
    width: 1,
    height: 2,
    columns: 3,
    items: [],
    focusedIndex: -1,
    selectedNames: new Set(),
    onWheel: mockFunction(),
    onClick: mockFunction(),
    onKeypress: mockFunction(),
    ...props,
  };
}

/**
 * @typedef {{
 *  readonly items: FileListItem[];
 *  readonly colLeft: number;
 *  readonly colWidth: number;
 *  readonly focusedIndex: number;
 * }} ColumnData
 */

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {FileListViewProps} props
 * @param {ColumnData[]} expectedData
 */
function assertFileListView(result, props, expectedData) {
  assert.deepEqual(FileListView.displayName, "FileListView");
  const currTheme = FileListTheme.defaultTheme;

  assertComponents(
    result.children,
    h(
      "box",
      {
        width: props.width,
        height: props.height,
        left: 1,
        top: 1,
      },
      ...expectedData
        .flatMap(({ items, colLeft, colWidth, focusedIndex }, index) => {
          return [
            index !== expectedData.length - 1
              ? h(verticalLineComp, {
                  left: colLeft + colWidth,
                  top: -1,
                  length: 4,
                  lineCh: SingleChars.vertical,
                  style: currTheme.fileList.regularItem,
                  startCh: DoubleChars.topSingle,
                  endCh: SingleChars.bottom,
                })
              : null,
            h(fileListColumnComp, {
              width: colWidth,
              height: 2,
              left: colLeft,
              borderCh:
                index !== expectedData.length - 1
                  ? SingleChars.vertical
                  : DoubleChars.vertical,
              items,
              focusedIndex,
              selectedNames: props.selectedNames,
            }),
          ];
        })
        .filter((_) => _),
    ),
  );
}
