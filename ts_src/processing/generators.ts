import * as _f from '../definitions/formats';
import { Core } from './core';
export class Processor extends Core {
    constructor() {
        super();
    }
    *produce(id: string) {
        const sys = this.systems.get(id);
        if(!sys) console.log("ERROR with id: "+id);
        let schema = this.schemata.get(sys.gCtx.constants.schema);
        sys.sCtx.stage = 'generating';
        while (sys.update('generating')) {
            let rules = schema.productions;
            sys.sCtx.amounts.set('matching', rules.length);
            if (this.yields.activity[sys.sCtx.stage]) yield sys.sCtx.stage;
            this.routines.get('modifiers').callGroup(sys, schema.modifiers?.preProduction ?? []);
            if (sys.pCtx.conditions.length) yield sys.sCtx.stage;

            while (sys.update('matching')) {
                let rule = rules[sys.sCtx.index];
                console.log('predecessor: '+rule.predecessor);
                sys.pCtx.input.letters = this.decode(rule.predecessor);
                console.log('syntaxes: '+rule.syntaxes);
                console.log('numSyntaxes: '+rule.syntaxes.length);
                this.routines.get('syntaxes').callGroup(sys, rule.syntaxes, 1);
                console.log('conditions: '+sys.pCtx.conditions);
                console.log('numConditions: '+sys.pCtx.conditions.length);
                console.log('condition: '+sys.pCtx.conditions[0]);
                if (!sys.pCtx.conditions.length) continue;
                sys.match();
                this.routines.get('metrics').callGroup(sys, rule.metrics, 1);
                if (!sys.pCtx.conditions.length) continue;
                if (this.yields.activity.matching) yield sys.sCtx.stage;

                this.routines.get('modifiers').callGroup(sys, schema.modifiers?.preWrite ?? []);
                if (sys.pCtx.conditions.length) yield sys.sCtx.stage;

                    while (sys.update('rewriting')) {
                        console.log('rule: '+rule.maps);
                        this.routines.get('maps').callGroup(sys, rule.maps, 1);
                        console.log('rule: '+rule.maps);
                        console.log('numConditions: '+rule.maps.length);
                        if (!sys.pCtx.conditions.length) continue;
                        console.log('conditions: '+sys.pCtx.conditions);
                        console.log('condition: '+sys.pCtx.conditions[0]);
                        sys.pCtx.output.letters = this.decode(rule.successors[sys.pCtx.conditions[0]]);
                        sys.rewrite();
                        if (this.yields.activity.rewriting) yield sys.sCtx.stage;
                }
                this.routines.get('modifiers').callGroup(sys, schema.modifiers?.postWrite ?? []);
                if (sys.pCtx.conditions.length) yield sys.sCtx.stage;
            }
            if (sys.reset()) break;

            this.routines.get('modifiers').callGroup(sys, schema.modifiers?.postProduction ?? []);
            if (sys.pCtx.conditions.length) yield sys.sCtx.stage;
        }
        sys.sCtx.amounts.set('parsing', sys.gCtx.letters.length);
        sys.iCtx.messages = [];
        while (sys.update('parsing')) {
            sys.iCtx.input.letters = sys.gCtx.letters[sys.sCtx.index];// make this a syntax routine!
            sys.iCtx.input.parameters = [sys.gCtx.parameters[sys.sCtx.index]]; // make this a metric routine!
            let interp = schema.interpretations[this.encode(sys.iCtx.input.letters)];
            if(interp != 'ignore') this.routines.get('interpretations').callGroup(sys, [interp]);
            sys.iCtx.messages.forEach(msg => console.log(id+' '+msg));
            if ((sys.sCtx.index % this.yields.interpretRate) === 0) yield sys.sCtx.stage;
        }
        sys.sCtx.stage = 'idle';
        return sys.sCtx.stage;
    }
}