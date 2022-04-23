import * as _ from '../definitions/interfaces';
import {Routine} from '../processing/routine';
import {System} from '..//processing/system';
export class Experiment {
    alphabetCodes: number[];
    subroutines: Map<string, _.subroutine>;
    contexts: Map<string, Map<string, any[]>>
    constructor(codes: number[]) {
        this.alphabetCodes = codes;        
        this.subroutines = new Map();
        this.contexts = new Map();
    }
    add(id: string, sub: _.subroutine){
        this.subroutines.set(id, sub);
        return Object.fromEntries(this.subroutines)
    }
    context(sys: System, ctx: keyof System, typ: string, newVal: any[]){
        if(typeof sys[ctx] !== 'function') {
            if(sys[ctx]?.[typ]) {
                let oldVal = sys[ctx][typ];
                if(oldVal instanceof Map) sys[ctx][typ] = new Map(Object.entries(newVal));
                else sys[ctx][typ] = newVal;
            }
            else return ['ERROR', `cannot find property ${typ} of context ${ctx}`];   
        }
        else {
            return ['ERROR', `cannot set value of system method ${ctx}`];
        }
    }
    build() {
        let routine = new Routine();
        this.subroutines.forEach((sub, id) => routine.edit('add',id,sub));
        let funcStr = routine.perform.toString().replace(/(?<=function)\s\w*(?=\(tgt)/g, ' currentTestRoutine');
        return `"use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.currentTestRoutine = void 0;
                ${funcStr};
                exports.currentTestRoutine = currentTestRoutine`;
    }
}