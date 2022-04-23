"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.designContext = exports.processorFromTemplate = void 0;
const generators_1 = require("../processing/generators");
const builder_1 = require("./builder");
function processorFromTemplate(src) {
    let processor = new generators_1.Processor();
    processor.alphabetCodes = src.metadata.alphabet;
    processor.yields = src.metadata.yields;
    processor.systems = builder_1.Build.systems(src.specifications, src.metadata.alphabet);
    processor.schemata = new Map(Object.entries(src.schemata));
    processor.routines = builder_1.Build.routines(src.library);
    return processor;
}
exports.processorFromTemplate = processorFromTemplate;
function designContext(tgt, ctx, typ, newVal) {
    if (typeof tgt[ctx] !== 'function') {
        if (tgt?.[typ]) {
            let oldVal = tgt[ctx][typ];
            if (oldVal instanceof Map)
                tgt[ctx][typ] = new Map(Object.entries(newVal));
            else
                tgt[ctx][typ] = newVal;
        }
        else
            return ['ERROR', `cannot find property ${typ} of context ${ctx}`];
    }
    else {
        return ['ERROR', `cannot set value of system method ${ctx}`];
    }
}
exports.designContext = designContext;
