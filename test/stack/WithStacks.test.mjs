/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("../../src/stack/WithStacksProps.mjs").WithStacksProps} WithStacksProps
 */
import React from "react";
import assert from "node:assert/strict";
import mockFunction from "mock-fn";
import TestRenderer from "react-test-renderer";
import { assertComponents, TestErrorBoundary } from "react-assert";
import PanelStack from "../../src/stack/PanelStack.mjs";
import WithStacksProps from "../../src/stack/WithStacksProps.mjs";
import WithStacks from "../../src/stack/WithStacks.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

const props = WithStacksProps(
  {
    stack: new PanelStack(true, [], mockFunction()),
    input: /** @type {BlessedElement} */ ({}),
  },
  {
    stack: new PanelStack(false, [], mockFunction()),
    input: /** @type {BlessedElement} */ ({}),
  }
);

describe("WithStacks.test.mjs", () => {
  it("should fail if no context when useStacks", () => {
    //given
    // suppress intended error
    // see: https://github.com/facebook/react/issues/11098#issuecomment-412682721
    const savedConsoleError = console.error;
    const consoleErrorMock = mockFunction();
    console.error = consoleErrorMock;

    const Wrapper = () => {
      WithStacks.useStacks();
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
        "Error: WithStacks.Context is not found." +
          "\nPlease, make sure you use WithStacks.Context.Provider in parent component."
      )
    );
  });

  it("should render component with context provider", () => {
    //given
    const [stacksCtx, stacksComp] = getStacksCtxHook();

    //when
    const result = TestRenderer.create(
      h(
        WithStacks,
        props,
        h(stacksComp, null),
        h(React.Fragment, null, "some other content")
      )
    ).root;

    //then
    assert.deepEqual(WithStacks.displayName, "WithStacks");
    assert.deepEqual(stacksCtx.current, props);
    assert.deepEqual(result.children.length, 2);
    const [resCtxHook, otherContent] = result.children.map(
      (_) => /** @type {TestRenderer.ReactTestInstance} */ (_)
    );
    assert.deepEqual(resCtxHook.type, stacksComp);
    assert.deepEqual(otherContent, "some other content");
  });

  it("should return active stack when WithStacksProps.active()", () => {
    //given
    const { left, right } = props;

    //when & then
    assert.deepEqual(WithStacksProps.active(props), props.left);
    assert.deepEqual(
      WithStacksProps.active({ left: right, right: left }),
      props.left
    );
  });

  it("should return non-active stack when WithStacksProps.nonActive()", () => {
    //given
    const { left, right } = props;

    //when & then
    assert.deepEqual(WithStacksProps.nonActive(props), props.right);
    assert.deepEqual(
      WithStacksProps.nonActive({ left: right, right: left }),
      props.right
    );
  });
});

/**
 * @returns {[React.MutableRefObject<WithStacksProps | null>, () => React.ReactElement]}
 */
function getStacksCtxHook() {
  /** @type {React.MutableRefObject<WithStacksProps | null>} */
  const ref = React.createRef();
  const comp = () => {
    const ctx = WithStacks.useStacks();
    ref.current = ctx;
    return h(React.Fragment, null);
  };

  return [ref, comp];
}
