import {Cycle, Modification} from './generics';
// defined interfaces
type indexWord = number[]; 
export type dataTypes = {
    message: string[];
    parameter: number[][];
    variable: number;
}
export type codex = {
    decoder?: number[]|Map<number, string>;
    encoder: string[]|Map<string, number>;
};

export interface letterPath {
    predecessor: indexWord;
    successors: indexWord[];
}
export interface pWord/*<Parameter>*/ {
    letters: string;
    parameters: number[][];
}
export interface productionPath {
    syntaxes: string[];
    metrics: string[];
    maps: string[];
}
export interface subroutine {
    args: string[];
    condition: string;
    equations: string[];
}
export interface breakpoints {
    activity:  Cycle<boolean>;
    modification:  Modification<boolean>;
    interpretRate: number;
};
// optional interfaces

export interface constants/*<Parameter>*/ { // system constants
    axiom: indexWord;
    defaultParameters: number[][];
    schema: string,
    lifespan?: number;
    letterLimit?: number;
}