export default PanelStack;
export type ReactComponent = import("../FileListData.mjs").ReactComponent;
declare class PanelStack {
    /**
     * @param {boolean} isActive
     * @param {readonly PanelStackItem<any>[]} data
     * @param {(f: (data: readonly PanelStackItem<any>[]) => readonly PanelStackItem<any>[]) => void} updater
     */
    constructor(isActive: boolean, data: readonly PanelStackItem<any>[], updater: (f: (data: readonly PanelStackItem<any>[]) => readonly PanelStackItem<any>[]) => void);
    /** @readonly @type {boolean} */
    readonly isActive: boolean;
    /** @private @readonly @type {readonly PanelStackItem<any>[]} */
    private readonly _data;
    /** @private @readonly @type {(f: (data: readonly PanelStackItem<any>[]) => readonly PanelStackItem<any>[]) => void} */
    private readonly _updater;
    /**
     * @param {PanelStackItem<any>} item
     * @returns {void}
     */
    push(item: PanelStackItem<any>): void;
    /**
     * @template T
     * @param {(data: PanelStackItem<T>) => PanelStackItem<T>} f
     * @returns {void}
     */
    update<T>(f: (data: PanelStackItem<T>) => PanelStackItem<T>): void;
    /**
     * @template T
     * @param {ReactComponent} component
     * @param {(data: PanelStackItem<T>) => PanelStackItem<T>} f
     * @returns {void}
     */
    updateFor<T>(component: ReactComponent, f: (data: PanelStackItem<T>) => PanelStackItem<T>): void;
    /**
     * @returns {void}
     */
    pop(): void;
    /**
     * @returns {void}
     */
    clear(): void;
    /**
     * @template T
     * @returns {PanelStackItem<T>}
     */
    peek<T>(): PanelStackItem<T>;
    /**
     * @template T
     * @returns {PanelStackItem<T>}
     */
    peekLast<T>(): PanelStackItem<T>;
    /**
     * @template T
     * @returns {T}
     */
    params<T>(): T;
}
import PanelStackItem from "./PanelStackItem.mjs";
//# sourceMappingURL=PanelStack.d.mts.map