export interface GridResponseData {
  body: {
    data: any;
    metadata: any;
  };
}

export declare function transformResponse(
  response: GridResponseData,
  keyMap: Record<string, string | ((item: Record<string, unknown>) => unknown)>,
  additionalData?: Record<string, unknown>[]
): GridResponseData;

export declare function transformNativeResponse(
  response: any
): GridResponseData;
