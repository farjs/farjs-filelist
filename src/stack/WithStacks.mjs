/**
 * @typedef {import("./WithStacksProps.mjs").WithStacksProps} WithStacksProps
 */
import React, { useContext } from "react";
import WithStacksProps from "./WithStacksProps.mjs";

const h = React.createElement;

/**
 * @param {React.PropsWithChildren<WithStacksProps>} props
 */
const WithStacks = (props) => {
  return h(
    WithStacks.Context.Provider,
    {
      value: WithStacksProps(props.left, props.right),
    },
    props.children
  );
};

WithStacks.displayName = "WithStacks";

WithStacks.Context = React.createContext(
  /** @type {WithStacksProps | null} */ (null)
);
/**
 * @type {() => WithStacksProps}
 */
WithStacks.useStacks = () => {
  const ctx = useContext(WithStacks.Context);
  if (!ctx) {
    throw Error(
      "WithStacks.Context is not found." +
        "\nPlease, make sure you use WithStacks.Context.Provider in parent component."
    );
  }
  return ctx;
};

export default WithStacks;
