"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experiment = void 0;
const routine_1 = require("../processing/routine");
class Experiment {
    constructor(codes) {
        this.alphabetCodes = codes;
        this.subroutines = new Map();
        this.contexts = new Map();
    }
    add(id, sub) {
        this.subroutines.set(id, sub);
        return Object.fromEntries(this.subroutines);
    }
    context(sys, ctx, typ, newVal) {
        if (typeof sys[ctx] !== 'function') {
            if (sys[ctx]?.[typ]) {
                let oldVal = sys[ctx][typ];
                if (oldVal instanceof Map)
                    sys[ctx][typ] = new Map(Object.entries(newVal));
                else
                    sys[ctx][typ] = newVal;
            }
            else
                return ['ERROR', `cannot find property ${typ} of context ${ctx}`];
        }
        else {
            return ['ERROR', `cannot set value of system method ${ctx}`];
        }
    }
    build() {
        let routine = new routine_1.Routine();
        this.subroutines.forEach((sub, id) => routine.edit('add', id, sub));
        let funcStr = routine.perform.toString().replace(/(?<=function)\s\w*(?=\(tgt)/g, ' currentTestRoutine');
        return `"use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.currentTestRoutine = void 0;
                ${funcStr};
                exports.currentTestRoutine = currentTestRoutine`;
    }
}
exports.Experiment = Experiment;
