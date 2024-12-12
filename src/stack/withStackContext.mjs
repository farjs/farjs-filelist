/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("./WithStack.mjs").WithStackProps} WithStackProps
 */
import React from "react";
import WithStack from "./WithStack.mjs";
import PanelStack from "./PanelStack.mjs";
import PanelStackItem from "./PanelStackItem.mjs";

const h = React.createElement;

const TestStubComponent = () => h("test stub");

/**
 * Common test util.
 *
 * @param {React.ReactElement<any>} element
 * @param {Partial<WithStackProps>} props
 * @returns {React.ReactElement<any>}
 */
const withStackContext = (element, props = {}) => {
  return h(
    WithStack.Context.Provider,
    {
      value: {
        isRight: false,
        panelInput: /** @type {BlessedElement} */ ({}),
        stack: new PanelStack(
          false,
          [new PanelStackItem(TestStubComponent)],
          () => {}
        ),
        width: 0,
        height: 0,
        ...props,
      },
    },
    element
  );
};

export default withStackContext;
