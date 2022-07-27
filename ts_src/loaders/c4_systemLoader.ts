import { system_blueprint } from '../definitions/templates/blueprintSyntax';
import { System } from '../classes/system';
import { Network } from '../classes/network';
import { formatPath } from '../helpers/files';
import { SchemaLoading } from './c3_schemaLoader';
import { writeFile } from 'fs/promises';
import { bufferNum } from '../definitions/static/literals';
export const SystemLoading = function<SourceClass extends ReturnType<typeof SchemaLoading>>(Source: SourceClass) {
    return class SystemLoader extends Source {
        static systems: Map<string, System> = new Map();
        static networks: Map<string, Network> = new Map();
    constructor(...args: any[]) {
        super();
    }
    static _has_system(ID: string) {
        return this.systems.has(ID);
    }
    static _remove_system(ID: string) {
        return this.systems.delete(ID);
    }
    static async load_systems(...systems: system_blueprint[]) {
        for await(const system of systems){
            this.load_system_blueprint(system);
        }
}    
static async load_system_blueprint(system: system_blueprint) {
            let ID = system.id;
            if(this._has_system(system.id)) return;
            let systemState =  await require(formatPath(3, 'json', system.filename, 'data','templates', 'states'));
            let axiomComponents = this.fromAxiom(systemState.word);
            this.systems.set(ID, 
                new System(system, systemState, axiomComponents[0] as string, axiomComponents[1] as number[][]));
            this.load_schema(system.schema, ...system.outputs?.text);
}
//static async write_jsons(sys: System){ for await(const [filename, fileobj] of sys.jsonMap) { } }
static async write_blobs(sys: System){
    let pCount = sys.maxParameters;
    let bCount = sys.parameterBytes;
    let pType = sys.parameterType;
    let bStride = pCount*bCount;
    for await(const [filename, fileobj] of sys.blobMap) {
        if(fileobj.src === 'default') {
            if(fileobj.format === 'jit-textfile') {
                bStride += 4;
                sys.parameters.forEach((params,index) => {
                    let offset = index*bStride;
                    let extraBytes = new Array(4-fileobj.obj.write(sys.letters[index], index*bStride));
                    extraBytes.forEach((zero, n) => fileobj.obj[n] = 0);
                    this.parametersToBlob(fileobj.obj, offset+4, pType, bCount, params);
                });
            }
            else if(fileobj.format === 'buffer-') {
                sys.parameters.forEach((params,index) => {
                    let offset = index*bStride;
                    this.parametersToBlob(fileobj.obj, offset, pType, bCount, params);
                });
            }
            else {
                fileobj.obj.write(sys.letters);
            }
        }
        await writeFile(formatPath(3, 
            (fileobj.format === 'buffer-' ? 'data' : 'txt'), filename, 
            'data', 'outputs', 'blob', fileobj.format), fileobj.obj);
    }
}
static parametersToBlob(tgt: Buffer, offset: number, pType: bufferNum, bCount: number, parameters: number[]) {
    let writeNum = `write${pType}` as (keyof typeof tgt)&((value: number, offset?: number) => number);
    parameters.forEach((param, i) => tgt[writeNum](param, offset+i*bCount));
}
}
};