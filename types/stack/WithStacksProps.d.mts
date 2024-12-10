export default WithStacksProps;
export type WithStacksData = {
    readonly stack: PanelStack;
    readonly input: BlessedElement;
};
export type WithStacksProps = {
    readonly left: WithStacksData;
    readonly right: WithStacksData;
};
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
/**
 * @typedef {{
 *  readonly stack: PanelStack;
 *  readonly input: BlessedElement;
 * }} WithStacksData
 */
/**
 * @typedef {{
 *  readonly left: WithStacksData;
 *  readonly right: WithStacksData;
 * }} WithStacksProps
 */
/**
 * @param {WithStacksData} left
 * @param {WithStacksData} right
 * @returns {WithStacksProps}
 */
declare function WithStacksProps(left: WithStacksData, right: WithStacksData): WithStacksProps;
declare namespace WithStacksProps {
    /**
     * @param {WithStacksProps} stacks
     * @returns {WithStacksData}
     */
    function active(stacks: WithStacksProps): WithStacksData;
    /**
     * @param {WithStacksProps} stacks
     * @returns {WithStacksData}
     */
    function nonActive(stacks: WithStacksProps): WithStacksData;
}
import PanelStack from "./PanelStack.mjs";
