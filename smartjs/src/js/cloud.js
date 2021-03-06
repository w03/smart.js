"use strict";
global.Cloud = {
  backend: 'api.cesanta.com'
};

Cloud.mkreq = function(cmd, args, dst) {
  var ret = {v:1, src: Sys.id, dst: dst || "//" + Cloud.backend,
  key: Sys.psk || '', cmds:[{cmd:cmd, args: args}]};
  return JSON.stringify(ret);
}
Cloud.store = function(name,val,opts) {
  opts = opts || {};
  var b = opts.labels || {};
  b.__name__ = name;
  var args = {"vars": [[b, val]]};
  var d = this.mkreq("/v1/Metrics.Publish", args);
  delete b.__name__;
  args = b = null;
  Http.request({ hostname: Cloud.backend, method: "POST" },
               opts.cb || function() {}).end(d);
}

Cloud.init = function(backend, device_id, device_psk, opts) {
  var copts = $.extend({
    url: backend + ':80',
    src: device_id,
    key: device_psk,
  }, opts);
  global.clubby = new Clubby(copts);
  File.eval("fileservice.js");
  FileService(clubby);
}
