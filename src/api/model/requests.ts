export interface IGetArrayAxiosResponse<T> {
  rows: T[];
  total: number;
}

type Conditions<T = object> = {
  [K in keyof T]?: {iLike: string}
} & {
  _condition: 'or'
}

export type FilterDataParams = Record<string, { iLike: string } | string>;

export const createFilter = <T>(fields: string[])  =>
  (value: string) => fields.reduce((acc, key) => {
    return {...acc, [key]: {iLike: `%${value}%`}};
  }, {_condition: 'or'} as Conditions<T>);

export type GetArrayAxiosDataParams = {
  limit_rows: number | undefined;
  limit_offset: number;
  order?: string;
  fields?: string;
  filter?: Conditions;
};

export type GetEntitiesParams<T> = {
  rowsCount: number | undefined;
  pageOffset: number;
  fields: Array<keyof T>;
  sort?: {
    order: string;
    field: string;
  };
}
