"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const helper_1 = require("../helper");
class Network {
    file;
    id;
    args;
    host;
    startMessages;
    endMessages;
    constructor(blueprint) {
        Object.assign(this, blueprint.patcher);
        if (this.host === 'window') {
            this.startMessages.push(`CONTROL load ${(0, helper_1.formatPath)(0, this.file)}`);
        }
    }
    static startMessages(inputs) {
        for (const fileType in inputs) {
            for (const fileDescriptor of inputs[fileType]) {
            }
        }
    }
}
exports.Network = Network;
