import * as _f from '../definitions/formats';
import {Processor} from '../processing/generators';
import {Build} from './builder';
import {System} from '../processing/system';
export function processorFromTemplate(src: _f.template) {
    let processor = new Processor();
    processor.alphabetCodes = src.metadata.alphabet;
    processor.yields = src.metadata.yields;
    processor.systems = Build.systems(src.specifications, src.metadata.alphabet);
    processor.schemata = new Map(Object.entries(src.schemata));
    processor.routines = Build.routines(src.library);
    return processor;
}
export function designContext(tgt: System, ctx: keyof System, typ: string, newVal: any[]) {
    if(typeof tgt[ctx] !== 'function') {
        if(tgt?.[typ]) {
            let oldVal = tgt[ctx][typ];
            if(oldVal instanceof Map) tgt[ctx][typ] = new Map(Object.entries(newVal));
            else tgt[ctx][typ] = newVal;
        }
        else return ['ERROR', `cannot find property ${typ} of context ${ctx}`];   
    }
    else {
        return ['ERROR', `cannot set value of system method ${ctx}`];
    }
}