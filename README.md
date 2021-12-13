# ric-datasource

Grafana data source plugin for Rightech IoT platform
![Rightech IoT Explore](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/img/explore.png)

## Install
### Option 1 - Docker

```sh
> docker run -it -p 3000:3000 \
  -e "GF_INSTALL_PLUGINS=https://rightech.io/ric-datasource;ric-datasource" \
  grafana/grafana:8.3.1
```

### Option 2 - Archive

```sh
# download latest release
> wget https://github.com/Rightech/ric-datasource/releases/download/v3.1.27/rightech-ric-datasource-3.1.27.zip

# system installation
> unzip rightech-ric-datasource-3.1.27.zip -d /var/lib/grafana/plugins/

# binary installation
> unzip rightech-ric-datasource-3.1.27.zip -d ./data/plugins
```

Or docker installation:
```sh
> unzip rightech-ric-datasource-3.1.27.zip -d ./plugins
> docker run -it -p 3000:3000 \
  -v "$(pwd)"/plugins:/var/lib/grafana/plugins \
  grafana/grafana:8.3.1
```

## Setup

1. Go to [access tokens page](https://dev.rightech.io/#?m=admin&v=tokens) and issue token with scopes:
 - `GET /models/*`
 - `GET /objects/*`

![Rightech IoT Access Scopes](https://raw.githubusercontent.com/Rightech/ric-datasource/master/src/img/scopes.png)

2. Paste access token to `Token` config field

![Rightech IoT Token Config](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/img/config.png)
