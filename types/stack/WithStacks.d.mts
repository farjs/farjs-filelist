export default WithStacks;
export type WithStacksProps = import("./WithStacksProps.mjs").WithStacksProps;
/**
 * @param {React.PropsWithChildren<WithStacksProps>} props
 */
declare function WithStacks(props: React.PropsWithChildren<WithStacksProps>): React.FunctionComponentElement<React.ProviderProps<import("./WithStacksProps.mjs").WithStacksProps | null>>;
declare namespace WithStacks {
    let displayName: string;
    let Context: React.Context<import("./WithStacksProps.mjs").WithStacksProps | null>;
    function useStacks(): WithStacksProps;
}
import React from "react";
