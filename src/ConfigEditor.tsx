import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms, CollapsableSection, InlineField, Select } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { RicDataSourceOptions, RicSecureJsonData } from './types';
import { localGet, localSet } from './util/store';

// @ts-ignore
import scopesImageUrl from './img/scopes.png';

const { SecretFormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<RicDataSourceOptions> {}

interface State {
  baseUrl: string;
}

const defaultBaseUrlOptions = [
  { value: 'https://dev.rightech.io/', label: 'Public: https://dev.rightech.io/' },
  { value: 'https://sandbox.rightech.io/', label: 'Sandbox: https://sandbox.rightech.io/' },
];

export class ConfigEditor extends PureComponent<Props, State> {
  state: State = {
    baseUrl: this.props.options?.jsonData?.baseUrl || '',
  };

  componentDidMount() {
    let baseUrl = this.props.options?.jsonData?.baseUrl;
    if (!baseUrl) {
      baseUrl = defaultBaseUrlOptions[0].value;
      this.onBaseUrlChange(baseUrl);
    }
  }

  onBaseUrlChange = (custom: string) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      baseUrl: custom,
    };
    this.setState({ baseUrl: custom });
    onOptionsChange({ ...options, jsonData });
  };

  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        token: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        token: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        token: '',
      },
    });
  };

  getBaseUrlOptions() {
    let { baseUrl } = this.state;
    const opts = [...defaultBaseUrlOptions];

    if (baseUrl && !opts.some((x) => x.value === baseUrl)) {
      opts.push({ label: baseUrl, value: baseUrl });
    }
    return opts;
  }

  getTokensPageUrl() {
    let { baseUrl } = this.state;
    if (!baseUrl) {
      return null;
    }
    if (!baseUrl.startsWith('http')) {
      baseUrl = `http://${baseUrl}`;
    }
    console.log('baseUrl', baseUrl);
    return new URL('/#?m=admin&v=tokens', baseUrl);
  }

  render() {
    const { baseUrl } = this.state;
    const { options } = this.props;
    const { secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as RicSecureJsonData;

    const href = this.getTokensPageUrl();

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <InlineField label="Base URL" labelWidth={12}>
            <Select
              width={40}
              options={this.getBaseUrlOptions()}
              allowCustomValue
              value={baseUrl || ''}
              onChange={({ value }) => this.onBaseUrlChange(value!)}
              onCreateOption={(customValue) => {
                this.onBaseUrlChange(customValue);
              }}
            />
          </InlineField>
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={(secureJsonFields && secureJsonFields.token) as boolean}
              value={secureJsonData.token || ''}
              label="Token"
              placeholder="Paste access token here"
              labelWidth={6}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
        </div>

        <div>
          <CollapsableSection
            label="Issue access token"
            isOpen={localGet('issue token toggle', true)}
            onToggle={(flag) => localSet('issue token toggle', flag)}
          >
            <div style={{ marginBottom: 10 }}>
              Go to
              <a
                href={href?.toString()}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgb(110, 159, 255)', margin: 5 }}
              >
                {href?.toString()}
              </a>
              and issue API token with scopes:
              <ul style={{ marginLeft: 40 }}>
                <li>
                  <code>GET /models/*</code>
                </li>
                <li>
                  <code>GET /objects/*</code>
                </li>
              </ul>
            </div>

            <img src={scopesImageUrl} style={{ width: 640 }} />
          </CollapsableSection>
        </div>
      </div>
    );
  }
}
