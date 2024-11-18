import React from "react";
import TestRenderer from "react-test-renderer";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import { assertComponents, TestErrorBoundary } from "react-assert";
import HistoryProvider from "../../src/history/HistoryProvider.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

describe("HistoryProvider.test.mjs", () => {
  it("should fail if no HistoryProvider.Context when useHistoryProvider", () => {
    //given
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction(() => {
      console.error = savedConsoleError;
    });
    console.error = consoleErrorMock;

    const TestComp = () => {
      HistoryProvider.useHistoryProvider();
      return null;
    };
    const comp = h(TestComp, null, h(React.Fragment));

    //when
    const result = TestRenderer.create(h(TestErrorBoundary, null, comp)).root;

    //then
    assert.deepEqual(consoleErrorMock.times, 1);
    assert.deepEqual(console.error, savedConsoleError);
    assertComponents(
      result.children,
      h(
        "div",
        null,
        "Error: HistoryProvider.Context is not found." +
          "\nPlease, make sure you use HistoryProvider.Context.Provider in parent component."
      )
    );
  });

  it("should return HistoryProvider when useHistoryProvider", () => {
    //given
    const HistoryProviderMock = /** @type {HistoryProvider} */ ({});
    let capturedProvider = null;
    const TestComp = () => {
      capturedProvider = HistoryProvider.useHistoryProvider();
      return null;
    };

    //when
    const result = TestRenderer.create(
      h(
        HistoryProvider.Context.Provider,
        { value: HistoryProviderMock },
        h(TestComp, null)
      )
    ).root;

    //then
    assert.deepEqual(result.type, TestComp);
    assert.deepEqual(capturedProvider === HistoryProviderMock, true);
  });
});
