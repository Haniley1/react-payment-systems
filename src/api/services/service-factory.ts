import { TablePaginationConfig } from 'antd/es/table';
import { Key, SorterResult } from 'antd/lib/table/interface';
import axios, { AxiosResponse } from 'axios';
import { API_PROTOCOL, BASE_PLATFORM_API_URL, ID, IGetArrayAxiosResponse, } from '~/api/model';

export const DEFAULT_PAGE_SIZE = 10;

export enum Condition {
  Or = 'or'
}

export enum Operator {
  Equal = 'eq',
  Greater = 'gt',
  GreaterEqual = 'gte',
  Less = 'lt',
  LessEqual = 'lte',
  NotEqual = 'ne',
  Between = 'between',
  NotBetween = 'notBetween',
  In = 'in',
  NotIn = 'notIn',
  Like = 'like',
  NotLike = 'notLike',
  ILike = 'iLike',
  NotILike = 'notILike',
  Regexp = 'regexp',
  NotRegexp = 'notRegexp',
  IRegexp = 'iRegexp',
  NotIRegexp = 'notIRegexp'
}

type Conditions<T> = {
  [K in keyof T]?: { iLike: string }
} & {
  _condition: Condition
}

export type RequestParams = {
  pagination?: TablePaginationConfig;
  fields?: string;
  sorter?: SorterResult<any> | SorterResult<any>[];
  filters?: Record<string, Key[] | null>;
  filtersSchema?: FilterSchema
}

export type FilterSchema = { [key: string]: Operator }

enum SortDirection {
  ascend = 'ASC',
  descend = 'DESC'
}

export type GetAllRequest<T> = {
  limit_rows: number | undefined,
  limit_offset: number,
  fields?: string;
  order?: string; // [keyof T, SortDirection];
  filter?: Conditions<T>;
}

const createSort = <T>(sorter: SorterResult<any> | SorterResult<any>[] | undefined): string | undefined => {
  if (Array.isArray(sorter)) {
    throw new Error('Not implemented');
  }

  const { field, order } = sorter || {};

  if (field && order) {
    return [field as keyof T, SortDirection[order]].join(',');
  }
};

const createFilter = <T>(filters?: Record<string, Key[] | null>, filterSchema?: FilterSchema): Conditions<T> | undefined => {
  const entries = Object
    .entries(filters || {})
    .filter(([, value]) => value?.length || value !== null);

  if (entries.length) {
    return entries.reduce((acc, [key, value]) => {
      const query = acc
      console.log(value, filterSchema)

      if (!value || !value.length) return query

      if (filterSchema && filterSchema[key]) {
        switch (filterSchema[key]) {
          case Operator.Equal:
            query[key] = { [Operator.Equal]: value[0] }
            break;
          case Operator.ILike:
            query[key] = { [Operator.ILike]: `%${value[0]}%` }
            break;
          case Operator.In:
            query[key] = { [Operator.In]: value }
            break;
          default:
            query[key] = { iLike: `%${value[0]}%` }
        }
      } else {
        query[key] = { iLike: `%${value[0]}%` }
      }

      return query
    }, { _condition: Condition.Or } as any);
  }
};

export class EntityService<Entity> {
  getAll({ pagination, fields, filters, sorter, filtersSchema }: RequestParams = {}) {
    const { current = 1, pageSize = DEFAULT_PAGE_SIZE } = pagination || {};
    const params: GetAllRequest<Entity> = {
      limit_rows: pageSize,
      limit_offset: pageSize * (current - 1),
      fields,
      order: createSort<Entity>(sorter),
      filter: createFilter<Entity>(filters, filtersSchema),
    };

    return axios.get<IGetArrayAxiosResponse<Entity>>(`${this.baseURL}`, {
      withCredentials: true,
      params,
    });
  }

  getOne(id: ID | string): Promise<AxiosResponse<Entity>> {
    return axios.get(`${this.baseURL}/${id}`, {
      withCredentials: true,
    });
  }

  createOne(data: Partial<Entity>): Promise<AxiosResponse<ID>> {
    return axios.post(`${this.baseURL}/create`, data, {
      withCredentials: true,
    });
  }

  updateOne(id: number, changes: Partial<Entity>): Promise<AxiosResponse<Entity>> {
    return axios.post(`${this.baseURL}/update/${id}`, changes, {
      withCredentials: true,
    });
  }

  deleteOne(ids: ID[]): Promise<AxiosResponse<boolean>> {
    return axios.get(`${this.baseURL}/delete`, {
      withCredentials: true,
      params: { id: ids.join() }
    });
  }

  [customMethod: string]: any;

  constructor(private readonly baseURL: string, customMethods: Record<string, ((...args: any) => any)> = {}) {
    Object.entries(customMethods).forEach(([name, method]) => this[name] = method);
  }

  static createService<Entity>(name: string, customMethods?: Record<string, ((...args: any) => any)>) {
    return new EntityService<Entity>(`${API_PROTOCOL}${BASE_PLATFORM_API_URL}/${name}`, customMethods);
  }
}
