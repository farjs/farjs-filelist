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
function WithStacksProps(left, right) {
  return { left, right };
}

/**
 * @param {WithStacksProps} stacks
 * @returns {WithStacksData}
 */
WithStacksProps.active = (stacks) => {
  return stacks.left.stack.isActive ? stacks.left : stacks.right;
};

/**
 * @param {WithStacksProps} stacks
 * @returns {WithStacksData}
 */
WithStacksProps.nonActive = (stacks) => {
  return !stacks.left.stack.isActive ? stacks.left : stacks.right;
};

export default WithStacksProps;
