import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { getBackendSrv } from '@grafana/runtime';
import { Packet } from '@rightech/api';

import { RicQuery, RicDataSourceOptions } from './types';

import { qs, toGrafanaDataType } from './util/misc';
import { getArgumentsOf, models, objects } from './util/store';

//const DEFAULT_BASE_URL = 'https://dev.rightech.io/';

export class DataSource extends DataSourceApi<RicQuery, RicDataSourceOptions> {
  proxyUrl: string;

  constructor(instanceSettings: DataSourceInstanceSettings<RicDataSourceOptions>) {
    super(instanceSettings);
    this.proxyUrl = instanceSettings.url!;
  }

  async query(options: DataQueryRequest<RicQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    await Promise.all([this.loadObjects(), this.loadModels()]);

    const data: MutableDataFrame[] = [];

    for (const target of options.targets) {
      for (const objectId of target.objects || []) {
        const object = objects.getById(objectId);
        if (!object) {
          continue;
        }
        let params = getArgumentsOf([objectId]);
        if (target?.arguments?.length) {
          params = params.filter((x) => target.arguments!.includes(x.id));
        }

        const id = object._id;
        const name = object.name;
        const only = ['_ts', 'time', ...params.map(({ id }) => id)];

        const packetsUrl = this.proxyApiUrl(
          `objects/${id}/packets?${qs({ from, to, only, nolimit: true, streamed: true })}`
        );

        let packets: Packet[] = await getBackendSrv().get(packetsUrl);
        packets.sort((a, b) => b.time! - a.time!);

        const slice = new MutableDataFrame({
          refId: target.refId,
          fields: [{ name: 'time', type: FieldType.time }],
        });

        for (const param of params) {
          const type = toGrafanaDataType(param.dataType);
          const labels = {
            object: name,
            name: param.name,
          };

          const f = { name: param.id, type, labels };
          slice.addField(f);
        }

        for (const packet of packets || []) {
          slice.add(packet);
        }

        data.push(slice);
      }
    }

    return { data };
  }

  proxyApiUrl(path: string) {
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    return `${this.proxyUrl}/api/v1${path}`;
  }

  loadObjects() {
    if (objects.loaded) {
      return objects.all;
    }
    const only = ['name', 'group', 'model', 'description'];
    const url = this.proxyApiUrl(`objects?${qs({ only, withChildGroups: true })}`);
    const req = getBackendSrv().get(url);
    return objects.load(req);
  }

  loadModels() {
    if (models.loaded) {
      return models.all;
    }
    const only = ['name', 'data'];
    const url = this.proxyApiUrl(`models?${qs({ only, withChildGroups: true })}`);
    const req = getBackendSrv().get(url);
    return models.load(req);
  }

  async testDatasource() {
    const url = this.proxyApiUrl(`objects?${qs({ meta: 'count' })}`);
    try {
      await getBackendSrv().get(url);
      return {
        status: 'success',
        message: 'Success',
      };
    } catch (err: any) {
      console.error('.testDatasource error', err);

      let message = err?.data?.message ?? 'Error';
      if (err?.data?.helper?.message) {
        message = err.data.helper.message;
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}
