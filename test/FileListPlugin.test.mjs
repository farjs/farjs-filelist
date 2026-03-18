import { deepEqual } from "node:assert/strict";
import mockFunction from "mock-fn";
import PanelStack from "../src/stack/PanelStack.mjs";
import WithStacksData from "../src/stack/WithStacksData.mjs";
import WithStacksProps from "../src/stack/WithStacksProps.mjs";
import FileListPluginLoader from "../src/FileListPluginLoader.mjs";

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
  WithStacksData(new PanelStack(false, [], mockFunction())),
);

const plugin = FileListPluginLoader(["f1", "f2"], async () => {
  const module = "./TestFileListPlugin.mjs";
  return (await import(module)).default;
});

describe("FileListPlugin.test.mjs", () => {
  it("should return passed keys when triggerKeys", () => {
    //when & then
    deepEqual(plugin.triggerKeys, ["f1", "f2"]);
  });

  it("should return Promise.resolve(undefined) when onKeyTrigger", async () => {
    //when
    const result = await plugin.onKeyTrigger("f1", stacksProps);

    //then
    deepEqual(result === undefined, true);
  });

  it("should return Promise.resolve(undefined) when onFileTrigger", async () => {
    //when
    const result = await plugin.onFileTrigger(
      "/test/path",
      new Uint8Array(),
      mockFunction,
    );

    //then
    deepEqual(result === undefined, true);
  });
});
