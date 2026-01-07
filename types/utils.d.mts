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
/**
 * @param {string} s
 * @param {string} suffix
 * @returns {string}
 */
export function stripSuffix(s: string, suffix: string): string;
/**
 * @param {number} size
 * @returns {string}
 */
export function formatSize(size: number): string;
/**
 * @template T
 * @param {() => T} fn
 * @return {() => T}
 */
export function lazyFn<T>(fn: () => T): () => T;
export function voidFn(): void;
/**
 * @template T
 * @typedef {{
 *  readonly p: Promise<T>;
 *  readonly resolve: (value: T | PromiseLike<T>) => void;
 *  readonly reject: (reason?: any) => void;
 * }} PromiseWithResolvers
 */
/**
 * @template T
 * @returns {PromiseWithResolvers<T>}
 */
export function newPromiseWithResolvers<T>(): PromiseWithResolvers<T>;
export type PromiseWithResolvers<T> = {
    readonly p: Promise<T>;
    readonly resolve: (value: T | PromiseLike<T>) => void;
    readonly reject: (reason?: any) => void;
};
//# sourceMappingURL=utils.d.mts.map