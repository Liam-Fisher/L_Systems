import * as _g from './generics';
//aliases
//  Literal unions
export type modificationStages = keyof _g.Modification<unknown>;
export type activity = 'idle'|'parsing'|keyof _g.Cycle<unknown>;
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
export const regexpReserved = [36,42,43,46,47,63,91,92,93,94,123,124,125];
export const regex = {
    "cases": /\s(?=case\s\d+:)/g, 
    "inds": /(?<=(case|return)\s)\d+/g,
    "args": /(?<=this.)[^,]+/g,
    "if": /(?<=if\(\().+(?=\)\))/g
};