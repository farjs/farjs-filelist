/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 */
import React, { useContext } from "react";
import WithSize from "@farjs/ui/WithSize.mjs";
import PanelStack from "./PanelStack.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly isRight: boolean;
 *  readonly panelInput: BlessedElement;
 *  readonly stack: PanelStack;
 *  readonly width: number;
 *  readonly height: number;
 * }} WithStackProps
 */

/**
 * @param {WithStackProps} props
 */
const WithStack = (props) => {
  const topComp = props.stack.peek().component;

  return h(WithStack.withSizeComp, {
    render: (width, height) => {
      return h(
        WithStack.Context.Provider,
        {
          value: { ...props, width, height },
        },
        h(topComp)
      );
    },
  });
};

WithStack.displayName = "WithStack";
WithStack.withSizeComp = WithSize;

WithStack.Context = React.createContext(
  /** @type {WithStackProps | null} */ (null)
);
/**
 * @type {() => WithStackProps}
 */
WithStack.useStack = () => {
  const ctx = useContext(WithStack.Context);
  if (!ctx) {
    throw Error(
      "WithStack.Context is not found." +
        "\nPlease, make sure you use WithStack.Context.Provider in parent component."
    );
  }
  return ctx;
};

export default WithStack;
