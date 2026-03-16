# eam-rest-tools

EAM REST Tools — grid request builder and response transformers for Infor EAM.

## Install

```sh
npm install eam-rest-tools
```

## Usage

### GridRequest

```js
import { GridRequest, GridFilterOperator, GridFilterJoiner, GridType, SortType } from 'eam-rest-tools';
// or scoped:
import { GridRequest, GridFilterOperator } from 'eam-rest-tools/grid';
```

```js
const request = new GridRequest('WSJOBS')
  .setRowCount(200)
  .addFilter('status', 'R', GridFilterOperator.EQUALS)
  .addFilter('priority', 'HIGH', GridFilterOperator.EQUALS, GridFilterJoiner.OR)
  .sortBy('scheddate', SortType.DESC);
```

```js
// LOV grid with a user function
const lovRequest = new GridRequest('BSCLAS', GridType.LOV, 'BSCLAS')
  .addParam('param.entity', 'A')
  .setDataspy('12345');
```

### transformResponse

Remaps a grid response using a key map. Values can be field aliases (strings) or computed functions.

```js
import { transformResponse } from 'eam-rest-tools/transform';

const result = transformResponse(response, {
  description: 'workorderdesc',
  code: 'workordernum',
  isActive: (row) => row.status !== 'C',
});
// result.body.data => [{ description, code, isActive }, ...]
```

### transformNativeResponse

Transforms a native EAM DATARECORD response into flat objects with normalized types
(`DECIMAL`/`NUMBER` → `number`, `CHKBOOLEAN` → `boolean`, empty strings → `null`).

```js
import { transformNativeResponse } from 'eam-rest-tools/transform';

const result = transformNativeResponse(nativeResponse);
// result.body.data => [{ fieldName: value, ... }, ...]
```

## Constants

```js
import { GridType, GridFilterJoiner, GridFilterOperator, SortType, GridDataType } from 'eam-rest-tools/grid';
```

| Export               | Values                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `GridType`           | `LIST`, `LOV`                                                                               |
| `GridFilterJoiner`   | `AND`, `OR`                                                                                 |
| `GridFilterOperator` | `EQUALS`, `NOT_EQUAL`, `BEGINS`, `CONTAINS`, `IN`, `NOT_EMPTY`, `LESS_THAN`, `GREATER_THAN` |
| `SortType`           | `ASC`, `DESC`                                                                               |
| `GridDataType`       | `DECIMAL`, `NUMBER`, `CHKBOOLEAN`, `VARCHAR`, `MIXVARCHAR`, `DATE`                          |
