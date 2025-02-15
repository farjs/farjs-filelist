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
declare function WithStack(props: WithStackProps): React.FunctionComponentElement<{
    render: (width: number, height: number) => React.FunctionComponentElement<React.ProviderProps<WithStackProps | null>>;
}>;
declare namespace WithStack {
    export let displayName: string;
    export { WithSize as withSizeComp };
    export let Context: React.Context<WithStackProps | null>;
    export function useStack(): WithStackProps;
}
import PanelStack from "./PanelStack.mjs";
import React from "react";
import WithSize from "@farjs/ui/WithSize.mjs";
