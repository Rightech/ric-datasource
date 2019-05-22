# ric-datasource

The grafana datasource for receiving telemetry from the platform RighTech IoT

![Rightech IoT Cloud Dashboard](https://raw.githubusercontent.com/Rightech/ric-datasource/master/docs/Screenshot-01.png)

### Getting start

```
git clone https://github.com/Rightech/ric-datasource.git /var/lib/grafana/plugins/ric-datasource
```

### Add a new datasource

1. Open https://sandbox.rightech.io/auth
2. Auth by GitHub or Google
3. Create token https://sandbox.rightech.io/api-tokens
4. Create new a datasource `Rightech IoT platform` in Grafana
5. Enter your name, url `https://sandbox.rightech.io/api/v1/grafana` and token from step 3.
6. `Save and Test`
7. Import dashboard `Rightech IoT Telemetry` from tab `Dashboards`
8. Add test device in our account.
9. Try example mqtt publish

### Query

...description

#### Example mqtt publish

```
mosquitto_pub -h sandbox.rightech.io -i mqtt-xxxxxxxxx-8fmeyh -t base/state/temperature -m 27 -d
```

### Getting start dev

```
npm i
npm run build
docker-compose up -d
docker exec -it grafana-dev grafana-server restart # for reload grafana in container
> grafana-server restart
```
