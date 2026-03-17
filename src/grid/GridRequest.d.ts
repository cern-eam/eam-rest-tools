export default class GridRequest {
  constructor(gridName: string, gridType?: string, userFunctionName?: string);
  setDataspy(dataspyId: string): this;
  setRowCount(rowCount: number): this;
  addParam(alias: string, value: any): this;
  addFilter(
    fieldName: string,
    fieldValue: any,
    operator: string,
    joiner?: string,
    leftParenthesis?: boolean,
    rightParenthesis?: boolean
  ): this;
  sortBy(fieldName: string, sortType?: string): this;
}
