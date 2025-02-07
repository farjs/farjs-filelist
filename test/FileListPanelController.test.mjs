/**
 * @typedef {import("../src/FileListData.mjs").ReactComponent} ReactComponent
 * @typedef {import("../src/FileListData.mjs").FileListData} FileListData
 * @typedef {import("../src/FileListPanel.mjs").FileListPanelProps} FileListPanelProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents } from "react-assert";
import withStackContext from "../src/stack/withStackContext.mjs";
import PanelStack from "../src/stack/PanelStack.mjs";
import PanelStackItem from "../src/stack/PanelStackItem.mjs";
import FileListData from "../src/FileListData.mjs";
import FileListState from "../src/FileListState.mjs";
import MockFileListActions from "../src/MockFileListActions.mjs";
import FileListPanelController from "../src/FileListPanelController.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListPanelController.test.mjs", () => {
  it("should render component", () => {
    //given
    const dispatch = mockFunction();
    const actions = new MockFileListActions();
    const state = FileListState();
    const data = FileListData(dispatch, actions, state);
    const fileListPanelComp = () => null;
    const controller = FileListPanelController(fileListPanelComp);
    const fsPanelComp = () => null;
    const stack = new PanelStack(
      true,
      [new PanelStackItem(fsPanelComp, dispatch, actions, state)],
      mockFunction()
    );

    //when
    const result = TestRenderer.create(
      withStackContext(h(controller, null), { stack })
    ).root;

    //then
    assertFileListPanelController(result, data, controller, fileListPanelComp);
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {FileListData} data
 * @param {ReactComponent} controller
 * @param {React.FunctionComponent<FileListPanelProps>
 *  | React.ComponentClass<FileListPanelProps>} fileListPanelComp
 */
function assertFileListPanelController(
  result,
  data,
  controller,
  fileListPanelComp
) {
  assert.deepEqual(controller.displayName, "FileListPanelController");

  assertComponents(result.children, h(fileListPanelComp, data));
}
