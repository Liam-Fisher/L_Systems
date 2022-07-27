import * as _l from '../static/literals';
import {el, json_el} from '../static/generics'
import {systemData} from '../static/interfaces'
interface typedOP<T, binaryOps> {
    lOperand: T extends [unknown, unknown] ? T[0] : T;
    bOperator: binaryOps;
    rOperand: T extends [unknown, unknown] ? T[1] : T;
}
export type opExpr<T, b> = typedOP<T | typedOP<T, b>, b>;
export interface valExpr extends opExpr<json_el | valExpr, _l.mathOps> { };
export type compExpr = typedOP<el, _l.eqOps>;
export interface logExpr extends opExpr<string | compExpr | logExpr, _l.boolOps> { };
export type eqExpr = opExpr<[string, valExpr], _l.assignOps>;

export type exprs = valExpr | eqExpr | compExpr | logExpr;

export interface declaration {
    varname: string;
    initval: (valExpr | json_el)
}

export interface block {
    condition?: logExpr | string;
    eqVars: declaration[];
    equations: eqExpr[];
    msgVars: declaration[];
    returns: string[];
}
export interface ctrlFlow {
    branchVars: declaration[];
    if: (block | ctrlFlow) | (block & ctrlFlow);
    else: (block | ctrlFlow)[] | (block & ctrlFlow)[];
}
export type subroutineTemplate = ctrlFlow | block;
export type subroutineFiles = systemData<Set<string>>["templates"]["subroutines"];