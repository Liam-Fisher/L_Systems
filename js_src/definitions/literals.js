"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regex = exports.regexpReserved = void 0;
// typical order:
// idle ->
// preCycle -> 
// generating -> 
// preProduction -> 
// matching -> | generating
// preWrite -> 
// rewriting 
// postWrite ->  | matching
// postProduction -> | generating
// postCycle ->
// parsing ->
// idle
// constants
exports.regexpReserved = [36, 42, 43, 46, 47, 63, 91, 92, 93, 94, 123, 124, 125];
exports.regex = {
    "cases": /\s(?=case\s\d+:)/g,
    "inds": /(?<=(case|return)\s)\d+/g,
    "args": /(?<=this.)[^,]+/g,
    "if": /(?<=if\(\().+(?=\)\))/g
};
