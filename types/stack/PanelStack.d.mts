export default PanelStack;
export type ReactComponent = import("../FileListData.mjs").ReactComponent;
declare class PanelStack {
    /**
     * @param {boolean} isActive
     * @param {PanelStackItem<any>[]} data
     * @param {(f: (data: PanelStackItem<any>[]) => PanelStackItem<any>[]) => void} updater
     */
    constructor(isActive: boolean, data: PanelStackItem<any>[], updater: (f: (data: PanelStackItem<any>[]) => PanelStackItem<any>[]) => void);
    /** @readonly @type {boolean} */
    readonly isActive: boolean;
    /** @private @readonly @type {PanelStackItem<any>[]} */
    private readonly _data;
    /** @private @readonly @type {(f: (data: PanelStackItem<any>[]) => PanelStackItem<any>[]) => void} */
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
    updateFor<T_1>(component: ReactComponent, f: (data: PanelStackItem<T_1>) => PanelStackItem<T_1>): void;
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
    peek<T_2>(): PanelStackItem<T_2>;
    /**
     * @template T
     * @returns {PanelStackItem<T>}
     */
    peekLast<T_3>(): PanelStackItem<T_3>;
    /**
     * @template T
     * @returns {T}
     */
    params<T_4>(): T_4;
}
import PanelStackItem from "./PanelStackItem.mjs";
