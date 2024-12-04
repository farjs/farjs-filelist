import Color from "@farjs/ui/theme/Color.mjs";

/**
 * @type {import("./FileListTheme.mjs").ThemeFileList}
 */
const XTerm256ThemeFileList = Object.freeze({
  archiveItem: Object.freeze({
    bold: true,
    bg: "#008",
    fg: "#a05",
    focus: Object.freeze({
      bold: true,
      bg: "#088",
      fg: "#a05",
    }),
  }),

  regularItem: Object.freeze({
    bold: true,
    bg: "#008",
    fg: "#5ce",
    focus: Object.freeze({
      bold: true,
      bg: "#088",
      fg: "#111",
    }),
  }),

  dirItem: Object.freeze({
    bold: true,
    bg: "#008",
    fg: "#fff",
    focus: Object.freeze({
      bold: true,
      bg: "#088",
      fg: "#fff",
    }),
  }),

  hiddenItem: Object.freeze({
    bold: true,
    bg: "#008",
    fg: "#055",
    focus: Object.freeze({
      bold: true,
      bg: "#088",
      fg: "#055",
    }),
  }),

  selectedItem: Object.freeze({
    bold: true,
    bg: "#008",
    fg: Color.yellow,
    focus: Object.freeze({
      bold: true,
      bg: "#088",
      fg: Color.yellow,
    }),
  }),

  header: Object.freeze({
    bold: true,
    bg: "#008",
    fg: Color.yellow,
  }),
});

export default XTerm256ThemeFileList;
