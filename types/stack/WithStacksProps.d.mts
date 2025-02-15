export default WithStacksProps;
export type WithStacksData = import("./WithStacksData.mjs").WithStacksData;
export type WithStacksProps = {
    readonly left: WithStacksData;
    readonly right: WithStacksData;
};
/**
 * @typedef {import("./WithStacksData.mjs").WithStacksData} WithStacksData
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
