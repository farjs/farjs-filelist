import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import FileListTheme from "../../src/theme/FileListTheme.mjs";
import withThemeContext from "./withThemeContext.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("FileListTheme.test.mjs", () => {
  it("should return FileListTheme when useTheme", () => {
    //given
    let capturedTheme = undefined;
    const onTheme = mockFunction((theme) => {
      capturedTheme = theme;
    });
    const Wrapper = () => {
      onTheme(FileListTheme.useTheme());
      return null;
    };

    //when
    TestRenderer.create(withThemeContext(h(Wrapper)));

    //then
    assert.deepEqual(onTheme.times, 1);
    assert.deepEqual(capturedTheme == FileListTheme.defaultTheme, true);
  });
});
