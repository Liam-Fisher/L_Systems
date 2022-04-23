import * as _f from '../definitions/formats';
import * as _l from '../definitions/literals';
import { Processor } from '../processing/generators';
import {processorFromTemplate} from './construction';
export class Control {
    processor: Processor;
    ids: Set<string>;
    systemGenerators: Map<string, Generator<string, string, unknown>>;
    constructor() {
    }
    init(src: _f.template) {
        this.processor = processorFromTemplate(src);
        this.ids = new Set([...this.processor.systems.keys()]);
        this.systemGenerators = new Map();
    }
    generate(id: string) {
        if (!this.systemGenerators.has(id)) {
            let pGen =  this.processor.produce(id);
            this.systemGenerators.set(id, pGen);
            return ['BEGIN', id];
        }
        else {
            let pVal = this.systemGenerators.get(id).next().value;
            if (pVal === 'idle') return ['END', id];
            else return ['NEXT', pVal, id];
        }
    }
    handle(method: string, ...args: (number | string | object)[]) {
        if (!this?.[method]) return ['ERROR', `method ${method} does not exist`];
        if(args.length === 0) return this[method]();
        if ((typeof args[0] === 'string')&&(!this.ids.has(args[0]))) return ['ERROR', `id ${args[0]} does not exist`];
        return this[method](...args);
    }
}
