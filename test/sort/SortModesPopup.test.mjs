/**
 * @typedef {import("../../src/sort/FileListSort.mjs").FileListSort} FileListSort
 * @typedef {import("../../src/sort/SortModesPopup.mjs").SortModesPopupProps} SortModesPopupProps
 */
import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import { assertComponents, mockComponent } from "react-assert";
import mockFunction from "mock-fn";
import MenuPopup from "@farjs/ui/menu/MenuPopup.mjs";
import PanelStack from "../../src/stack/PanelStack.mjs";
import withStackContext from "../../src/stack/withStackContext.mjs";
import SortMode from "../../src/sort/SortMode.mjs";
import FileListSort from "../../src/sort/FileListSort.mjs";
import SortModesPopup from "../../src/sort/SortModesPopup.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

SortModesPopup.menuPopup = mockComponent(MenuPopup);

const { menuPopup } = SortModesPopup;

describe("SortModesPopup.test.mjs", () => {
  it("should emit keypress event and call onClose when onSelect", () => {
    //given
    const stack = new PanelStack(true, [], mockFunction());
    const onClose = mockFunction();
    let emitArgs = /** @type {any[]} */ ([]);
    const emitMock = mockFunction((...args) => {
      emitArgs = args;
    });
    const inputMock = { emit: emitMock };
    const props = getSortModesPopupProps(
      FileListSort(SortMode.Name, true),
      onClose
    );
    const comp = TestRenderer.create(
      withStackContext(h(SortModesPopup, props), {
        stack,
        width: 40,
        panelInput: /** @type {any} */ (inputMock),
      })
    ).root;
    const menuProps = comp.findByType(menuPopup).props;

    //when
    menuProps.onSelect(0);

    //then
    assert.deepEqual(onClose.times, 1);
    assert.deepEqual(emitArgs, [
      "keypress",
      undefined,
      {
        name: "f3+ctrl",
        full: "C-f3",
        ctrl: true,
      },
    ]);
  });

  it("should call onClose when onClose", () => {
    //given
    const stack = new PanelStack(true, [], mockFunction());
    const onClose = mockFunction();
    const props = getSortModesPopupProps(
      FileListSort(SortMode.Name, true),
      onClose
    );
    const comp = TestRenderer.create(
      withStackContext(h(SortModesPopup, props), { stack, width: 40 })
    ).root;
    const menuProps = comp.findByType(menuPopup).props;

    //when
    menuProps.onClose();

    //then
    assert.deepEqual(onClose.times, 1);
  });

  it("should render popup on left panel", () => {
    //given
    const isRight = false;
    const stack = new PanelStack(true, [], mockFunction());
    const width = 40;
    const props = getSortModesPopupProps(
      FileListSort(SortMode.Extension, true)
    );

    //when
    const result = TestRenderer.create(
      withStackContext(h(SortModesPopup, props), { isRight, stack, width })
    ).root;

    //then
    assertSortModesPopup(result, props, isRight, width);
  });

  it("should render popup on right panel", () => {
    //given
    const isRight = true;
    const stack = new PanelStack(true, [], mockFunction());
    const width = 40;
    const props = getSortModesPopupProps(
      FileListSort(SortMode.Extension, false)
    );

    //when
    const result = TestRenderer.create(
      withStackContext(h(SortModesPopup, props), { isRight, stack, width })
    ).root;

    //then
    assertSortModesPopup(result, props, isRight, width);
  });
});

/**
 * @param {FileListSort} sort
 * @param {() => void} onClose
 * @returns {SortModesPopupProps}
 */
function getSortModesPopupProps(sort, onClose = mockFunction()) {
  return { sort, onClose };
}

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {SortModesPopupProps} props
 * @param {boolean} isRight
 * @param {number} stackWidth
 */
function assertSortModesPopup(result, props, isRight, stackWidth) {
  assert.deepEqual(SortModesPopup.displayName, "SortModesPopup");

  const menuProps = result.findByType(menuPopup).props;
  assert.deepEqual(
    menuProps.getLeft(50),
    MenuPopup.getLeftPos(stackWidth, !isRight, 50)
  );
  const indicator = props.sort.asc ? "+" : "-";

  assertComponents(
    result.children,
    h(menuPopup, {
      title: "Sort by",
      items: [
        "  Name                 Ctrl-F3  ",
        `${indicator} Extension            Ctrl-F4  `,
        "  Modification time    Ctrl-F5  ",
        "  Size                 Ctrl-F6  ",
        "  Unsorted             Ctrl-F7  ",
        "  Creation time        Ctrl-F8  ",
        "  Access time          Ctrl-F9  ",
      ],
      getLeft: menuProps.getLeft,
      onSelect: mockFunction(),
      onClose: mockFunction(),
    })
  );
}
