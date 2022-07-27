
import { system_blueprint } from '../definitions/templates/blueprintSyntax';
import { Schema } from '../definitions/templates/schemaSyntax';
import { formatPath } from '../helpers/files';
import { SubroutineLoading } from './c2_subroutineLoader';
export const SchemaLoading = function <SourceClass extends ReturnType<typeof SubroutineLoading>>(Source: SourceClass) {
    return class SchemaLoader extends Source {
        static schemata: Map<string, Schema<'loaded'>> = new Map();
        static _has_schema(ID: string) {
            return this.schemata.has(ID);
        }
        static async load_rules(loadedSchema: Schema<'loaded'>, storedRules: Schema<'stored'>["rules"]) {
            let rewriterRegexps = [];
            for await (const rule of storedRules) {
                let maps = [];
                for await (const mapPath of rule.maps) {
                    let mapID = mapPath.split('_').pop();
                    await this.load_subroutine(mapPath, 'rules', 'maps');
                    if (!maps.includes(mapID)) maps.push(mapID);
                }
                loadedSchema.rules.push({
                    "metric": await this.load_subroutine(rule?.metric, 'rules', 'metrics'),
                    "maps": maps,
                    "successors": rule.successors.map(s => this.decode(...this.lookup(...s)))
                });
                rewriterRegexps.push(rule.syntax.replaceAll(/#(\d+)#/g, (...args) => this.decode(...this.lookup(args[1]))));
            };
            loadedSchema.regex = RegExp(`(${rewriterRegexps.join(')|(')})`, 'g');
        }

        static async load_hooks(loadedSchema: Schema<'loaded'>, storedHooks: Schema<'stored'>["hooks"]) {
            for await (const [triggerA, obj] of Object.entries(storedHooks)) { //pre post on
                for await (const [triggerB, arr] of Object.entries(obj)) { // cycle/production/interpretation
                    for await (const hook of arr) {
                        await this.load_subroutine(hook, 'hooks', triggerA, triggerB);
                        let hookID = hook.split('_').pop();
                        let hooks = loadedSchema.hooks?.[`${triggerA}_${triggerB}`];
                        if (!hooks) hooks = [hookID];
                        if (!hooks.includes(hookID)) hooks.push(hookID);
                        loadedSchema.hooks[`${triggerA}_${triggerB}`] = hooks;
                    }
                }
            }
        }

        static async load_interpretations(
            loadedSchemaTemplate: Schema<'loaded'>,
            storedInterpretations: Schema<'stored'>["interpretations"],
            ...storedStreams: system_blueprint["outputs"]["text"]) {
            for await (const [stm, fSetArr] of Object.entries(storedInterpretations)) {
                let target = storedStreams?.[stm]?.filename;
                if (target) {
                    let fSetObj = {};
                    for await (const [index, letterGroup] of Object.entries(fSetArr)) {
                        let letter = this.decode(...this.indexed(+index));
                        if (letter) {
                            let letters = [];
                            for await (const ID of letterGroup) {
                                await this.load_subroutine(ID, 'interpretations');
                                let name = ID.split('_').pop();
                                if (!letters.includes(name)) letters.push(name);
                            };
                            fSetObj[letter] = letters;
                        }
                    }
                    loadedSchemaTemplate[target] = fSetObj;
                }
            }
        }
        static async load_schema(ID: string, ...streams: system_blueprint["outputs"]["text"]) {
            if (this._has_schema(ID)) return;
            let stored: Schema<'stored'> = await require(formatPath(3, ID, 'json', 'data', 'templates', 'schemata'));
            let loaded: Schema<'loaded'> = { "rules": [], "hooks": {}, "interpretations": {} };
            await this.load_rules(loaded, stored.rules);
            await this.load_hooks(loaded, stored.hooks);
            await this.load_interpretations(loaded, stored.interpretations, ...streams);
            return this.schemata.set(ID, loaded);
        }
    }
};