export declare function transformResponse(
  response: { body: { data: Record<string, any>[] } },
  keyMap: Record<string, string | ((item: Record<string, unknown>) => unknown)>,
  additionalData?: Record<string, unknown>[]
): { body: { data: Record<string, unknown>[] } };

export declare function transformNativeResponse(
  response: any
): { body: { data: Record<string, string | number | boolean | null>[] } };
