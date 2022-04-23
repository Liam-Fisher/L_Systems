"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core = void 0;
const literals_1 = require("../definitions/literals");
class Core {
    constructor() {
    }
    encode(char) {
        return this.alphabetCodes.indexOf(char.codePointAt(0));
    }
    decode(coded) {
        let codes = coded.map(l => this.alphabetCodes[l]);
        let escaped = codes.map((i) => literals_1.regexpReserved.includes(i) ? [92, i] : i).flat();
        return String.fromCodePoint(...escaped);
    }
}
exports.Core = Core;
