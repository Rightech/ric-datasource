import React, { PureComponent } from 'react';
import { MultiSelect, InlineField } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { RicDataSourceOptions, RicQuery } from './types';
import { ArgumentNode, RicObject } from '@rightech/api';
import { getArgumentsOf } from 'util/store';

type Props = QueryEditorProps<DataSource, RicQuery, RicDataSourceOptions>;
type State = {
  objects: RicObject[];
  arguments: ArgumentNode[];

  selectedObjects: string[];
  selectedArguments: string[];
};

export class QueryEditor extends PureComponent<Props, State> {
  state: State = {
    objects: [],
    arguments: [],

    selectedObjects: this.props.query.objects || [],
    selectedArguments: this.props.query.arguments || [],
  };

  componentDidMount() {
    this.loadStore();

    (globalThis as any)['_oleg'] = this;
  }

  async loadStore() {
    const { onRunQuery } = this.props;
    const objects = await this.props.datasource.loadObjects();
    this.setState({ objects });

    await this.props.datasource.loadModels();

    if (this.state.selectedObjects?.length) {
      const _arguments = getArgumentsOf(this.state.selectedObjects);
      this.setState({ arguments: _arguments });
      onRunQuery();
    }
  }

  onObjectsChange = (values: SelectableValue<string>[]) => {
    const { onChange, query, onRunQuery } = this.props;
    const ids = values.map((x) => x.value!);

    const _arguments = getArgumentsOf(ids);
    this.setState({ arguments: _arguments });
    this.setState({ selectedObjects: ids });

    onChange({ ...query, objects: ids });
    onRunQuery();
  };

  onArgumentsChange = (values: SelectableValue<string>[]) => {
    const { onChange, query, onRunQuery } = this.props;
    const ids = values.map((x) => x.value!);
    this.setState({ selectedArguments: ids });

    onChange({ ...query, arguments: ids });
    onRunQuery();
  };

  getObjectsOptions = () => {
    return this.state.objects.map((o) => ({
      value: o._id,
      label: o.name,
      description: o.description,
    }));
  };

  getArgumentsOptions = () => {
    return this.state.arguments.map((x) => ({
      value: x.id,
      label: x.name,
    }));
  };

  render() {
    const { selectedObjects, selectedArguments } = this.state;

    return (
      <div>
        <div>
          <InlineField label="Objects" required tooltip="Not used yet">
            <MultiSelect
              menuShouldPortal
              options={this.getObjectsOptions()}
              value={selectedObjects}
              onChange={this.onObjectsChange}
            />
          </InlineField>
        </div>

        <div>
          <InlineField label="Arguments" tooltip="Not used yet">
            <MultiSelect
              menuShouldPortal
              options={this.getArgumentsOptions()}
              value={selectedArguments}
              onChange={this.onArgumentsChange}
            />
          </InlineField>
        </div>
      </div>
    );
  }
}
