"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_system = void 0;
const system_1 = require("../classes/system");
const helper_1 = require("../helper");
const load_system = async function (system, systemMap, codes) {
    let templateObj = await require((0, helper_1.formatPath)(3, systemID, 'templates', 'systems', 'states'));
    let sys = new system_1.System(templateObj, codes);
    systemMap.set(systemID, subsys);
    return subsys;
};
exports.load_system = load_system;
