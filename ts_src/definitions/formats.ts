import * as _i  from "./interfaces";
import * as _g from "./generics";
import * as _l from "./literals";
export interface Schema {
    modifiers: _g.Modification<string[]>;
    productions: (_i.letterPath & _i.productionPath)[];
    interpretations: string[];
};
export interface Specification {
    constants: _i.constants;
    variables: _g.Obj<number>;
};
export interface metadata {
    alphabet: number[];
    yields: _i.breakpoints;
};
export type library = _g.Obj<_g.Obj<_i.subroutine>>; 
export type schemata = _g.Obj<Schema>; 
export type specifications =  _g.Obj<Specification>;
export interface template {
    metadata: metadata;
    schemata: schemata;
    specifications: specifications;
    library: library;
};
//system property definitions
//
export interface globalContext extends Specification, _i.pWord {}
export type stageContext = _g.Count<_l.activity>;
export interface wordContext {
    input: _i.pWord;
    output: _i.pWord;
}
export interface interpretationContext extends wordContext {
    messages: string[];
}
export interface productionContext extends wordContext,_g.Track<_i.pWord> {
    regex: string;
    matches: RegExpMatchArray[];
    conditions: number[];
    rewritten: Set<number>;
}