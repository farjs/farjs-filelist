import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import MockFileListApi from "../../src/api/MockFileListApi.mjs";
import FileListState from "../../src/FileListState.mjs";
import FileListActions from "../../src/FileListActions.mjs";
import PanelStackItem from "../../src/stack/PanelStackItem.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const Component = () => {
  return null;
};
const dispatch = () => {};
const actions = new FileListActions(new MockFileListApi());
const state = FileListState();

describe("PanelStackItem.test.mjs", () => {
  it("should create new item with component only", () => {
    //when
    const result = new PanelStackItem(Component);

    //then
    assert.deepEqual(result.component == Component, true);
    assert.deepEqual(result.dispatch, undefined);
    assert.deepEqual(result.actions, undefined);
    assert.deepEqual(result.state, undefined);
  });

  it("should create new item with all data", () => {
    //when
    const result = new PanelStackItem(Component, dispatch, actions, state);

    //then
    assert.deepEqual(result.component == Component, true);
    assert.deepEqual(result.dispatch == dispatch, true);
    assert.deepEqual(result.actions == actions, true);
    assert.deepEqual(result.state == state, true);
  });

  it("should return new item with updated state when withState", () => {
    //given
    const item = new PanelStackItem(Component, dispatch, actions);
    assert.deepEqual(item.state, undefined);

    //when
    const result = item.withState(state);

    //then
    assert.deepEqual(item.state, undefined);
    assert.deepEqual(result !== item, true);
    assert.deepEqual(result.dispatch == dispatch, true);
    assert.deepEqual(result.actions == actions, true);
    assert.deepEqual(result.state == state, true);
  });

  it("should return new item with undefined state when updateState", () => {
    //given
    const onState = mockFunction();
    const item = new PanelStackItem(Component, dispatch, actions);
    assert.deepEqual(item.state, undefined);

    //when
    const result = item.updateState(onState);

    //then
    assert.deepEqual(onState.times, 0);
    assert.deepEqual(item.state, undefined);
    assert.deepEqual(result !== item, true);
    assert.deepEqual(result.dispatch == dispatch, true);
    assert.deepEqual(result.actions == actions, true);
    assert.deepEqual(result.state, undefined);
  });

  it("should return new item with updated state when updateState", () => {
    //given
    const item = new PanelStackItem(Component, dispatch, actions, state);
    const newState = FileListState();
    let capturedState = null;
    const onState = mockFunction((s) => {
      capturedState = s;
      return newState;
    });

    //when
    const result = item.updateState(onState);

    //then
    assert.deepEqual(onState.times, 1);
    assert.deepEqual(capturedState == state, true);
    assert.deepEqual(item.state == state, true);
    assert.deepEqual(result !== item, true);
    assert.deepEqual(result.dispatch == dispatch, true);
    assert.deepEqual(result.actions == actions, true);
    assert.deepEqual(result.state == newState, true);
  });

  it("should return undefined when getData", () => {
    //when & then
    assert.deepEqual(new PanelStackItem(Component).getData(), undefined);
    assert.deepEqual(
      new PanelStackItem(Component, undefined, actions, state).getData(),
      undefined
    );
    assert.deepEqual(
      new PanelStackItem(Component, dispatch, undefined, state).getData(),
      undefined
    );
    assert.deepEqual(
      new PanelStackItem(Component, dispatch, actions, undefined).getData(),
      undefined
    );
    assert.deepEqual(
      new PanelStackItem(Component, dispatch, actions, {}).getData(),
      undefined
    );
  });

  it("should return FileListData if FileListState when getData", () => {
    //given
    const item = new PanelStackItem(Component, dispatch, actions, state);

    //when
    const result = item.getData();

    //then
    assert.deepEqual(result, { dispatch, actions, state });
  });
});
