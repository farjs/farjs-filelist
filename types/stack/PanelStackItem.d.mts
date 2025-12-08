export default PanelStackItem;
export type Dispatch = import("../FileListData.mjs").Dispatch;
export type ReactComponent = import("../FileListData.mjs").ReactComponent;
export type FileListData = import("../FileListData.mjs").FileListData;
/**
 * @template T
 */
declare class PanelStackItem<T> {
    /**
     * @param {ReactComponent} component
     * @param {Dispatch} [dispatch]
     * @param {FileListActions} [actions]
     * @param {T} [state]
     */
    constructor(component: ReactComponent, dispatch?: Dispatch, actions?: FileListActions, state?: T);
    /** @readonly @type {ReactComponent} */
    readonly component: ReactComponent;
    /** @readonly @type {Dispatch | undefined} */
    readonly dispatch: Dispatch | undefined;
    /** @readonly @type {FileListActions | undefined} */
    readonly actions: FileListActions | undefined;
    /** @readonly @type {T | undefined} */
    readonly state: T | undefined;
    /**
     * @param {T} s
     * @returns {PanelStackItem<T>}
     */
    withState(s: T): PanelStackItem<T>;
    /**
     * @param {(s: T) => T} f
     * @returns {PanelStackItem<T>}
     */
    updateState(f: (s: T) => T): PanelStackItem<T>;
    /**
     * @returns {FileListData | undefined}
     */
    getData(): FileListData | undefined;
}
import FileListActions from "../FileListActions.mjs";
//# sourceMappingURL=PanelStackItem.d.mts.map