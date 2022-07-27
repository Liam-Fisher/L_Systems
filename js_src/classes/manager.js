"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managing = void 0;
const routineLoader_1 = require("../builders/routineLoader");
const schemaLoader_1 = require("../builders/schemaLoader");
const subsystemLoader_1 = require("../builders/subsystemLoader");
const initializers_1 = require("../builders/initializers");
const subsystem_1 = require("./subsystem");
const helper_1 = require("../helper");
const subroutine_1 = require("../helpers/subroutine");
const managing = function (Base) {
    return class Manage extends Base {
        constructor(...args) {
            super(...args);
        }
        _create_subsystem(ID, obj) {
            this.subsystems.set(ID, new subsystem_1.SubSystem(obj, this.alphabet));
        }
        _destroy_subsystem(ID) {
            this.subsystems.delete(ID);
            this.generators.delete(ID);
        }
        _create_subroutine(ID, obj) {
            this[ID] = Function(...(0, subroutine_1.functionFromTemplate)(obj, ID));
        }
        _destroy_subroutine(name) {
            if (typeof this[name] === 'function')
                delete this[name];
        }
        _remove_subroutine_ref(ID, targets) {
            targets = targets?.filter(el => el !== ID) ?? targets;
        }
        async _load_subsystem(filename) {
            let subsys = await (0, subsystemLoader_1.load_subsystem)(filename, this.subsystems, this.alphabet);
            if (!this.schemata.has(subsys.productionSchema))
                await this._load_schema(subsys.productionSchema);
        }
        async _load_schema(filename) {
            let fileSet = (0, initializers_1.schemataFileSet)();
            await (0, schemaLoader_1.load_schema)(filename, this.schemata, this.alphabet, fileSet);
            Object.entries(await (0, routineLoader_1.compile_routine)(fileSet)).forEach(([name, obj]) => this._create_subroutine(name, obj));
        }
        async _load_subroutine(filename, ...categories) {
            let path = (0, helper_1.formatPath)(3, filename, 'templates', 'subroutines', ...categories);
            this._create_subroutine(filename.split('_').pop(), await require(path));
        }
        ;
        remove_from_schema(subroutineID, schemaID, index, category) {
            let schema = this.schemata.get(schemaID);
            if ((category === 'metrics') && (schema.rules?.[index]?.metric)) {
                delete schema.rules[index].metric;
            }
            else if ((category === 'maps') && (schema.rules?.[index]?.maps)) {
                this._remove_subroutine_ref(subroutineID, schema?.rules?.[index]?.maps);
            }
            else if ((category === 'interpretations') && (schema.interpretations?.[index])) {
                this._remove_subroutine_ref(subroutineID, schema.interpretations?.[index]);
            }
            else if ((category === 'hooks') && (schema.hooks?.[index])) {
                this._remove_subroutine_ref(subroutineID, schema.hooks?.[index]);
            }
            else {
                return false;
            }
            this.schemata.set(schemaID, schema);
            return true;
        }
        async add_to_schema(subroutineID, schemaID, index, category) {
            let schema = this.schemata.get(schemaID);
            if ((category === 'metrics') && (schema.rules?.[index])) {
                schema.rules[index].metric = subroutineID;
                await this._load_subroutine(subroutineID, 'metrics');
            }
            else if ((category === 'maps') && (schema.rules?.[index])) {
                schema.rules[index].maps.push(subroutineID);
                await this._load_subroutine(subroutineID, 'maps');
            }
            else if ((category === 'interpretations') && (schema.interpretations?.[index])) {
                schema.interpretations[index].push(subroutineID);
                await this._load_subroutine(subroutineID, 'interpretations');
            }
            else if ((category === 'hooks') && (schema.hooks?.[index])) {
                schema.hooks[index].push(subroutineID);
                await this._load_subroutine(subroutineID, 'hooks');
            }
            else {
                return false;
            }
            this.schemata.set(schemaID, schema);
            return true;
        }
    };
};
exports.managing = managing;
