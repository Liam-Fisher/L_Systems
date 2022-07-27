const MaxAPI = require("max-api");
const {load_class } = require('./js_src/helpers/loader');
const cwd = require('process').cwd;
const join = require('path').join;
let sysCtrl;
MaxAPI.outlet('path', join(cwd(),`../`));
const handlers = {
     load_all: async (filepath) => {

          sysCtrl = await io.load_all(filepath);
          await MaxAPI.outlet("active", [...sysCtrl.systems.keys()][0]);
     },
     generate: async (ID) => {
               let results  = sysCtrl.generate(ID);
               await MaxAPI.outlet(results[0],results[1]);
     }
};
MaxAPI.addHandlers(handlers);
