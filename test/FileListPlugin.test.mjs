import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import PanelStack from "../src/stack/PanelStack.mjs";
import WithStacksData from "../src/stack/WithStacksData.mjs";
import WithStacksProps from "../src/stack/WithStacksProps.mjs";
import FileListPlugin from "../src/FileListPlugin.mjs";

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const stacksProps = WithStacksProps(
  WithStacksData(new PanelStack(true, [], mockFunction())),
  WithStacksData(new PanelStack(false, [], mockFunction()))
);

describe("FileListPlugin.test.mjs", () => {
  it("should return passed keys when triggerKeys", () => {
    //given
    const triggerKeys = ["f1", "f2"];
    const plugin = new FileListPlugin(triggerKeys);

    //when
    const result = plugin.triggerKeys;

    //then
    assert.deepEqual(result === triggerKeys, true);
  });

  it("should return Promise.resolve(undefined) when onKeyTrigger", async () => {
    //given
    const plugin = new FileListPlugin([]);

    //when
    const result = await plugin.onKeyTrigger("f1", stacksProps);

    //then
    assert.deepEqual(result === undefined, true);
  });

  it("should return Promise.resolve(undefined) when onFileTrigger", async () => {
    //given
    const plugin = new FileListPlugin([]);

    //when
    const result = await plugin.onFileTrigger(
      "/test/path",
      new Uint8Array(),
      mockFunction
    );

    //then
    assert.deepEqual(result === undefined, true);
  });
});
