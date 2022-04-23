import * as _f from '../definitions/formats';
import * as _i from '../definitions/interfaces';
import { System } from "../processing/system";
import { Routine } from "../processing/routine";

export class Build {
    static init_Word: _i.pWord = {
            "letters": "",
            "parameters": [[]]
        }
    static routines(lib: _f.library) {
        let routineMap = new Map();
        for (const section in lib) {
            const routine = new Routine();
                for (const routine_id in lib[section]) {
                 routine.edit('add', routine_id, lib[section][routine_id]);
    }
            routineMap.set(section, routine);
    }
        return routineMap;
}
    static globalCtx(tgt: System, spec: _f.Specification,codes: number[]): System {
        tgt.gCtx = {
            "letters": String.fromCodePoint(...(spec.constants.axiom.map(l => codes[l]))),
            "parameters": spec.constants.defaultParameters,
            "variables": spec.variables,
            "constants": spec.constants 
        };
        return tgt;
    }
    static stageCtx(tgt: System): System  {
        tgt.sCtx = {
            "stage": 'idle',
            "index": 0,
            "indices": new Map(),
            "amounts": new Map()
        };
        return tgt;
    }
    static productionCtx(tgt: System): System  {
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
    static interpretationCtx(tgt: System): System  {
        tgt.iCtx =  {
            "input": Build.init_Word,
            "output": Build.init_Word,
            "messages": []
        };
        return tgt;
    }
    static system(spec: _f.Specification, codes: number[]){
        let sys = Build.globalCtx(new System(), spec, codes);
        return Build.interpretationCtx(Build.productionCtx(Build.stageCtx(sys)));
    }
    static systems<Param, Var>(specs: _f.specifications, codes: number[]) {
        let systemsMap = new Map();
        for(const id in specs){
            systemsMap.set(id, Build.system(specs[id], codes));
        };
        return systemsMap;
        };
}