/**
 * @typedef {import("./WithStacksProps.mjs").WithStacksProps} WithStacksProps
 */
import React from "react";
import WithStacks from "./WithStacks.mjs";

const h = React.createElement;

/**
 * Common test util.
 *
 * @param {React.ReactElement<any>} element
 * @param {WithStacksProps} props
 * @returns {React.ReactElement<any>}
 */
const withStacksContext = (element, props) => {
  return h(
    WithStacks.Context.Provider,
    {
      value: props,
    },
    element
  );
};

export default withStacksContext;
