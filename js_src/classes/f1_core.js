"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
class Core {
    static codes = [];
    static ctors = new Map();
    //static regexSpecial = [33, 36, 40, 41, 42, 43, 47, 63, 91, 92, 93, 94, 123, 124, 125];
    constructor() {
    }
    static defineCodes(...codes) {
        codes.forEach(code => Core.codes.includes(code) ? Core.codes.push(code) : '');
    }
    //regexSafe(expression: string){}
    static decode(...codes) {
        return String.fromCodePoint(...codes);
    }
    static encode(word) {
        return Array.from(word).map(letter => letter.codePointAt(0));
    }
    static lookup(...indices) {
        return indices.map(index => this.codes[index]).filter(code => code);
    }
    static indexed(...codes) {
        return codes.map(code => this.codes.indexOf(code)).filter(index => index !== -1);
    }
    buildObj(obj) {
        switch (obj.ctor) {
            case "Object":
                this[obj.id] = Object.create(obj.args);
                break;
            case "Buffer":
                this[obj.id] = Buffer.alloc(obj.args);
                break;
            default:
                if (Core.ctors.has(obj.ctor))
                    this[obj.id] = new (Core.ctors.get(obj.ctor))(obj.args);
        }
    }
    callGroup(tgt, methods) {
        let activeMethods = methods.filter(tgt => typeof this?.[tgt] === 'function');
        return activeMethods.map(m => this[m](tgt)).filter(el => el);
    }
}
exports.Core = Core;
