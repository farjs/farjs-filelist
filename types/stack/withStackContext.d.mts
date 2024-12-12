export default withStackContext;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type WithStackProps = import("./WithStack.mjs").WithStackProps;
/**
 * Common test util.
 *
 * @param {React.ReactElement<any>} element
 * @param {Partial<WithStackProps>} props
 * @returns {React.ReactElement<any>}
 */
declare function withStackContext(element: React.ReactElement<any>, props?: Partial<WithStackProps>): React.ReactElement<any>;
import React from "react";
