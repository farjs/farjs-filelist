/**
 * @template {any} T
 * @param {Set<T>} a
 * @param {Set<T>} b
 * @returns {boolean}
 */
export function isEqualSets(a, b) {
  if (a === b) return true;
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
}

/**
 * @param {string} s
 * @param {string} prefix
 * @returns {string}
 */
export function stripPrefix(s, prefix) {
  return prefix.length > 0 && s.startsWith(prefix)
    ? s.substring(prefix.length)
    : s;
}

/**
 * @param {number} size
 * @returns {string}
 */
export function formatSize(size) {
  return sizeFormatter.format(size);
}

/**
 * @template T
 * @param {() => T} fn
 * @return {() => T}
 */
export function lazyFn(fn) {
  function lazyFunc() {
    if (!lazyFunc._value) {
      lazyFunc._value = fn();
    }

    return lazyFunc._value;
  }
  /** @type {T | undefined} */
  lazyFunc._value = undefined;

  return lazyFunc;
}

const sizeFormatter = new Intl.NumberFormat("en-EN", {
  maximumFractionDigits: 0,
});
