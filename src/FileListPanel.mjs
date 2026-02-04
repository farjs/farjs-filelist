/**
 * @typedef {import("@farjs/blessed").Widgets.Screen} BlessedScreen
 * @typedef {import("./sort/SortMode.mjs").SortMode} SortMode
 * @typedef {import("./FileListActions.mjs").FileListAction} FileListAction
 * @typedef {import("./FileListData.mjs").Dispatch} Dispatch
 * @typedef {import("./FileListState.mjs").FileListState} FileListState
 */
import React, { useLayoutEffect, useState } from "react";
import path from "path";
import FileListItem from "./api/FileListItem.mjs";
import WithStack from "./stack/WithStack.mjs";
import SortMode from "./sort/SortMode.mjs";
import SortModesPopup from "./sort/SortModesPopup.mjs";
import FileListActions from "./FileListActions.mjs";
import FileListState from "./FileListState.mjs";
import FileListQuickSearch from "./FileListQuickSearch.mjs";
import FileListPanelView from "./FileListPanelView.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly dispatch: Dispatch;
 *  readonly actions: FileListActions;
 *  readonly state: FileListState;
 *  onKeypress?(screen: BlessedScreen, keyFull: string): boolean;
 * }} FileListPanelProps
 */

/**
 * @param {FileListPanelProps} props
 */
const FileListPanel = (props) => {
  const { fileListPanelView, fileListQuickSearch, sortModesPopup } =
    FileListPanel;

  const stackProps = WithStack.useStack();
  const [maybeQuickSearch, setMaybeQuickSearch] = useState(
    /** @type {string | null} */ (null),
  );
  const [showSortModes, setShowSortModes] = useState(false);

  /** @type {(text: string) => void} */
  function quickSearch(text) {
    const index = props.state.currDir.items.findIndex((_) =>
      _.name.startsWith(text),
    );
    if (index >= 0) {
      /** @type {FileListAction} */
      const action = {
        action: "FileListParamsChangedAction",
        offset: 0,
        index: index,
        selectedNames: props.state.selectedNames,
      };
      props.dispatch(action);

      setMaybeQuickSearch(text);
    }
  }

  /**
   * @param {BlessedScreen} screen
   * @param {string} key
   */
  function onKeypress(screen, key) {
    const onKeypressProp = props.onKeypress;
    if (!onKeypressProp || !onKeypressProp(screen, key)) {
      /** @type {(mode: SortMode) => void} */
      function dispatchSortAction(mode) {
        /** @type {FileListAction} */
        const action = { action: "FileListSortAction", mode };
        props.dispatch(action);
      }

      if (key === "C-f3") {
        dispatchSortAction(SortMode.Name);
      } else if (key === "C-f4") {
        dispatchSortAction(SortMode.Extension);
      } else if (key === "C-f5") {
        dispatchSortAction(SortMode.ModificationTime);
      } else if (key === "C-f6") {
        dispatchSortAction(SortMode.Size);
      } else if (key === "C-f7") {
        dispatchSortAction(SortMode.Unsorted);
      } else if (key === "C-f8") {
        dispatchSortAction(SortMode.CreationTime);
      } else if (key === "C-f9") {
        dispatchSortAction(SortMode.AccessTime);
      } else if (key === "C-f12") {
        setShowSortModes(true);
      } else if (key === "C-c") {
        const item = FileListState.currentItem(props.state);
        if (item) {
          const text =
            item.name === FileListItem.up.name
              ? props.state.currDir.path
              : path.join(props.state.currDir.path, item.name);
          screen.copyToClipboard(text);
        }
      } else if (key === "C-r") {
        props.dispatch(
          props.actions.updateDir(props.dispatch, props.state.currDir.path),
        );
      } else if (
        key === "enter" ||
        key === "C-pageup" ||
        key === "C-pagedown"
      ) {
        const targetDir = (() => {
          if (key === "C-pageup") {
            if (props.state.currDir.isRoot) {
              process.stdin.emit("keypress", undefined, {
                name: stackProps.isRight ? "r" : "l",
                ctrl: false,
                meta: true,
                shift: false,
              });
              return undefined;
            }
            return FileListItem.up;
          }
          return FileListState.currentItem(props.state, (_) => _.isDir);
        })();

        if (targetDir) {
          props.dispatch(
            props.actions.changeDir(
              props.dispatch,
              props.state.currDir.path,
              targetDir.name,
            ),
          );
        }
      } else if (key === "C-s") {
        setMaybeQuickSearch("");
      }
    }

    if (maybeQuickSearch !== null) {
      const text = maybeQuickSearch;
      if (key.length === 1) {
        quickSearch(`${text}${key}`);
      } else if (key.startsWith("S-") && key.length === 3) {
        quickSearch(`${text}${key.slice(2).toUpperCase()}`);
      } else if (key === "space") {
        quickSearch(`${text} `);
      } else if (key === "backspace") {
        setMaybeQuickSearch(text.slice(0, text.length - 1));
      } else if (key !== "C-s" && key.length > 1) {
        setMaybeQuickSearch(null);
      }
    }
  }

  useLayoutEffect(() => {
    if (!stackProps.stack.isActive) {
      setMaybeQuickSearch(null);
    }
  }, [stackProps.stack.isActive]);

  return h(
    React.Fragment,
    null,
    h(fileListPanelView, {
      dispatch: props.dispatch,
      actions: props.actions,
      state: props.state,
      onKeypress: onKeypress,
    }),

    maybeQuickSearch !== null
      ? h(fileListQuickSearch, {
          text: maybeQuickSearch,
          onClose: () => {
            setMaybeQuickSearch(null);
          },
        })
      : null,

    showSortModes
      ? h(sortModesPopup, {
          sort: props.state.sort,
          onClose: () => {
            setShowSortModes(false);
          },
        })
      : null,
  );
};

FileListPanel.displayName = "FileListPanel";
FileListPanel.fileListPanelView = FileListPanelView;
FileListPanel.fileListQuickSearch = FileListQuickSearch;
FileListPanel.sortModesPopup = SortModesPopup;

export default FileListPanel;
