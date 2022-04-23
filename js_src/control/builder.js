"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = void 0;
const system_1 = require("../processing/system");
const routine_1 = require("../processing/routine");
class Build {
    static routines(lib) {
        let routineMap = new Map();
        for (const section in lib) {
            const routine = new routine_1.Routine();
            for (const routine_id in lib[section]) {
                routine.edit('add', routine_id, lib[section][routine_id]);
            }
            routineMap.set(section, routine);
        }
        return routineMap;
    }
    static globalCtx(tgt, spec, codes) {
        tgt.gCtx = {
            "letters": String.fromCodePoint(...(spec.constants.axiom.map(l => codes[l]))),
            "parameters": spec.constants.defaultParameters,
            "variables": spec.variables,
            "constants": spec.constants
        };
        return tgt;
    }
    static stageCtx(tgt) {
        tgt.sCtx = {
            "stage": 'idle',
            "index": 0,
            "indices": new Map(),
            "amounts": new Map()
        };
        return tgt;
    }
    static productionCtx(tgt) {
        tgt.pCtx = {
            "input": Build.init_Word,
            "output": Build.init_Word,
            "regex": '',
            "matches": [...String('').matchAll(/x/g)],
            "letters": new Map(),
            "parameters": new Map(),
            "conditions": [],
            "rewritten": new Set()
        };
        return tgt;
    }
    static interpretationCtx(tgt) {
        tgt.iCtx = {
            "input": Build.init_Word,
            "output": Build.init_Word,
            "messages": []
        };
        return tgt;
    }
    static system(spec, codes) {
        let sys = Build.globalCtx(new system_1.System(), spec, codes);
        return Build.interpretationCtx(Build.productionCtx(Build.stageCtx(sys)));
    }
    static systems(specs, codes) {
        let systemsMap = new Map();
        for (const id in specs) {
            systemsMap.set(id, Build.system(specs[id], codes));
        }
        ;
        return systemsMap;
    }
    ;
}
exports.Build = Build;
Build.init_Word = {
    "letters": "",
    "parameters": [[]]
};
