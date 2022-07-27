"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionFromTemplate = void 0;
const arrayRecurse = function (m) {
    if (m instanceof Array)
        return `[${arrayRecurse(m).join()}]`;
    else
        return m;
};
const exprRecurse = function (m) {
    if (typeof m !== 'object')
        return m;
    else if (m instanceof Array)
        return arrayRecurse(m);
    else
        return `(${exprRecurse(m.lOperand)} ${m.bOperator} ${exprRecurse(m.rOperand)})`;
};
const conditionRecurse = function (condObj) {
    if ('if' in condObj)
        return ctrlStr(condObj);
    else if ('condition' in condObj)
        return `if(${exprRecurse(condObj.condition)})${blockStr(condObj)}`;
    else
        return blockStr(condObj);
};
const varsStr = function (decs) {
    if (!decs.length)
        return ``;
    else
        return `\nlet ${decs.map(dec => `${dec.varname} = ${exprRecurse(dec.initval)}`).join(';\nlet ')};\n`;
};
const eqsStr = function (eqs) {
    if (!eqs.length)
        return ``;
    else
        return `${eqs.map(eq => `${exprRecurse(eq)}`).join(';\n')};`;
};
const blockStr = function (blockObj) {
    return ` { ${varsStr(blockObj.eqVars)}${eqsStr(blockObj.equations)}${varsStr(blockObj.msgVars)}
    return [${blockObj.returns.join(',\n')}];}`;
};
const ctrlStr = function (flowObj) {
    return `${varsStr(flowObj.branchVars)}${conditionRecurse(flowObj.if)}
    else ${flowObj.else.map(b => conditionRecurse(b)).join('\nelse ')}`;
};
const functionFromTemplate = function (obj, name) {
    let body = ('if' in obj) ? ctrlStr(obj) : blockStr(obj);
    if (!name)
        return ['sys', body];
    else
        return `${name}(sys) {${body}}`;
};
exports.functionFromTemplate = functionFromTemplate;
