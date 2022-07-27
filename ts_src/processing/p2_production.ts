import {BlueprintLoading} from '../loaders/c6_blueprintLoader';
import {CoreProcessing} from './p1_core';
import {System} from '../classes/system';
import {Rule, Schema} from '../definitions/templates/schemaSyntax';
export const ProductionProcessing = 
function<SourceClass extends ReturnType<typeof BlueprintLoading>&ReturnType<typeof CoreProcessing>>(Source: SourceClass) {
    return class ProductionProcessor extends Source {
    constructor(...args: any[]) {
        super();
    }
    *cycle( sys: System, schema: Schema<'loaded'>) {
        sys.amounts.set('cycle', sys?.maxGenerations ?? Number.MAX_SAFE_INTEGER);
        this.callGroup(sys, ...schema.hooks?.pre_cycle);
        while (sys.update('cycle')) {
            if(sys.letters.length > sys?.maxLetters ?? Number.MAX_SAFE_INTEGER) break; 
            else if(sys.status === 'active') {
            this.callGroup(sys, ...schema.hooks?.pre_production);
            this.replacer(sys, schema.regex, schema.rules);
            this.callGroup(sys, ...schema.hooks?.post_production);
            }
            else yield sys.status;
        }
        this.callGroup(sys, ...schema.hooks?.post_cycle);
        return sys.status;
    }
    replacer(sys: System, regex: RegExp, rules: Rule<'loaded'>[]) {
        let letters = sys.letters;
        sys.tempParams = [];
        sys.letters = letters.replaceAll(regex, (matchString, ...args) => {
        let sourceString;
        sys.update('production');
        sys.match = matchString;
        [sys.offset, sourceString] = args.splice(-2, 2);
        if(typeof sourceString === 'object') sys.offset = args.pop();
        let rule = rules[args.findIndex(el => el)]; 
        sys.inParams = (this?.[rule?.metric]) ? this[rule.metric](sys) : sys.parameters.slice(sys.offset, sys.match.length);
        let mapIndex = 0;
        let tgtSuccessors = rule.successors ?? [sys.match];
        // add preMap hook
        if (rule) {
            let tgtMaps = rule?.maps.filter(el => typeof this?.[el] === 'function');
            let maxIndex = Math.min(tgtMaps.length, tgtSuccessors.length);
            while ((mapIndex < maxIndex)) {
                    sys.outParams = this[tgtMaps[mapIndex]](sys);
                    if(sys.outParams) break;
                    else mapIndex++;
            }
        }
        // add postMap hook
        sys.tempParams.push(...(sys.outParams ?? sys.inParams));
        return tgtSuccessors[mapIndex];
    });
    sys.parameters = sys.tempParams;
}
}
}
