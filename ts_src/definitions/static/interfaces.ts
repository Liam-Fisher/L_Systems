import {el, json_el} from './generics';
import {templates, hookTriggers, systemStage, ruleType} from './literals';
import {systemOutType, networkOutType, maxClass, maxClasses} from './fileio';

export interface jsCtors {
    "Buffer": {
        args: number;
        obj: Buffer;
    }
    "Map": {
        args: ConstructorParameters<typeof Map>;
        obj: Map<el, json_el>;
    }
    "Set": {
        args: ConstructorParameters<typeof Set>;
        obj: Set<el>;
    }
    "Function": {
        args: ConstructorParameters<typeof Function>;
        obj: Function;
    }
    "AsyncFunction": {
        args: string[];
        obj: (...args: any[]) => Promise<unknown>;
    }
    "GeneratorFunction": {
        args: string[];
        obj: (...args: any[]) => Generator<unknown,unknown,unknown>;
    }
    "Proxy": {
        args: ConstructorParameters<typeof Proxy>;
        obj: typeof Proxy;
    }
}
export interface systemData<T> {
    templates: Record<keyof Omit<templates, 'subroutines'>, T>&{
        subroutines: { 
            hooks: Record<hookTriggers, Record<Lowercase<systemStage>,T>>
            interpretations: Record<string,T>     
            rules: Record<ruleType, T>
    }
}
    outputs: Record<systemOutType, Record<maxClass<keyof maxClasses>, T>>;
}



