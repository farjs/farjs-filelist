/**
 * @typedef {import("../FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("../FileListData.mjs").FileListData} FileListData
 */
import React from "react";
import FileListData from "../FileListData.mjs";
import FileListState from "../FileListState.mjs";
import FileListActions from "../FileListActions.mjs";

/**
 * @typedef {React.FunctionComponent<any> | React.ComponentClass<any>} ReactComponent
 */

/**
 * @template T
 */
class PanelStackItem {
  /**
   * @param {ReactComponent} component
   * @param {Dispatch} [dispatch]
   * @param {FileListActions} [actions]
   * @param {T} [state]
   */
  constructor(component, dispatch, actions, state) {
    /** @readonly @type {ReactComponent} */
    this.component = component;

    /** @readonly @type {Dispatch | undefined} */
    this.dispatch = dispatch;

    /** @readonly @type {FileListActions | undefined} */
    this.actions = actions;

    /** @readonly @type {T | undefined} */
    this.state = state;
  }

  /**
   * @param {T} s
   * @returns {PanelStackItem<T>}
   */
  withState(s) {
    return new PanelStackItem(this.component, this.dispatch, this.actions, s);
  }

  /**
   * @param {(s: T) => T} f
   * @returns {PanelStackItem<T>}
   */
  updateState(f) {
    return new PanelStackItem(
      this.component,
      this.dispatch,
      this.actions,
      this.state ? f(this.state) : this.state
    );
  }

  /**
   * @returns {FileListData | undefined}
   */
  getData() {
    if (
      this.dispatch &&
      this.actions &&
      this.state &&
      FileListState.isFileListState(this.state)
    ) {
      return FileListData(
        this.dispatch,
        this.actions,
        /** @type {any} */ (this.state)
      );
    }

    return undefined;
  }
}

export default PanelStackItem;
