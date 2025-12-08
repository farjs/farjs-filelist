export default WithStacksData;
export type WithStacksData = {
    readonly stack: PanelStack;
    readonly input: BlessedElement;
};
export type BlessedElement = import("@farjs/blessed").Widgets.BlessedElement;
/**
 * @typedef {{
 *  readonly stack: PanelStack;
 *  readonly input: BlessedElement;
 * }} WithStacksData
 */
/**
 * @param {PanelStack} stack
 * @param {BlessedElement} [input]
 * @returns {WithStacksData}
 */
declare function WithStacksData(stack: PanelStack, input?: BlessedElement): WithStacksData;
import PanelStack from "./PanelStack.mjs";
//# sourceMappingURL=WithStacksData.d.mts.map