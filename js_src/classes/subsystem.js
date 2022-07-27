"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubSystem = void 0;
const initializers_1 = require("../builders/initializers");
class SubSystem {
    letters;
    parameters;
    vars;
    productionSchema;
    lifespan;
    letterLimit;
    index;
    section;
    status;
    indices;
    amounts;
    match;
    offset;
    inParams;
    outParams;
    tempParams;
    constructor(templateObj, codes) {
        this.letters = String.fromCodePoint(...(templateObj.letters.map(l => codes[l])));
        delete templateObj.letters;
        Object.assign(this, templateObj, (0, initializers_1.subsystemDefaults)());
        this.amounts.set('cycle', this.lifespan);
    }
    update(section) {
        this.section = section;
        this.index = this.indices.get(section) ?? -1;
        if (++this.index === this.amounts.get(section)) {
            this.indices.delete(section);
            return false;
        }
        else {
            this.indices.set(section, this.index);
            return true;
        }
    }
}
exports.SubSystem = SubSystem;
