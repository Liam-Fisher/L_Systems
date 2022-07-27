"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriting = void 0;
const rewriting = function (Base) {
    return class Rewriter extends Base {
        constructor(...args) {
            super();
        }
        replacer(sys, regex, rules) {
            let letters = sys.letters;
            sys.tempParams = [];
            sys.letters = letters.replaceAll(regex, (matchString, ...args) => {
                let sourceString;
                sys.update('production');
                sys.match = matchString;
                [sys.offset, sourceString] = args.splice(-2, 2);
                if (typeof sourceString === 'object')
                    sys.offset = args.pop();
                let rule = rules[args.findIndex(el => el)];
                sys.inParams = (this?.[rule?.metric]) ? this[rule.metric](sys) : sys.parameters.slice(sys.offset, sys.match.length);
                let mapIndex = 0;
                let tgtSuccessors = rule.successors ?? [sys.match];
                if (rule) {
                    let tgtMaps = rule?.maps.filter(el => typeof this?.[el] === 'function');
                    let maxIndex = Math.min(tgtMaps.length, tgtSuccessors.length);
                    while ((mapIndex < maxIndex)) {
                        sys.outParams = this[tgtMaps[mapIndex]](sys);
                        if (sys.outParams)
                            break;
                        else
                            mapIndex++;
                    }
                }
                sys.tempParams.push(...(sys.outParams ?? sys.inParams));
                return tgtSuccessors[mapIndex];
            });
            sys.parameters = sys.tempParams;
        }
    };
};
exports.rewriting = rewriting;
