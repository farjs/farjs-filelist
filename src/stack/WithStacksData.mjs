/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 */
import PanelStack from "./PanelStack.mjs";

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
function WithStacksData(stack, input) {
  return { stack, input: input ?? /** @type {BlessedElement} */ ({}) };
}

export default WithStacksData;
