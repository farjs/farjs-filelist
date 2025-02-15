/**
 * @typedef {import("../FileListData.mjs").ReactComponent} ReactComponent
 */
import PanelStackItem from "./PanelStackItem.mjs";

class PanelStack {
  /**
   * @param {boolean} isActive
   * @param {readonly PanelStackItem<any>[]} data
   * @param {(f: (data: readonly PanelStackItem<any>[]) => readonly PanelStackItem<any>[]) => void} updater
   */
  constructor(isActive, data, updater) {
    /** @readonly @type {boolean} */
    this.isActive = isActive;

    /** @private @readonly @type {readonly PanelStackItem<any>[]} */
    this._data = data;

    /** @private @readonly @type {(f: (data: readonly PanelStackItem<any>[]) => readonly PanelStackItem<any>[]) => void} */
    this._updater = updater;
  }

  /**
   * @param {PanelStackItem<any>} item
   * @returns {void}
   */
  push(item) {
    this._updater((data) => [item, ...data]);
  }

  /**
   * @template T
   * @param {(data: PanelStackItem<T>) => PanelStackItem<T>} f
   * @returns {void}
   */
  update(f) {
    this._updater((data) => {
      if (data.length === 0) {
        return data;
      }

      const [head, ...tail] = data;
      return [f(head), ...tail];
    });
  }

  /**
   * @template T
   * @param {ReactComponent} component
   * @param {(data: PanelStackItem<T>) => PanelStackItem<T>} f
   * @returns {void}
   */
  updateFor(component, f) {
    this._updater((data) => {
      return data.map((item) => {
        return item.component === component ? f(item) : item;
      });
    });
  }

  /**
   * @returns {void}
   */
  pop() {
    this._updater((data) => {
      if (data.length > 1) {
        const [_, ...tail] = data;
        return tail;
      }

      return data;
    });
  }

  /**
   * @returns {void}
   */
  clear() {
    this._updater((data) => {
      if (data.length > 1) {
        const last = data[data.length - 1];
        return [last];
      }

      return data;
    });
  }

  /**
   * @template T
   * @returns {PanelStackItem<T>}
   */
  peek() {
    ensureNonEmpty(this._data);

    return this._data[0];
  }

  /**
   * @template T
   * @returns {PanelStackItem<T>}
   */
  peekLast() {
    ensureNonEmpty(this._data);

    return this._data[this._data.length - 1];
  }

  /**
   * @template T
   * @returns {T}
   */
  params() {
    return this.peek().state;
  }
}

/**
 * @param {readonly PanelStackItem<any>[]} data
 */
function ensureNonEmpty(data) {
  if (data.length === 0) {
    throw Error("PanelStack is empty!");
  }
}

export default PanelStack;
