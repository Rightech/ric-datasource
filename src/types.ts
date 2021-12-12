import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface RicQuery extends DataQuery {
  objects?: string[];
  arguments?: string[];
}

export interface RicDataSourceOptions extends DataSourceJsonData {
  baseUrl?: string;
}

export interface RicSecureJsonData {
  token?: string;
}
