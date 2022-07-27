import * as _l from '../definitions/static/literals';

import {json_el }from '../definitions/static/generics';
import * as _s from '../definitions/templates/subroutineSyntax';
import { cwd } from 'process';
import { join } from 'path';
export const formatPath = function(depth: number, ext: string, filename: string, ...categories: string[]){
        return `${join(cwd(),'../'.repeat(depth), ...categories.concat(filename.replaceAll('_','/')))}.${ext}`;
};
const arrayRecurse = function (m: json_el) {
    if (m instanceof Array) return `[${arrayRecurse(m).join()}]`;
    else return m;
}
const exprRecurse = function (m: _s.exprs | json_el) {
    if (typeof m !== 'object') return m;
    else if (m instanceof Array) return arrayRecurse(m);
    else return `(${exprRecurse(m.lOperand)} ${m.bOperator} ${exprRecurse(m.rOperand)})`;
};
const conditionRecurse = function (condObj: _s.ctrlFlow | _s.block) {
    if ('if' in condObj) return ctrlStr(condObj);
    else if ('condition' in condObj) return `if(${exprRecurse(condObj.condition)})${blockStr(condObj)}`
    else return blockStr(condObj);
};

const varsStr = function (decs: _s.declaration[]) {
    if(!decs.length) return ``;
    else return `\nlet ${decs.map(dec => `${dec.varname} = ${exprRecurse(dec.initval)}`).join(';\nlet ')};\n`;
};
const eqsStr = function (eqs: _s.eqExpr[]){
    if(!eqs.length) return ``;
    else return `${eqs.map(eq => `${exprRecurse(eq)}`).join(';\n')};`;
};

const blockStr = function (blockObj: _s.block) {
    return ` { ${varsStr(blockObj.eqVars)}${eqsStr(blockObj.equations)}${varsStr(blockObj.msgVars)}
    return [${blockObj.returns.join(',\n')}];}`;
};
const ctrlStr = function (flowObj: _s.ctrlFlow) {
    return `${varsStr(flowObj.branchVars)}${conditionRecurse(flowObj.if)}
    else ${flowObj.else.map(b => conditionRecurse(b)).join('\nelse ')}`;
};

export const functionFromTemplate = function (obj: _s.subroutineTemplate, name?: string) {
    let body = ('if' in obj) ? ctrlStr(obj) : blockStr(obj);
    if (!name) return ['sys', body];
    else return `${name}(sys) {${body}}`
};