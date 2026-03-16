import { GridType, GridFilterJoiner, SortType } from './constants.js';

/**
 * @typedef {'ASC' | 'DESC'} SortTypeValue
 */

export default class GridRequest {
  /**
   * @param {string} gridName
   * @param {string} [gridType]
   * @param {string} [userFunctionName]
   */
  constructor(gridName, gridType = GridType.LIST, userFunctionName) {
    this.GRID = {
      GRID_NAME: gridName,
      NUMBER_OF_ROWS_FIRST_RETURNED: 1000,
      CURSOR_POSITION: 0,
    };

    if (userFunctionName) {
      this.GRID.USER_FUNCTION_NAME = userFunctionName;
    }

    this.GRID_TYPE = {
      TYPE: gridType,
    };

    this.REQUEST_TYPE = 'LIST.HEAD_DATA.STORED';
    this.LOCALIZE_RESULT = 'false';
  }

  /**
   * @param {string} dataspyId
   * @returns {this}
   */
  setDataspy(dataspyId) {
    this.DATASPY = {
      DATASPY_ID: dataspyId,
    };
    return this;
  }

  /**
   * @param {number} rowCount
   * @returns {this}
   */
  setRowCount(rowCount) {
    this.GRID.NUMBER_OF_ROWS_FIRST_RETURNED = rowCount;
    this.GRID.WSGRIDSZ_OVERRIDE = rowCount;
    return this;
  }

  /**
   * Adds or replaces a LOV parameter by alias name.
   * @param {string} alias
   * @param {*} value
   * @returns {this}
   */
  addParam(alias, value) {
    if (!this.LOV) {
      this.LOV = {
        LOV_PARAMETERS: {
          LOV_PARAMETER: [],
        },
      };
    }

    this.LOV.LOV_PARAMETERS.LOV_PARAMETER = this.LOV.LOV_PARAMETERS.LOV_PARAMETER.filter(
      (param) => param.ALIAS_NAME !== alias
    );

    this.LOV.LOV_PARAMETERS.LOV_PARAMETER.push({
      ALIAS_NAME: alias,
      VALUE: value,
    });

    return this;
  }

  /**
   * Adds a filter condition to the grid request.
   * @param {string} fieldName - Field alias name
   * @param {*} fieldValue
   * @param {string} operator - Use `GridFilterOperator` constants
   * @param {string} [joiner]
   * @param {boolean} [leftParenthesis]
   * @param {boolean} [rightParenthesis]
   * @returns {this}
   */
  addFilter(
    fieldName,
    fieldValue,
    operator,
    joiner = GridFilterJoiner.AND,
    leftParenthesis = false,
    rightParenthesis = false
  ) {
    if (!this.MULTIADDON_FILTERS) {
      this.MULTIADDON_FILTERS = {
        MADDON_FILTER: [],
      };
    }

    this.MULTIADDON_FILTERS.MADDON_FILTER.push({
      ALIAS_NAME: fieldName,
      VALUE: fieldValue,
      OPERATOR: operator,
      JOINER: joiner,
      LPAREN: leftParenthesis,
      RPAREN: rightParenthesis,
      SEQNUM: this.MULTIADDON_FILTERS.MADDON_FILTER.length,
    });

    return this;
  }

  /**
   * @param {string} fieldName - Field alias name to sort by
   * @param {SortTypeValue} [sortType]
   * @returns {this}
   */
  sortBy(fieldName, sortType = SortType.ASC) {
    this.ADDON_SORT = {
      ALIAS_NAME: fieldName,
      TYPE: sortType,
    };
    return this;
  }
}
