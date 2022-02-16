import { ArgumentNode, Model, ModelNode, RicObject } from '@rightech/api';
import { filterNodes } from './misc';

const LOCAL_STORAGE_KEY = '_rightech-ric-datasource_';

export class Store<T = unknown> {
  loading = false;
  loaded = false;

  loadingPromise: any = null;

  idx: Record<string, T> = {};
  all: T[] = [];

  getById(id: string) {
    return this.idx[id];
  }

  add(items: T | T[]) {
    if (!Array.isArray(items)) {
      items = [items];
    }

    for (const item of items) {
      const i = item as any;
      const id = i._id || i.id || i.key;
      this.idx[id] = item;
      this.all.push(item);
    }
  }

  load(req: Promise<T[]>): Promise<T[]> {
    if (this.loading && this.loadingPromise) {
      return this.loadingPromise;
    }
    this.loadingPromise = this._load(req);
    return this.loadingPromise;
  }

  async _load(req: Promise<T[]>) {
    if (this.loaded || this.loading) {
      return this.all;
    }
    this.loading = true;
    const resp = await req;
    this.add(resp);

    this.loaded = true;
    this.loading = false;
    this.loadingPromise = null;

    return resp;
  }
}

export const params = new Store<{ _id: string; params: ArgumentNode[] }>();
export const objects = new Store<RicObject>();
export const models = new Store<Model>();

export function isArgumentNode(node: ModelNode): node is ArgumentNode {
  return node.type === 'argument';
}

function getOnlineNode(): ArgumentNode {
  return {
    active: true,
    dataType: 'boolean',
    type: 'argument',
    id: 'online',
    name: 'online',
  };
}

export function getArgumentsOf(ids: string[]): ArgumentNode[] {
  return ids.flatMap((objectId) => {
    const object = objects.getById(objectId);
    if (!object) {
      return [];
    }
    const model = models.getById(object.model);
    if (!model) {
      return [];
    }
    let xs = filterNodes<ArgumentNode>(model.data as any, (x) => isArgumentNode(x));

    if (!xs.find((x) => x.id === 'online')) {
      xs = [getOnlineNode(), ...xs];
    }

    return xs;
  });
}

export function localGet<T = unknown>(key: string, defaultValue: T): T {
  try {
    const val = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY}_${key}`) || 'null');
    if (val === null || val === undefined) {
      return defaultValue;
    }
    return val;
  } catch {
    return defaultValue;
  }
}

export function localSet<T = unknown>(key: string, val: T) {
  localStorage.setItem(`${LOCAL_STORAGE_KEY}_${key}`, JSON.stringify(val));
  return val;
}
