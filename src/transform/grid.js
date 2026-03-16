import { GridDataType } from '../grid/constants.js';

/**
 * @typedef {{ body: { data: Record<string, string>[] } }} GridResponseData
 */

/**
 * @typedef {{ body: { Result: { ResultData: { DATARECORD: Array<{ DATAFIELD: Array<{ FIELDVALUE: string, DATATYPE: string, FIELDNAME: string }> }> } } } }} GridDataNativeResponse
 */

/**
 * Remaps grid response data using a key map. Each entry in `keyMap` maps an output
 * key to either an input key (string) or a computed value (function).
 *
 * @example
 * transformResponse(response, {
 *   description: 'workorderdesc',
 *   code: 'workordernum',
 *   isActive: (row) => row.status !== 'C',
 * });
 *
 * @param {GridResponseData} response
 * @param {Record<string, string | ((item: Record<string, unknown>) => unknown)>} keyMap
 * @param {Record<string, unknown>[]} [additionalData]
 * @returns {{ body: { data: Record<string, unknown>[] } }}
 */
export function transformResponse(response, keyMap, additionalData = []) {
  return {
    body: {
      data: [
        ...response.body.data.map((item) =>
          Object.fromEntries(
            Object.entries(keyMap).map(([newKey, oldKey]) => [
              newKey,
              typeof oldKey === 'function' ? oldKey(item) : item[oldKey],
            ])
          )
        ),
        ...additionalData,
      ],
    },
  };
}

/**
 * Transforms a native EAM grid response (DATARECORD format) into a flat array of objects.
 * Normalizes field types: DECIMAL/NUMBER become numbers, CHKBOOLEAN becomes booleans.
 * Empty strings are normalized to null for all typed fields.
 *
 * @param {GridDataNativeResponse} response
 * @returns {{ body: { data: Record<string, string | number | boolean | null>[] } }}
 */
export const transformNativeResponse = (response) => {
  const records = response.body.Result.ResultData.DATARECORD ?? [];

  return {
    body: {
      data: records.map((record) => {
        /** @type {Record<string, string | number | null | boolean>} */
        const obj = {};

        for (const field of record.DATAFIELD) {
          let value = field.FIELDVALUE;

          switch (field.DATATYPE) {
            case GridDataType.DECIMAL:
            case GridDataType.NUMBER:
              value = value === '' ? null : Number(value?.replace(/,/g, ''));
              break;
            case GridDataType.CHKBOOLEAN:
              value = value === '' ? null : ['1', '-1'].includes(value);
              break;
            default:
              break;
          }

          obj[field.FIELDNAME] = value;
        }

        return obj;
      }),
    },
  };
};
