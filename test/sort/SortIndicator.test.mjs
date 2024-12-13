/**
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg} IKeyEventArg
 * @typedef {import("../../src/sort/FileListSort.mjs").FileListSort} FileListSort
 * @typedef {import("../../src/sort/SortIndicator.mjs").SortIndicatorProps} SortIndicatorProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import FileListTheme from "../../src/theme/FileListTheme.mjs";
import withThemeContext from "../../src/theme/withThemeContext.mjs";
import withStackContext from "../../src/stack/withStackContext.mjs";
import PanelStack from "../../src/stack/PanelStack.mjs";
import SortMode from "../../src/sort/SortMode.mjs";
import FileListSort from "../../src/sort/FileListSort.mjs";
import SortIndicator from "../../src/sort/SortIndicator.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("SortIndicator.test.mjs", () => {
  it("should emit keypress event when onClick in Left panel", () => {
    //given
    let capturedKey = null;
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        capturedKey = key;
      }
    );
    process.stdin.on("keypress", keyListener);

    const isRight = false;
    const stack = new PanelStack(true, [], mockFunction());
    const props = getSortIndicatorProps(FileListSort(SortMode.Name, true));
    const textElem = TestRenderer.create(
      withStackContext(withThemeContext(h(SortIndicator, props)), {
        isRight,
        stack,
      })
    ).root.findByType("text");

    //when
    textElem.props.onClick();

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(capturedKey, {
      name: "l",
      ctrl: false,
      meta: true,
      shift: false,
    });
  });

  it("should emit keypress event when onClick in Right panel", () => {
    //given
    let capturedKey = null;
    const keyListener = mockFunction(
      /** @type {(ch: object, key: IKeyEventArg) => void} */
      (_, key) => {
        capturedKey = key;
      }
    );
    process.stdin.on("keypress", keyListener);

    const isRight = true;
    const stack = new PanelStack(true, [], mockFunction());
    const props = getSortIndicatorProps(FileListSort(SortMode.Name, true));
    const textElem = TestRenderer.create(
      withStackContext(withThemeContext(h(SortIndicator, props)), {
        isRight,
        stack,
      })
    ).root.findByType("text");

    //when
    textElem.props.onClick();

    //cleanup
    process.stdin.removeListener("keypress", keyListener);

    //then
    assert.deepEqual(capturedKey, {
      name: "r",
      ctrl: false,
      meta: true,
      shift: false,
    });
  });

  it("should render component", () => {
    //given
    const stack = new PanelStack(true, [], mockFunction());
    const props = getSortIndicatorProps(FileListSort(SortMode.Name, true));

    //when
    const result = TestRenderer.create(
      withStackContext(withThemeContext(h(SortIndicator, props)), { stack })
    ).root;

    //then
    assertSortIndicator(result);
  });

  it("should return indicator symbol when _getIndicator", () => {
    //given
    const { _getIndicator: ind } = SortIndicator;

    //when & then
    assert.deepEqual(ind(FileListSort(SortMode.Name, true)), "n");
    assert.deepEqual(ind(FileListSort(SortMode.Name, false)), "N");
    assert.deepEqual(ind(FileListSort(SortMode.Extension, true)), "x");
    assert.deepEqual(ind(FileListSort(SortMode.Extension, false)), "X");
    assert.deepEqual(ind(FileListSort(SortMode.ModificationTime, true)), "m");
    assert.deepEqual(ind(FileListSort(SortMode.ModificationTime, false)), "M");
    assert.deepEqual(ind(FileListSort(SortMode.Size, true)), "s");
    assert.deepEqual(ind(FileListSort(SortMode.Size, false)), "S");
    assert.deepEqual(ind(FileListSort(SortMode.Unsorted, true)), "u");
    assert.deepEqual(ind(FileListSort(SortMode.Unsorted, false)), "U");
    assert.deepEqual(ind(FileListSort(SortMode.CreationTime, true)), "c");
    assert.deepEqual(ind(FileListSort(SortMode.CreationTime, false)), "C");
    assert.deepEqual(ind(FileListSort(SortMode.AccessTime, true)), "a");
    assert.deepEqual(ind(FileListSort(SortMode.AccessTime, false)), "A");
  });
});

/**
 * @param {FileListSort} sort
 * @returns {SortIndicatorProps}
 */
function getSortIndicatorProps(sort) {
  return {
    sort,
  };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 */
function assertSortIndicator(result) {
  assert.deepEqual(SortIndicator.displayName, "SortIndicator");
  const currTheme = FileListTheme.defaultTheme;

  assertComponents(
    result.children,
    h("text", {
      width: 2,
      height: 1,
      left: 1,
      top: 1,
      autoFocus: false,
      clickable: true,
      mouse: true,
      style: currTheme.fileList.header,
      content: "n ",
    })
  );
}
