"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionFromTemplate = void 0;
;
;
;
;
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
        return `(${m.lOperator}${exprRecurse(m.lOperand)} ${m.bOperator} ${m.rOperator}${exprRecurse(m.rOperand)})`;
};
const conditionRecurse = function (condObj) {
    if ('if' in condObj)
        return ctrlStr(condObj);
    else if ('condition' in condObj)
        return `if(${exprRecurse(condObj.condition)})${blockStr(condObj)}`;
    else
        return blockStr(condObj);
};
const msgRecurse = function (msgObj) {
    if (typeof msgObj === 'string')
        return msgObj;
    else
        return `${msgObj?.prepend ?? ''}${msgObj.args.map(msg => msgRecurse(msg)).join(msgObj?.join ?? '')}${msgObj?.append ?? ''}`;
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
        return `${eqs.map(eq => `${eq.lOperand} ${eq.bOperator} ${exprRecurse(eq.rOperand)}`).join(';\n')};`;
};
const resultStr = function (msgs) {
    return `return ${msgs.map(re => msgRecurse(re)).join('')};\n`;
};
const blockStr = function (blockObj) {
    return ` { ${varsStr(blockObj.eqVars)}${eqsStr(blockObj.equations)}${varsStr(blockObj.msgVars)}${resultStr(blockObj.results)} }`;
};
const ctrlStr = function (flowObj) {
    return `${varsStr(flowObj.branchVars)}${conditionRecurse(flowObj.if)}
    else ${flowObj.else.map(b => conditionRecurse(b)).join('\nelse ')}`;
};
const functionFromTemplate = function (obj, name, runtime) {
    let args = ["sys", ...obj.args];
    let body = varsStr(obj.globalVars);
    if ('if' in obj.main)
        body += ctrlStr(obj.main);
    else
        body += blockStr(obj.main);
    if (runtime)
        this[name] = new Function(...args, body);
    else
        return `${name}(${args}) {
    ${body}
}`;
};
exports.functionFromTemplate = functionFromTemplate;
/*
const conditionRecurse = function (condObj: c_block | ctrlFlow | block, tgt?: 'if' | 'elif') {
    if ((tgt) && (tgt in condObj)) return conditionRecurse(condObj?.[tgt]);
    else if ('condition' in condObj) return `if(${exprRecurse(condObj.condition)})${blockStr(<block>condObj.block)}`
    else return blockStr(<block>condObj);
};
const ctrlStr = function (flowObj: ctrlFlow) {
    return `${conditionRecurse(flowObj.if, 'if')}
        ${flowObj.elif.map(b => '\nelse ' + conditionRecurse(b, 'elif')).join('')}
        ${flowObj?.else ? conditionRecurse(flowObj.else) : 'return;'}`;
};
*/ 
