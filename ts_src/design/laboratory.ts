import * as _f from '../definitions/formats';
import { Experiment } from './experiment';
import { Template } from './template';
import { Query } from '../control/query';
export class Laboratory extends Query {
    experiments: Map<string, Experiment>;
    template: _f.template;
    status: boolean;
    currentTest: Function;
    constructor(src: _f.template) {
        super();
        this.template = new Template(src);
        this.experiments = new Map();
    }
    init(src?: _f.template){
        if(src) this.template = new Template(src);
        super.init(this.template);
        return ["INITIALIZED", this.template];
    }
    create(id: string, ...codes: number[]) {
        console.log(id);
        console.log(...codes);
        let experiment = new Experiment(codes);
        this.experiments.set(id, experiment);
        return [...this.experiments.keys()];
    }
    experiment(method: string, id: string, ...args: any[]) {
        let experiment = this.experiments.get(id);
        if (!experiment) return ['ERROR', `id ${id} does not exist`];
        else if (typeof experiment?.[method] === 'function') return ['ERROR', `method ${method} does not exist`];
        else return experiment[method](...args);
    }

}