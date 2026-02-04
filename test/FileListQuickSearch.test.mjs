/**
 * @typedef {import("../src/FileListQuickSearch.mjs").FileListQuickSearchProps} FileListQuickSearchProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import DoubleBorder from "@farjs/ui/border/DoubleBorder.mjs";
import PopupOverlay from "@farjs/ui/popup/PopupOverlay.mjs";
import FileListTheme from "../src/theme/FileListTheme.mjs";
import withThemeContext from "../src/theme/withThemeContext.mjs";
import FileListQuickSearch from "../src/FileListQuickSearch.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

FileListQuickSearch.doubleBorderComp = mockComponent(DoubleBorder);

const { doubleBorderComp } = FileListQuickSearch;

describe("FileListQuickSearch.test.mjs", () => {
  it("should call onClose when onClick", () => {
    //given
    let omoveArgs = /** @type {any[]} */ ([]);
    const omove = mockFunction((...args) => (omoveArgs = args));
    let cursorShapeArgs = /** @type {any[]} */ ([]);
    const cursorShape = mockFunction((...args) => (cursorShapeArgs = args));
    const showCursor = mockFunction();
    const program = { omove, showCursor };
    const cursor = { shape: "block", blink: true };
    const screen = { program, cursor, cursorShape };
    const textEl = { screen, aleft: 1, atop: 3 };
    const onClose = mockFunction();
    const props = getFileListQuickSearchProps("text", onClose);

    const formComp = /** @type {TestRenderer.ReactTestInstance} */ (
      TestRenderer.create(withThemeContext(h(FileListQuickSearch, props)), {
        createNodeMock: (el) => (el.type === "text" ? textEl : null),
      }).root.children[0]
    );

    //when
    formComp.props.onClick();

    //then
    assert.deepEqual(omove.times, 1);
    assert.deepEqual(omoveArgs, [5, 3]);
    assert.deepEqual(cursorShape.times, 1);
    assert.deepEqual(cursorShapeArgs, ["underline", true]);
    assert.deepEqual(showCursor.times, 1);
    assert.deepEqual(onClose.times, 1);
  });

  it("should move cursor when onResize", () => {
    //given
    let omoveArgs = /** @type {any[]} */ ([]);
    const omove = mockFunction((...args) => (omoveArgs = args));
    let cursorShapeArgs = /** @type {any[]} */ ([]);
    const cursorShape = mockFunction((...args) => (cursorShapeArgs = args));
    const showCursor = mockFunction();
    const program = { omove, showCursor };
    const cursor = { shape: "underline", blink: false };
    const screen = { program, cursor, cursorShape };
    const textEl = { screen, aleft: 1, atop: 3 };
    const props = getFileListQuickSearchProps("text");

    const formComp = /** @type {TestRenderer.ReactTestInstance} */ (
      TestRenderer.create(withThemeContext(h(FileListQuickSearch, props)), {
        createNodeMock: (el) => (el.type === "text" ? textEl : null),
      }).root.children[0]
    );
    assert.deepEqual(omove.times, 1);
    assert.deepEqual(omoveArgs, [5, 3]);

    textEl.aleft = 2;
    textEl.atop = 3;

    //when
    formComp.props.onResize();

    //then
    assert.deepEqual(omove.times, 2);
    assert.deepEqual(omoveArgs, [6, 3]);
    assert.deepEqual(cursorShape.times, 1);
    assert.deepEqual(cursorShapeArgs, ["underline", true]);
    assert.deepEqual(showCursor.times, 1);
  });

  it("should move cursor when update", () => {
    //given
    let omoveArgs = /** @type {any[]} */ ([]);
    const omove = mockFunction((...args) => (omoveArgs = args));
    let cursorShapeArgs = /** @type {any[]} */ ([]);
    const cursorShape = mockFunction((...args) => (cursorShapeArgs = args));
    const showCursor = mockFunction();
    const program = { omove, showCursor };
    const cursor = { shape: "underline", blink: false };
    const screen = { program, cursor, cursorShape };
    const textEl = { screen, aleft: 1, atop: 3 };
    const props = getFileListQuickSearchProps("text");

    const renderer = TestRenderer.create(
      withThemeContext(h(FileListQuickSearch, props)),
      {
        createNodeMock: (el) => (el.type === "text" ? textEl : null),
      },
    );
    assert.deepEqual(omove.times, 1);
    assert.deepEqual(omoveArgs, [5, 3]);

    //when
    TestRenderer.act(() => {
      renderer.update(
        withThemeContext(h(FileListQuickSearch, { ...props, text: "text2" })),
      );
    });

    //then
    assert.deepEqual(omove.times, 2);
    assert.deepEqual(omoveArgs, [6, 3]);
    assert.deepEqual(cursorShape.times, 1);
    assert.deepEqual(cursorShapeArgs, ["underline", true]);
    assert.deepEqual(showCursor.times, 1);
  });

  it("should hide cursor when unmount", () => {
    //given
    let omoveArgs = /** @type {any[]} */ ([]);
    const omove = mockFunction((...args) => (omoveArgs = args));
    let cursorShapeArgs = /** @type {any[]} */ ([]);
    const cursorShape = mockFunction((...args) => (cursorShapeArgs = args));
    const showCursor = mockFunction();
    const hideCursor = mockFunction();
    const program = { omove, showCursor, hideCursor };
    const cursor = { shape: "underline", blink: true };
    const screen = { program, cursor, cursorShape };
    const textEl = { screen, aleft: 1, atop: 3 };
    const props = getFileListQuickSearchProps("text");

    const renderer = TestRenderer.create(
      withThemeContext(h(FileListQuickSearch, props)),
      {
        createNodeMock: (el) => (el.type === "text" ? textEl : null),
      },
    );

    //when
    TestRenderer.act(() => {
      renderer.unmount();
    });

    //then
    assert.deepEqual(omove.times, 1);
    assert.deepEqual(omoveArgs, [5, 3]);
    assert.deepEqual(cursorShape.times, 0);
    assert.deepEqual(cursorShapeArgs, []);
    assert.deepEqual(showCursor.times, 1);
    assert.deepEqual(hideCursor.times, 1);
  });

  it("should render component", () => {
    //given
    let omoveArgs = /** @type {any[]} */ ([]);
    const omove = mockFunction((...args) => (omoveArgs = args));
    let cursorShapeArgs = /** @type {any[]} */ ([]);
    const cursorShape = mockFunction((...args) => (cursorShapeArgs = args));
    const showCursor = mockFunction();
    const program = { omove, showCursor };
    const cursor = { shape: "underline", blink: false };
    const screen = { program, cursor, cursorShape };
    const textEl = { screen, aleft: 1, atop: 3 };
    const props = getFileListQuickSearchProps("some quick search text");

    //when
    const result = TestRenderer.create(
      withThemeContext(h(FileListQuickSearch, props)),
      {
        createNodeMock: (el) => (el.type === "text" ? textEl : null),
      },
    ).root;

    //then
    assert.deepEqual(omove.times, 1);
    assert.deepEqual(omoveArgs, [23, 3]);
    assert.deepEqual(cursorShape.times, 1);
    assert.deepEqual(cursorShapeArgs, ["underline", true]);
    assert.deepEqual(showCursor.times, 1);
    assertFileListQuickSearch(result, props);
  });
});

/**
 * @param {string} text
 * @param {() => void} [onClose]
 * @returns {FileListQuickSearchProps}
 */
function getFileListQuickSearchProps(text, onClose = mockFunction()) {
  return {
    text,
    onClose,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {FileListQuickSearchProps} props
 */
function assertFileListQuickSearch(result, props) {
  assert.deepEqual(FileListQuickSearch.displayName, "FileListQuickSearch");

  const currTheme = FileListTheme.defaultTheme;
  const width = 25;
  const height = 3;
  const boxStyle = currTheme.popup.regular;
  const textStyle = currTheme.textBox.regular;
  const textWidth = width - 2;

  assertComponents(
    result.children,
    h(
      "form",
      {
        clickable: true,
        mouse: true,
        autoFocus: false,
        style: PopupOverlay.style,
      },
      h(
        "box",
        {
          clickable: true,
          autoFocus: false,
          width: width,
          height: height,
          top: "100%-3",
          left: 10,
          style: boxStyle,
        },
        h(doubleBorderComp, {
          width,
          height,
          style: boxStyle,
          title: "Search",
        }),
        h("text", {
          width: textWidth,
          height: 1,
          top: 1,
          left: 1,
          style: textStyle,
          content: props.text.slice(0, Math.min(textWidth, props.text.length)),
        }),
      ),
    ),
  );
}
