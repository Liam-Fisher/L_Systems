"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_schema = void 0;
const helper_1 = require("../helper");
const load_schema = async function (schemataID, tgtMap, codes) {
    let rewriterRegexps = [];
    let pRuleArray = [];
    let sObj = await require((0, helper_1.formatPath)(3, schemataID, 'templates', 'schemata'));
    console.log(`loaded schemata: ${schemataID}`);
    for await (const rule of sObj.rules) {
        rewriterRegexps.push(rule.syntax.replaceAll(/#(\d+)#/g, (...args) => String.fromCodePoint(codes[args[1]])));
        pRuleArray.push({
            "metric": rule?.metric,
            "maps": (rule?.maps ?? []),
            "successors": rule.successors.map(A => String.fromCodePoint(...A.map(B => codes[B])))
        });
    }
    tgtMap.set(schemataID, {
        "regex": RegExp(`(${rewriterRegexps.join(')|(')})`, 'g'),
        "hooks": sObj.hooks,
        "rules": pRuleArray,
        "interpretations": Object.fromEntries(codes.map((c, i) => [String.fromCodePoint(c), sObj.interpretations[i]]))
    });
};
exports.load_schema = load_schema;
