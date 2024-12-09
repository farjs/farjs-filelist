export default WithStack;
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
export type WithStackProps = {
    readonly isRight: boolean;
    readonly panelInput: BlessedElement;
    readonly stack: PanelStack;
    readonly width: number;
    readonly height: number;
};
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
declare function WithStack(props: WithStackProps): React.FunctionComponentElement<import("@farjs/ui/WithSize.mjs").WithSizeProps>;
declare namespace WithStack {
    export const displayName: string;
    export { WithSize as withSizeComp };
    export const Context: React.Context<WithStackProps | null>;
    export function useStack(): WithStackProps;
}
import PanelStack from "./PanelStack.mjs";
import React from "react";
import WithSize from "@farjs/ui/WithSize.mjs";
