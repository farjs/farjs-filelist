/**
 * @typedef {import("./SortMode.mjs").SortMode} SortMode
 * @typedef {import("./FileListSort.mjs").FileListSort} FileListSort
 */
import React from "react";
import MenuPopup from "@farjs/ui/menu/MenuPopup.mjs";
import WithStack from "../stack/WithStack.mjs";
import SortMode from "./SortMode.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly sort: FileListSort;
 *  onClose(): void;
 * }} SortModesPopupProps
 */

/**
 * @param {SortModesPopupProps} props
 */
const SortModesPopup = (props) => {
  const { menuPopup } = SortModesPopup;

  const stackProps = WithStack.useStack();
  const showOnLeft = !stackProps.isRight;

  const items = itemsAndModes.map(({ item, mode }) => {
    const indicator = props.sort.asc ? "+" : "-";
    return mode === props.sort.mode ? `${indicator}${item.substring(1)}` : item;
  });

  /** @type {(index: number) => void} */
  function onSelect(index) {
    props.onClose();

    const key = index + 3;
    stackProps.panelInput.emit("keypress", undefined, {
      name: `f${key}+ctrl`,
      full: `C-f${key}`,
      ctrl: true,
    });
  }

  return h(menuPopup, {
    title: "Sort by",
    items,
    getLeft: (width) => {
      return MenuPopup.getLeftPos(stackProps.width, showOnLeft, width);
    },
    onSelect,
    onClose: props.onClose,
  });
};

SortModesPopup.displayName = "SortModesPopup";
SortModesPopup.menuPopup = MenuPopup;

/**
 * @param {string} item
 * @param {SortMode} mode
 * @returns {{item: string, mode: SortMode}}
 */
function makeItem(item, mode) {
  return { item, mode };
}

const itemsAndModes = [
  makeItem("  Name                 Ctrl-F3  ", SortMode.Name),
  makeItem("  Extension            Ctrl-F4  ", SortMode.Extension),
  makeItem("  Modification time    Ctrl-F5  ", SortMode.ModificationTime),
  makeItem("  Size                 Ctrl-F6  ", SortMode.Size),
  makeItem("  Unsorted             Ctrl-F7  ", SortMode.Unsorted),
  makeItem("  Creation time        Ctrl-F8  ", SortMode.CreationTime),
  makeItem("  Access time          Ctrl-F9  ", SortMode.AccessTime),
];

export default SortModesPopup;
