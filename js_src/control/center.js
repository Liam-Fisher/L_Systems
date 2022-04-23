"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = void 0;
const construction_1 = require("./construction");
class Control {
    constructor() {
    }
    init(src) {
        this.processor = (0, construction_1.processorFromTemplate)(src);
        this.ids = new Set([...this.processor.systems.keys()]);
        this.systemGenerators = new Map();
    }
    generate(id) {
        if (!this.systemGenerators.has(id)) {
            let pGen = this.processor.produce(id);
            this.systemGenerators.set(id, pGen);
            return ['BEGIN', id];
        }
        else {
            let pVal = this.systemGenerators.get(id).next().value;
            if (pVal === 'idle')
                return ['END', id];
            else
                return ['NEXT', pVal, id];
        }
    }
    handle(method, ...args) {
        if (!this?.[method])
            return ['ERROR', `method ${method} does not exist`];
        if (args.length === 0)
            return this[method]();
        if ((typeof args[0] === 'string') && (!this.ids.has(args[0])))
            return ['ERROR', `id ${args[0]} does not exist`];
        return this[method](...args);
    }
}
exports.Control = Control;
