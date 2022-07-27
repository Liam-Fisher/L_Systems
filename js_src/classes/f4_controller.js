"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlling = void 0;
const controlling = function (Base) {
    return class Control extends Base {
        constructor(...args) {
            super(...args);
        }
        generate(systemID) {
            //turn generator instances into Workers???
            if (!this.createGenerator(systemID))
                return ['error', systemID];
            let systemStatus = this.generators.get(systemID).next();
            if (!systemStatus.done) {
                return [systemStatus.value, systemID];
            }
            this.systems.delete(systemID);
            if (!this.systems.size) {
                this.stream.end();
                return ['complete', this.id];
            }
            else {
                return ['active', [...this.systems.keys()][0]];
            }
        }
    };
};
exports.controlling = controlling;
