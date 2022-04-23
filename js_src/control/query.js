"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const center_1 = require("./center");
class Query extends center_1.Control {
    constructor() {
        super();
    }
    query(tgt, ...args) {
        if ((typeof this?.[`query_${tgt}`] === 'function')) {
            return this[`query_${tgt}`](...args);
        }
        return ['ERROR', `target ${tgt} does not exist`];
    }
    query_ids(from) {
        return ['IDs', ...[...this.ids].slice(from ?? 0)];
    }
    query_system(id, prop) {
        let obj = new Object();
        let sys = this.processor.systems.get(id);
        let tgtObj = Object.create(sys)?.[prop];
        if (typeof tgtObj === 'function')
            return [`ERROR`, `${prop} is a method, not a property`];
        if (typeof tgtObj === 'string')
            return ["SYSTEM", this.processor.schemata.get(tgtObj)];
        if (typeof tgtObj === 'object') {
            for (const key in tgtObj) {
                let val = tgtObj[key];
                if (val instanceof Map)
                    obj[key] = Object.fromEntries(val);
                else if (val instanceof RegExp)
                    obj[key] = val.source;
                else if (val instanceof Set)
                    obj[key] = [...val];
                else
                    obj[key] = val;
            }
            return ["SYSTEM", obj];
        }
        return [`ERROR`, `${prop} does not exist`];
    }
}
exports.Query = Query;
