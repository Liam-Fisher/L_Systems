"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
const f2_manager_1 = require("./f2_manager");
class Processor extends f2_manager_1.Manage {
    constructor(...args) {
        super(...args);
    }
    createGenerator(systemID) {
        if (!f2_manager_1.Manage.generators.has(systemID)) {
            let system = f2_manager_1.Manage.systems.get(systemID);
            if (!system)
                console.error(`systemID: ${systemID} generator failed, id does not exist`);
            let targetSchema = f2_manager_1.Manage.schemata.get(system.schema); // make this a schema
            if (!targetSchema)
                console.error(`systemID: ${systemID} generator failed, no schema: ${system.schema}`);
            if (system && targetSchema)
                f2_manager_1.Manage.generators.set(systemID, this.produce(system, targetSchema));
            else
                return false;
        }
        return true;
    }
    *produce(targetSystem, targetSchema) {
        // defs
        console.log('rewriting');
        const sys = targetSystem;
        const schema = targetSchema;
        sys.amounts.set('cycle', sys.maxGenerations);
        this.callGroup(sys, schema.hooks?.preCycle ?? []);
        while (sys.update('cycle')) {
            if (sys.letters.length > sys.maxLetters)
                break;
            else if (sys.status === 'active') {
                this.callGroup(sys, schema.hooks?.preProduction ?? []);
                this.replacer(sys, schema.regex, schema.rules);
                this.callGroup(sys, schema.hooks?.postProduction ?? []);
            }
            else
                yield sys.status;
        }
        this.callGroup(sys, schema.hooks?.postCycle ?? []);
        sys.globalStream.end();
        sys.status = 'complete';
        return sys.status;
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
            // add preMap hook
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
            // add postMap hook
            sys.tempParams.push(...(sys.outParams ?? sys.inParams));
            return tgtSuccessors[mapIndex];
        });
        sys.parameters = sys.tempParams;
    }
}
exports.Processor = Processor;
