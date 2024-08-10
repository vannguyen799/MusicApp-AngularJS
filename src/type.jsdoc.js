/** @typedef {SpreadsheetApp.Sheet} GoogleAppsScript.Spreadsheet.Sheet */
/** @typedef {SpreadsheetApp.Range} GoogleAppsScript.Spreadsheet.Range */
/** @typedef {SpreadsheetApp.Sheet} Sheet */
/** @typedef {SpreadsheetApp.Range} Range */

/**
 * @interface
 */
class ICell  {
  constructor() {
    /**
   * @type {number}
   */
    this.col;
    /**
     * @type {number}
     */
    
    this.row;
    /**
     * @type {string | null}
     */
    this.value;

    /**
     * @type {string | null}
     */
    this.note;

    /**
     * @type {Sheet}
     */
    this.Sheet;
  }

  /**
   * @param {number} row
   * @returns {this}
   */
  setRow(row) { }

  /**
   * @param {number} col
   * @returns {this}
   */
  setColumn(col) { }

  /**
   * @returns {string}
   */
  getNotation() { }
}

/**
 * @interface
 */
class IColumn {
  constructor() {
    /**
   * @type {ICell}
   */
    this.headerCell;

    /**
     * @type {Array<string>}
     */
    this.data;

    /**
     * @type {Array<ICell>}
     */
    this.cells;
  }

  /**
   * @param {ICell} headerCell
   */
  setHeaderCell(headerCell) { }

  /**
   * @param {number | null} index
   * @returns {Array<any> | any}
   */
  getData(index) { }

  /**
   * @param {Array<ICell>} cells
   */
  setCells(cells) { }
}

/**
 * @interface
 * @extends IColumn
 */
class IVerticalColumn extends IColumn {
  /**
   * @returns {Range}
   */
  getDataRange() { }

  /**
   * @param {number} fromIndex
   * @param {number} numItems
   * @returns {Range}
   */
  sliceDataRange(fromIndex, numItems) { }
}

/**
 * @interface
 */
class ISheetManager {
  constructor() {
    /**
   * @type {Sheet}
   */
    this.Sheet;

    /**
     * @type {Array<Array<string>>}
     */
    this.data;

    /**
     * @type {Array<Array<string>>}
     */
    this.notes;
  }

  /**
   * @returns {this}
   */
  loadData() { }

  /**
   * @returns {this}
   */
  loadNote() { }

  /**
   * @param {string} cellValue
   * @param {number} fromRow
   * @returns {ICell | null}
   */
  getCellByValue(cellValue, fromRow) { }

  /**
   * @param {string} header
   * @param {number|null} numRows
   * @param {boolean} ignoreBlank
   * @returns {IVerticalColumn | null}
   */
  getColumn(header, numRows, ignoreBlank) { }

  /**
   * @param {string} header
   * @param {number|null} numRows
   * @param {boolean} ignoreBlank
   * @returns {Array<any> | null}
   */
  getColumnValues(header, numRows, ignoreBlank) { }

  /**
   * @param {ICell} headerCell
   * @param {string | Array<string>} values
   * @returns {this}
   */
  setColumnValues(headerCell, values) { }

  /**
   * @param {ICell} headerCell
   * @param {number} numRows
   * @returns {this}
   */
  clearColumnValues(headerCell, numRows) { }

  /**
   * @param {string} note
   * @returns {ICell | null}
   */
  getCellByNote(note) { }

  /**
   * @returns {Array<ICell>}
   */
  getSheetNotes() { }

  /**
   * @param {string} title
   * @returns {GoogleAppsScript.Spreadsheet.EmbeddedChart | null}
   */
  getChartByTitle(title) { }

  /**
   * @returns {void}
   */
  flush() { }
}
