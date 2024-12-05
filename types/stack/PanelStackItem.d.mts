export default PanelStackItem;
export type Dispatch = import("../FileListData.mjs").Dispatch;
export type FileListData = import("../FileListData.mjs").FileListData;
/**
 * @template T
 */
declare class PanelStackItem<T> {
    /**
     * @param {React.FunctionComponent<any> | React.ComponentClass<any>} component
     * @param {Dispatch} [dispatch]
     * @param {FileListActions} [actions]
     * @param {T} [state]
     */
    constructor(component: React.FunctionComponent<any> | React.ComponentClass<any>, dispatch?: import("../FileListData.mjs").Dispatch | undefined, actions?: FileListActions | undefined, state?: T | undefined);
    /** @readonly @type {React.FunctionComponent<any> | React.ComponentClass<any>} */
    readonly component: React.FunctionComponent<any> | React.ComponentClass<any>;
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
import React from "react";
import FileListActions from "../FileListActions.mjs";
import FileListData from "../FileListData.mjs";
