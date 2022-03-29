# ric-datasource

Grafana data source plugin for Rightech IoT platform
![Rightech IoT Explore](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/img/explore.png)

## Install
### Option 1 - Docker

```sh
> docker run -it -p 3000:3000 \
  -e "GF_INSTALL_PLUGINS=https://rightech.io/ric-datasource;rightech-ric-datasource" \
  grafana/grafana:8.4.4
```

[https://rightech.io/ric-datasource](https://rightech.io/ric-datasource) is a short link for latest release archive from [releases page](https://github.com/Rightech/ric-datasource/releases)

### Option 2 - Archive

```sh
# download latest release
> wget https://github.com/Rightech/ric-datasource/releases/download/v3.1.32/rightech-ric-datasource-3.1.32.zip

# system installation
> unzip rightech-ric-datasource-3.1.32.zip -d /var/lib/grafana/plugins

# binary installation
> unzip rightech-ric-datasource-3.1.32.zip -d ./data/plugins
```

Or docker installation:
```sh
> unzip rightech-ric-datasource-3.1.32.zip -d ./plugins
> docker run -it -p 3000:3000 \
  -v "$(pwd)"/plugins:/var/lib/grafana/plugins \
  grafana/grafana:8.4.4
```

### Option 3 - CLI

```sh
> grafana-cli --pluginUrl https://rightech.io/ric-datasource plugins install rightech-ric-datasource
```

## Setup

1. Go to [access tokens page](https://dev.rightech.io/#?m=admin&v=tokens) and issue token with scopes:
 - `GET /models/*`
 - `GET /objects/*`

![Rightech IoT Access Scopes](https://raw.githubusercontent.com/Rightech/ric-datasource/master/src/img/scopes.png)

2. Paste access token to `Token` config field

![Rightech IoT Token Config](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/img/config.png)


## Development

```
> npm start
> docker run -it -p 3000:3000 \
  -e GF_APP_MODE=development \
  -e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=rightech-ric-datasource \
  -v "$(pwd)"/dist:/var/lib/grafana/plugins/rightech-ric-datasource \
  --name=grafana grafana/grafana:8.4.4
```
