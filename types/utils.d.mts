/**
 * @template {any} T
 * @param {Set<T>} a
 * @param {Set<T>} b
 * @returns {boolean}
 */
export function isEqualSets<T extends unknown>(a: Set<T>, b: Set<T>): boolean;
/**
 * @param {string} s
 * @param {string} prefix
 * @returns {string}
 */
export function stripPrefix(s: string, prefix: string): string;
