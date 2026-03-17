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
          metadata: response.body.metadata,
          data: [
              ...response.body.data.map(item => 
                  Object.fromEntries(
                    Object.entries(keyMap)
                    .map(([newKey, oldKey]) => [newKey, typeof oldKey === 'function' ? oldKey(item) : item[oldKey]]))
              ),
              ...additionalData
          ]
      }
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
  const gridResultData = response.body.Result.ResultData
  
  return {
    body: {
      metadata: {...gridResultData.METADATA,
                DATAENTITYNAME: gridResultData.DATAENTITYNAME,
                CURRENTCURSORPOSITION: gridResultData.CURRENTCURSORPOSITION,
                NEXTCURSORPOSITION: gridResultData.NEXTCURSORPOSITION,
      },
      data: (gridResultData.DATARECORD ?? []).map(record => {
        const obj = {};
        for (const field of record.DATAFIELD) {
          let value = field.FIELDVALUE;

          // Normalize types
          switch (field.DATATYPE) {
            case 'DECIMAL':
            case 'NUMBER':
              value = value === '' ? null : Number(value?.replace(/,/g, ""));
              break;
            case 'CHKBOOLEAN':
              value = value === '' ? null : ['1', '-1'].includes(value);
              break;
            default:
              // Keep VARCHAR, MIXVARCHAR, DATE, etc. as-is
              break;
          }

          obj[field.FIELDNAME] = value;
        }
        return obj;
      }),
    },
  };
};
