import { Core } from "../classes/core";
import { stateObj } from "../definitions/templates/stateSyntax";
export const CoreProcessing = function() {
    return class CoreProcessor extends Core {
    static codes: number[] = [];
    //static ctors: Map<string, new (...args: any[]) => void> = new Map();
    //static regexSpecial = [33, 36, 40, 41, 42, 43, 47, 63, 91, 92, 93, 94, 123, 124, 125];
    constructor(...args: any[]) {
        super();
    }
    buildObj(obj: stateObj<'stored'>) {
        switch (obj.ctor) {
            case "Buffer":
                    this[obj.id] = Buffer.alloc(obj.args as number);
                    break;
            case "AsyncFunction":
                this[obj.id] = new (Object.getPrototypeOf(async function () { }).constructor)(...obj.args as string[]);
                break;
            case "GeneratorFunction":
                this[obj.id] = new (Object.getPrototypeOf(function* () { }).constructor)(...obj.args as string[]);
                break;
            case "Function":
                this[obj.id] = Function(...obj.args as string[]);
                break;
            case "Set":
                this[obj.id] = new Set(...obj.args as ConstructorParameters<typeof Set>);
                    break;
            case "Map":
                this[obj.id] = new Map(...obj.args as ConstructorParameters<typeof Map>);
                    break;
            default:
                const ctor = (globalThis?.[obj.ctor]);
               this[obj.id] = new ctor(...obj.args as ConstructorParameters<typeof ctor>);
        }
    }
    callGroup(tgt: any, ...methods: string[]) {
        let activeMethods = methods.filter(tgt => typeof this?.[tgt] === 'function');
        return activeMethods.map(m => this[m](tgt)).filter(el => el);
    }
}
}