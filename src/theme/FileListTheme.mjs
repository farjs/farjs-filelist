/**
 * @typedef {import("@farjs/ui/theme/Theme.mjs").Theme} Theme
 * @typedef {import("@farjs/ui/theme/Theme.mjs").ThemeStyle} ThemeStyle
 * @typedef {import("@farjs/ui/theme/Theme.mjs").ThemeEffects} ThemeEffects
 */
import Theme from "@farjs/ui/theme/Theme.mjs";
import DefaultTheme from "@farjs/ui/theme/DefaultTheme.mjs";
import XTerm256Theme from "@farjs/ui/theme/XTerm256Theme.mjs";
import DefaultThemeFileList from "./DefaultThemeFileList.mjs";
import XTerm256ThemeFileList from "./XTerm256ThemeFileList.mjs";

const FileListTheme = {
  /**
   * @returns {FileListTheme}
   */
  useTheme: () => {
    return /** @type {FileListTheme} */ (Theme.useTheme());
  },

  /** @type {FileListTheme} */
  defaultTheme: { ...DefaultTheme, fileList: DefaultThemeFileList },

  /** @type {FileListTheme} */
  xterm256Theme: { ...XTerm256Theme, fileList: XTerm256ThemeFileList },
};

export default FileListTheme;

/**
 * @typedef {Theme & {
 *  readonly fileList: ThemeFileList;
 * }} FileListTheme
 */

/**
 * @typedef {{
 *  readonly archiveItem: ThemeEffects;
 *  readonly regularItem: ThemeEffects;
 *  readonly dirItem: ThemeEffects;
 *  readonly hiddenItem: ThemeEffects;
 *  readonly selectedItem: ThemeEffects;
 *  readonly header: ThemeStyle;
 * }} ThemeFileList
 */
