import Color from "@farjs/ui/theme/Color.mjs";

/**
 * @type {import("./FileListTheme.mjs").ThemeFileList}
 */
const DefaultThemeFileList = Object.freeze({
  archiveItem: Object.freeze({
    bold: false,
    bg: Color.blue,
    fg: Color.magenta,
    focus: Object.freeze({
      bold: false,
      bg: Color.cyan,
      fg: Color.magenta,
    }),
  }),

  regularItem: Object.freeze({
    bold: false,
    bg: Color.blue,
    fg: Color.white,
    focus: Object.freeze({
      bold: false,
      bg: Color.cyan,
      fg: Color.black,
    }),
  }),

  dirItem: Object.freeze({
    bold: true,
    bg: Color.blue,
    fg: Color.white,
    focus: Object.freeze({
      bold: true,
      bg: Color.cyan,
      fg: Color.white,
    }),
  }),

  hiddenItem: Object.freeze({
    bold: true,
    bg: Color.blue,
    fg: Color.black,
    focus: Object.freeze({
      bold: true,
      bg: Color.cyan,
      fg: Color.black,
    }),
  }),

  selectedItem: Object.freeze({
    bold: true,
    bg: Color.blue,
    fg: Color.yellow,
    focus: Object.freeze({
      bold: true,
      bg: Color.cyan,
      fg: Color.yellow,
    }),
  }),

  header: Object.freeze({
    bold: true,
    bg: Color.blue,
    fg: Color.yellow,
  }),
});

export default DefaultThemeFileList;
