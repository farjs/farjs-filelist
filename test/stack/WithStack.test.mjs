/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("../../src/stack/WithStack.mjs").WithStackProps} WithStackProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import {
  assertComponents,
  mockComponent,
  TestErrorBoundary,
} from "react-assert";
import WithSize from "@farjs/ui/WithSize.mjs";
import PanelStackItem from "../../src/stack/PanelStackItem.mjs";
import PanelStack from "../../src/stack/PanelStack.mjs";
import WithStack from "../../src/stack/WithStack.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const OtherComponent = () => {
  return null;
};

WithStack.withSizeComp = mockComponent(WithSize);
const { withSizeComp } = WithStack;

describe("WithStack.test.mjs", () => {
  it("should fail if no context when useStack", () => {
    //given
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction();
    console.error = consoleErrorMock;

    const Wrapper = () => {
      WithStack.useStack();
      return h(React.Fragment);
    };

    //when
    const result = TestRenderer.create(
      h(TestErrorBoundary, null, h(Wrapper))
    ).root;

    //then
    console.error = savedConsoleError;
    assert.deepEqual(consoleErrorMock.times, 1);
    assertComponents(
      result.children,
      h(
        "div",
        null,
        "Error: WithStack.Context is not found." +
          "\nPlease, make sure you use WithStack.Context.Provider in parent component."
      )
    );
  });

  it("should render top component", () => {
    //given
    const [stackCtx, stackComp] = getStackCtxHook();
    const top = new PanelStackItem(stackComp);
    const other = new PanelStackItem(OtherComponent);
    const stack = new PanelStack(false, [top, other], mockFunction());
    const props = {
      isRight: true,
      panelInput: /** @type {BlessedElement} */ ({}),
      stack,
      width: 0,
      height: 0,
    };
    const width = 25;
    const height = 15;

    //when
    const comp = TestRenderer.create(h(WithStack, props)).root;
    const withSizeProps = comp.findByType(withSizeComp).props;
    const result = TestRenderer.create(
      withSizeProps.render(width, height)
    ).root;

    //then
    assert.deepEqual(WithStack.displayName, "WithStack");
    assert.deepEqual(stackCtx.current, { ...props, width, height });
    assert.deepEqual(result.type, stackComp);
  });
});

/**
 * @returns {[React.MutableRefObject<WithStackProps | null>, () => React.ReactElement]}
 */
function getStackCtxHook() {
  /** @type {React.MutableRefObject<WithStackProps | null>} */
  const ref = React.createRef();
  const comp = () => {
    const ctx = WithStack.useStack();
    ref.current = ctx;
    return h(React.Fragment, null);
  };

  return [ref, comp];
}
