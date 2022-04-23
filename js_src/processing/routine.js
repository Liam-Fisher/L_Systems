"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routine = void 0;
class Routine {
    constructor() {
        this.titles = [];
        this.perform = Function('tgt', 'let args; switch(tgt) {  default: return; } ');
    }
    callGroup(sys, targets, maxCodes) {
        let out_codes = [];
        console.log("targets:" + targets);
        if (targets.length) {
            let callLimit = maxCodes ?? targets.length;
            let in_codes = targets.map(tgt => this.titles.indexOf(tgt));
            console.log("in_codes:" + in_codes);
            while ((in_codes.length) && (out_codes.length < callLimit)) {
                let out_code = this.perform.call(sys, in_codes.shift());
                console.log("out_code:" + out_code);
                out_codes.push(out_code);
            }
        }
        console.log("out_codes:" + out_codes);
        sys.pCtx.conditions = out_codes;
    }
    pack(a, c, e) {
        let argsIn = `[this.${a.join(', this.')}]`;
        let argsOut = argsIn.replace(/\?/g, '');
        let body = `case 0: `;
        body += `args = ${argsIn}; if((${c})){ `;
        body += `${e.join("; ")}; ${argsOut} = args; return 0;}`;
        return body;
    }
    add(cases, id, s, ind) {
        this.titles.splice(ind, 0, id);
        cases.splice(ind, 0, this.pack(s.args, s.condition, s.equations));
        return cases;
    }
    remove(cases, id, s, ind) {
        this.titles.splice(ind, 1);
        cases.splice(ind, 1);
        return cases;
    }
    edit(method, id, s, n) {
        let tgt = n ?? -1;
        let switchStatement = this.perform.toString().slice(26, -21);
        let cases = switchStatement.split(/\s(?=case\s\d+:)/g);
        cases.shift();
        cases = this[method](cases, id, s, tgt);
        let newCases = cases.map((str, ind) => {
            return (ind >= tgt) ? str.replace(/(?<=(case|return)\s)\d+/g, ind.toString()) : str;
        });
        let newBody = `let args; switch(tgt){ ${newCases.join(" ")} default: return; } `;
        //console.log('...New Function');
        // newBody.split(/;|{/g).forEach(line => console.log(line));
        this.perform = Function('tgt', newBody);
    }
    unpack(ind) {
        let cases = this.perform.toString().slice(26, -21).split(/\s(?=case\s\d+:)/g);
        cases.shift();
        let tgtCases = ind ? [cases[ind]] : cases;
        return tgtCases.map((caseStr, i) => {
            let argStart = caseStr.indexOf('[') + 1;
            let argEnd = caseStr.indexOf(';') - 1;
            let argStr = caseStr.slice(argStart, argEnd);
            let eqStart = caseStr.indexOf('{') + 1;
            let eqEnd = caseStr.indexOf('[this', eqStart);
            let eqStr = caseStr.slice(eqStart, eqEnd);
            return {
                "title": this.titles[i],
                "args": [...argStr.matchAll(/(?<=this.)[^,]+/g)].flat(),
                "condition": [...caseStr.matchAll(/(?<=if\(\().+(?=\)\))/g)].flat(),
                "equations": eqStr.split(';').map(str => str.trim()).slice(0, -1)
            };
        });
    }
}
exports.Routine = Routine;
