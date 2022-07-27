"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_all = void 0;
const routineLoader_1 = require("./routineLoader");
const schemaLoader_1 = require("./schemaLoader");
const systemLoader_1 = require("./systemLoader");
const f1_rewriter_1 = require("../classes/f1_rewriter");
const f2_interpreter_1 = require("../classes/f2_interpreter");
const f3_processor_1 = require("../classes/f3_processor");
const f4_controller_1 = require("../classes/f4_controller");
const initializers_1 = require("./initializers");
const load_all = async function (path) {
    let blueprint = require(path);
    let systemMap = new Map();
    let schemataMap = new Map();
    let schemataFiles = (0, initializers_1.schemataFileSet)();
    for await (const system of blueprint.systems) {
        await (0, systemLoader_1.load_system)(system, systemMap, blueprint.alphabet);
    }
    for await (const schemaFile of blueprint.schemata) {
        await (0, schemaLoader_1.load_schema)(schemaFile, schemataMap, blueprint.alphabet, schemataFiles);
    }
    // remember!!! writeFile executes from code/system.js, whereas require executes from code/js_src/builders/mainLoader.js 
    let baseClass = await (0, routineLoader_1.build_routine)(schemataFiles, blueprint.id, blueprint.seqFile);
    let ControlCtor = (0, f4_controller_1.controlling)((0, f3_processor_1.processing)((0, f2_interpreter_1.interpreting)((0, f1_rewriter_1.rewriting)(await baseClass))));
    let ControlObj = new ControlCtor(blueprint, systemMap, schemataMap);
    return ControlObj;
};
exports.load_all = load_all;
