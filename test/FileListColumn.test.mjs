/**
 * @typedef {import("../src/theme/FileListTheme.mjs").FileListTheme} FileListTheme
 * @typedef {import("../src/FileListColumn.mjs").FileListColumnProps} FileListColumnProps
 */
import React from "react";
import assert from "node:assert/strict";
import TestRenderer from "react-test-renderer";
import { assertComponents, mockComponent } from "react-assert";
import SingleChars from "@farjs/ui/border/SingleChars.mjs";
import TextAlign from "@farjs/ui/TextAlign.mjs";
import TextLine from "@farjs/ui/TextLine.mjs";
import FileListTheme from "../src/theme/FileListTheme.mjs";
import withThemeContext from "../src/theme/withThemeContext.mjs";
import FileListItem from "../src/api/FileListItem.mjs";
import FileListColumn from "../src/FileListColumn.mjs";

const h = React.createElement;

const { describe, it } = await (async () => {
  // @ts-ignore
  const module = process.isBun ? "bun:test" : "node:test";
  // @ts-ignore
  return process.isBun // @ts-ignore
    ? Promise.resolve({ describe: (_, fn) => fn(), it: test })
    : import(module);
})();

FileListColumn.textLineComp = mockComponent(TextLine);

const { textLineComp } = FileListColumn;

describe("FileListColumn.test.mjs", () => {
  it("should render non-empty component", () => {
    //given
    const currTheme = FileListTheme.xterm256Theme;
    const props = {
      width: 14,
      height: 3,
      left: 2,
      borderCh: SingleChars.vertical,
      items: [
        FileListItem.up,
        FileListItem("dir\t1 {bold}", true),
        FileListItem(".dir 2 looooooong", true),
        FileListItem("file 3"),
        FileListItem(".dir \r4", true),
        FileListItem(".file \n5"),
        FileListItem(" fileй 6"),
        FileListItem("file.zip"),
      ],
      focusedIndex: 2,
      selectedNames: new Set([".dir 2 looooooong", "file 3"]),
    };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(FileListColumn, props), currTheme)
    ).root;

    //then
    assertFileListColumn(
      result,
      props,
      [
        "{bold}{#5ce-fg}{#008-bg}..            {/}{bold}{#5ce-fg}{#008-bg}│{/}",
        "{bold}{#fff-fg}{#008-bg}dir 1 {open}bold{close}  {/}{bold}{#5ce-fg}{#008-bg}│{/}",
        "{bold}{yellow-fg}{#088-bg}.dir 2 loooooo{/}{bold}{#5ce-fg}{#008-bg}{close}{/}",
        "{bold}{yellow-fg}{#008-bg}file 3        {/}{bold}{#5ce-fg}{#008-bg}│{/}",
        "{bold}{#055-fg}{#008-bg}.dir 4        {/}{bold}{#5ce-fg}{#008-bg}│{/}",
        "{bold}{#055-fg}{#008-bg}.file 5       {/}{bold}{#5ce-fg}{#008-bg}│{/}",
        "{bold}{#5ce-fg}{#008-bg} fileй 6      {/}{bold}{#5ce-fg}{#008-bg}│{/}",
        "{bold}{#a05-fg}{#008-bg}file.zip      {/}{bold}{#5ce-fg}{#008-bg}│{/}",
      ].join("\n"),
      currTheme
    );
  });

  it("should render empty component", () => {
    //given
    const props = {
      width: 6,
      height: 3,
      left: 2,
      borderCh: SingleChars.vertical,
      items: [],
      focusedIndex: -1,
      selectedNames: new Set(),
    };

    //when
    const result = TestRenderer.create(
      withThemeContext(h(FileListColumn, props))
    ).root;

    //then
    assertFileListColumn(result, props, undefined);
  });
});

/**
 * @param {TestRenderer.ReactTestInstance} result
 * @param {FileListColumnProps} props
 * @param {string | undefined} expectedContent
 * @param {FileListTheme} currTheme
 */
function assertFileListColumn(
  result,
  props,
  expectedContent,
  currTheme = FileListTheme.defaultTheme
) {
  assert.deepEqual(FileListColumn.displayName, "FileListColumn");
  const theme = currTheme.fileList;

  assertComponents(
    result.children,
    h(
      "box",
      {
        width: props.width,
        height: props.height,
        left: props.left,
        style: theme.regularItem,
      },
      ...[
        h(textLineComp, {
          align: TextAlign.center,
          left: 0,
          top: 0,
          width: props.width,
          text: "Name",
          style: theme.header,
          focused: undefined,
          padding: 0,
        }),
        expectedContent
          ? h("text", {
              width: props.width + 1,
              top: 1,
              tags: true,
              wrap: false,
              content: expectedContent,
            })
          : null,
      ].filter((_) => _)
    )
  );
}
