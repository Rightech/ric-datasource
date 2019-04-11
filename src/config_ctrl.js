class ConfigCtrl {
  constructor($scope, $injector, $q, backendSrv, alertSrv, contextSrv, datasourceSrv) {
    this.$q = $q;
    this.backendSrv = backendSrv;
    this.alertSrv = alertSrv;
    this.validKey = false;
    this.quotas = {};
    // this.appEditCtrl.setPreUpdateHook(this.preUpdate.bind(this));
    console.warn('this.appEditCtrl', this.appEditCtrl)
    // this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
    this.org = null;
    // this.datasourceUpgrader = new DatasourceUpgrader(contextSrv, backendSrv, $q, datasourceSrv);
  }

  // preUpdate() {
  //   return this.$q.resolve();
  // }

  // postUpdate() {
  //   if (!this.appModel.enabled) {
  //     return this.$q.resolve();
  //   }
  //   var self = this;
  //   return this.validateKey()
  //   .then(() => {
  //     return self.datasourceUpgrader.upgrade().then(() => {
  //       self.appEditCtrl.importDashboards().then(() => {
  //         return {
  //           url: "dashboard/db/telemetry",
  //           message: "telemetry dashboard added!"
  //         };
  //       });
  //     });
  //   });
  // }
}

ConfigCtrl.templateUrl = 'partials/config.html';

export default ConfigCtrl
