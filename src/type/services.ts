export type GetDropdownOptionsRequest = {
  column: string;
  search?: string;
  [key: string]: any;
};

export type DropdownOptions<T = string | number> = {
  value: T;
  label: string;
};

export type GetDropdownOptionsResponse = DropdownOptions[];

export type GetDatatableRequest = {
  start: number;
  length: number;
  search: string;
  order?: string;
  [key: string]: any;
};

export type GetDatatableResponse = {
  data: Record<string, any>[];
  recordsTotal: number;
  recordsFiltered: number;
};

export type WithId = {
  id: number;
};
