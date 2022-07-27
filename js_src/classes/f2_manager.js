"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manage = void 0;
const system_1 = require("./system");
const helper_1 = require("../helper");
const subroutine_1 = require("../helpers/subroutine");
const f1_core_1 = require("./f1_core");
class Manage extends f1_core_1.Core {
    static schemata = new Map();
    static systems = new Map();
    static generators = new Map();
    constructor() {
        super();
    }
    // Main loader 
    static async load_blueprint(ID) {
        let blueprint = await require((0, helper_1.formatPath)(3, ID, 'data', 'templates', 'blueprints'));
        this.defineCodes(...blueprint.alphabet);
        for await (const system of blueprint.systems) {
            this.load_system_blueprint(system);
        }
    }
    // 
    // Manage Systems
    static _has_system(ID) {
        return this.systems.has(ID);
    }
    static async load_system_blueprint(system) {
        let ID = system.id;
        if (this._has_system(system.id))
            return;
        let sysID = ID.split('_').pop();
        this.load_schema(ID);
        this.systems.set(sysID, new system_1.System(system, await require((0, helper_1.formatPath)(3, ID, 'data', 'templates', 'states'))));
    }
    // Manage Schemata
    static _has_schema(ID) {
        return this.schemata.has(ID);
    }
    static async load_rules(loadedSchema, storedRules) {
        let rewriterRegexps = [];
        for await (const rule of storedRules) {
            let maps = [];
            for await (const mapPath of rule.maps) {
                let mapID = mapPath.split('_').pop();
                await this.load_subroutine(mapPath, 'rules', 'maps');
                if (!maps.includes(mapID))
                    maps.push(mapID);
            }
            loadedSchema.rules.push({
                "metric": await this.load_subroutine(rule?.metric, 'rules', 'metrics'),
                "maps": maps,
                "successors": rule.successors.map(s => this.decode(...this.lookup(...s)))
            });
            rewriterRegexps.push(rule.syntax.replaceAll(/#(\d+)#/g, (...args) => this.decode(...this.lookup(args[1]))));
        }
        ;
        loadedSchema.regex = RegExp(`(${rewriterRegexps.join(')|(')})`, 'g');
    }
    static async load_hooks(loadedSchema, storedHooks) {
        for await (const [triggerA, obj] of Object.entries(storedHooks)) { //pre post on
            for await (const [triggerB, arr] of Object.entries(obj)) { // cycle/production/interpretation
                for await (const hook of arr) {
                    await this.load_subroutine(hook, 'hooks', triggerA, triggerB);
                    let hookID = hook.split('_').pop();
                    let hooks = loadedSchema.hooks?.[`${triggerA}_${triggerB}`];
                    if (!hooks)
                        hooks = [hookID];
                    if (!hooks.includes(hookID))
                        hooks.push(hookID);
                    loadedSchema.hooks[`${triggerA}_${triggerB}`] = hooks;
                }
            }
        }
    }
    static async load_interpretations(loadedSchema, storedInterpretations) {
        for await (const [formatID, obj] of Object.entries(storedInterpretations)) {
            let letterIndex = 0;
            for await (const letterGroup of obj) {
                if (letterIndex < this.codes.length) {
                    for await (const interpretation of letterGroup) {
                        let letter = this.decode(...this.lookup(letterIndex++));
                        await this.load_subroutine(interpretation, 'interpretations', formatID);
                        let ID = interpretation.split('_').pop();
                        let letters = loadedSchema.interpretations?.[formatID]?.[letter] ?? [ID];
                        let formats = loadedSchema.interpretations?.[formatID] ?? { [letter]: letters };
                        if (!letters.includes(ID)) {
                            letters.push(ID);
                        }
                        formats[letter] = letters;
                        loadedSchema.interpretations[formatID] = formats;
                    }
                    ;
                }
            }
        }
    }
    static async load_schema(ID) {
        if (this._has_schema(ID))
            return;
        let stored = await require((0, helper_1.formatPath)(3, ID, 'data', 'templates', 'schemata'));
        let loaded = { "rules": [], "hooks": {}, "interpretations": {} };
        await this.load_rules(loaded, stored.rules);
        await this.load_hooks(loaded, stored.hooks);
        await this.load_interpretations(loaded, stored.interpretations);
        return this.schemata.set(ID, loaded);
    }
    // manage subroutines
    static _has_subroutine(ID) {
        return (typeof this?.[ID] === 'function');
    }
    static _create_subroutine(ID, obj) {
        this[ID] = Function(...(0, subroutine_1.functionFromTemplate)(obj, ID));
        return ID;
    }
    static _destroy_subroutine(ID) {
        if (this._has_subroutine(ID))
            return delete this[ID];
    }
    static async load_subroutine(ID, ...categories) {
        if (this._has_subroutine(ID)) {
            return this._create_subroutine(ID, await require((0, helper_1.formatPath)(3, ID, 'data', 'templates', 'subroutines', ...categories)));
        }
    }
    ;
}
exports.Manage = Manage;
