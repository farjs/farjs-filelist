/**
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 */
import React, { useLayoutEffect, useRef } from "react";
import DoubleBorder from "@farjs/ui/border/DoubleBorder.mjs";
import PopupOverlay from "@farjs/ui/popup/PopupOverlay.mjs";
import Theme from "@farjs/ui/theme/Theme.mjs";

const h = React.createElement;

/**
 * @typedef {{
 *  readonly text: string;
 *  onClose(): void;
 * }} FileListQuickSearchProps
 */

/**
 * @param {FileListQuickSearchProps} props
 */
const FileListQuickSearch = (props) => {
  const { doubleBorderComp } = FileListQuickSearch;

  const elementRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );

  const width = 25;
  const height = 3;
  const currTheme = Theme.useTheme();
  const boxStyle = currTheme.popup.regular;
  const textStyle = currTheme.textBox.regular;
  const textWidth = width - 2;
  const text = props.text.slice(0, Math.min(textWidth - 1, props.text.length));

  useLayoutEffect(() => {
    const el = elementRef.current;
    const screen = el.screen;
    const cursor = screen.cursor;
    if (cursor.shape !== "underline" || !cursor.blink) {
      // @ts-ignore
      screen.cursorShape("underline", true);
    }

    const program = screen.program;
    program.showCursor();
    return () => {
      program.hideCursor();
    };
  }, []);

  function moveCursor() {
    const el = elementRef.current;
    el.screen.program.omove(
      /** @type {number} */ (el.aleft) + text.length,
      /** @type {number} */ (el.atop)
    );
  }

  useLayoutEffect(() => {
    moveCursor();
  }, [text]);

  return h(
    "form",
    {
      clickable: true,
      mouse: true,
      autoFocus: false,
      style: PopupOverlay.style,
      onResize: moveCursor,
      onClick: props.onClose,
    },
    h(
      "box",
      {
        clickable: true,
        autoFocus: false,
        width,
        height,
        top: "100%-3",
        left: 10,
        style: boxStyle,
      },
      h(doubleBorderComp, {
        width,
        height,
        style: boxStyle,
        title: "Search",
      }),

      h("text", {
        ref: elementRef,
        width: textWidth,
        height: 1,
        top: 1,
        left: 1,
        style: textStyle,
        content: text,
      })
    )
  );
};

FileListQuickSearch.displayName = "FileListQuickSearch";
FileListQuickSearch.doubleBorderComp = DoubleBorder;

export default FileListQuickSearch;
