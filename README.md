# ric-datasource

Grafana data source plugin for Rightech IoT platform
![Rightech IoT Explore](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/img/explore.png)

## setup

1. Go to [access tokens page](https://dev.rightech.io/#?m=admin&v=tokens) and issue token with scopes:
 - `GET /models/*`
 - `GET /objects/*`

![Rightech IoT Access Scopes](https://raw.githubusercontent.com/Rightech/ric-datasource/master/src/img/scopes.png)

2. Paste access token to `Token` config field

![Rightech IoT Token Config](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/img/config.png)
