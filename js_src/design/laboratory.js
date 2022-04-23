"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Laboratory = void 0;
const experiment_1 = require("./experiment");
const template_1 = require("./template");
const query_1 = require("../control/query");
class Laboratory extends query_1.Query {
    constructor(src) {
        super();
        this.template = new template_1.Template(src);
        this.experiments = new Map();
    }
    init(src) {
        if (src)
            this.template = new template_1.Template(src);
        super.init(this.template);
        return ["INITIALIZED", this.template];
    }
    create(id, ...codes) {
        console.log(id);
        console.log(...codes);
        let experiment = new experiment_1.Experiment(codes);
        this.experiments.set(id, experiment);
        return [...this.experiments.keys()];
    }
    experiment(method, id, ...args) {
        let experiment = this.experiments.get(id);
        if (!experiment)
            return ['ERROR', `id ${id} does not exist`];
        else if (typeof experiment?.[method] === 'function')
            return ['ERROR', `method ${method} does not exist`];
        else
            return experiment[method](...args);
    }
}
exports.Laboratory = Laboratory;
