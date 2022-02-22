import { FieldType } from '@grafana/data';
import { ArgumentDataType, ItemId, RicObject } from '@rightech/api';

export function qs(qs: Record<string, any>) {
  const params = new URLSearchParams();

  for (const [k, v] of Object.entries(qs || {})) {
    params.append(k, (v || '').toString());
  }

  return params.toString();
}

export function toGrafanaDataType(dataType: ArgumentDataType) {
  if (dataType === 'number') {
    return FieldType.number;
  }
  if (dataType === 'boolean') {
    return FieldType.boolean;
  }
  if (dataType === 'string') {
    return FieldType.string;
  }
  return FieldType.other;
}

function walkFilter<T>(child: T, callback: any, result: T[]) {
  if (callback(child)) {
    result.push(child);
  }

  const children = (child && (child as any).children) || [];
  for (const child of children) {
    walkFilter(child, callback, result);
  }
}

export function filterNodes<T>(node: T, filter: (n: T) => boolean = () => true) {
  const result = [] as T[];
  walkFilter(node, filter, result);
  return result;
}

type ObjectLink = { id: ItemId };
type ObjectWithLinks = RicObject & { links: Record<string, ObjectLink[]> };

export function processingEnabled(object: ObjectWithLinks) {
  const hasActions = !!object?.links?.actions?.length;
  const hasHandlers = !!object?.links?.handlers?.length;

  return hasActions || hasHandlers;
}
