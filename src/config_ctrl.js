
const RIC_SANDBOX = 'https://sandbox.rightech.io/api/v1/grafana';

class ConfigCtrl {
  constructor($scope, $injector, $q, backendSrv, alertSrv, contextSrv, datasourceSrv) {
    this.suggestUrl = RIC_SANDBOX;
    this.$q = $q;
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.validKey = false;
    this.quotas = {};
    $scope.getSuggestUrls = () => {
      return [RIC_SANDBOX];
    };
  }

  onTokenChange() {
    this.current.jsonData = this.current.jsonData || {};
    this.current.secureJsonData = this.current.secureJsonData || {};

    this.current.jsonData.httpHeaderName1 = 'Authorization';
    this.current.secureJsonData.httpHeaderValue1 = `Bearer ${this.token}`;
  }

}

ConfigCtrl.templateUrl = 'partials/config.html';

export default ConfigCtrl
