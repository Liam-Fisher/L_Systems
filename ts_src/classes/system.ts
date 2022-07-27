import { Core } from './core';
import { SystemClass } from '../definitions/classes/systemComponents';
import { bufferNum, systemStage, systemStatus } from '../definitions/static/literals';
import { systemFile } from '../definitions/static/fileio';
import { State } from '../definitions/templates/stateSyntax';
import { Schema } from '../definitions/templates/schemaSyntax';
import { system_blueprint } from '../definitions/templates/blueprintSyntax';
import { createWriteStream, WriteStream } from 'fs';

import {formatPath} from '../helpers/files';

export class System extends Core implements SystemClass {
    // default constants 
    letters: string;
    parameters: number[][];
    maxGenerations: number;
    maxLetters: number;
    // state properties
    axiom: number[];
    vars: State<'loaded'>['vars'];
    objs: State<'loaded'>['objs'];
    // Progress
    index: number;
    stage: systemStage;
    status: systemStatus;
    counters: Map<systemStage, number>;
    amounts: Map<systemStage, number>;
    // Memory
    match: string;
    offset: number;
    inParams: number[][];
    outParams: number[][];
    tempParams: number[][];
    //info
    id: string;
    state: string;
    schema: string;
    maxParameters: number;
    parameterBytes: number;
    parameterType: bufferNum;
    // file control
    activeFileStreams: number
    textMap: SystemClass["textMap"]
    blobMap: SystemClass["blobMap"]
    jsonMap: SystemClass["jsonMap"]
    constructor(info: system_blueprint, state: State<'stored'>, letters: string, parameters: number[][]) {
        super();
        this.letters = letters;
        this.parameters = parameters;
        this.maxParameters = Math.max(...parameters.map(p => p.length))
        this.activeFileStreams = 0;
        this.parameterType = state?.consts?.parameterType as bufferNum ?? 'FloatBE'; 
        this.parameterBytes =  this.parameterType.endsWith('8') ? 1 : this.parameterType.endsWith('6BE') ? 2 :
        (this.parameterType.endsWith('2BE') || this.parameterType.endsWith('tBE')) ? 4 : 8;
        this.vars = state.vars;
        state.objs.forEach(o => this.buildObj(o));
        Object.entries(state.consts).forEach(c => this[c[0]] = c[1]);
        this.id = info.id;
        this.state = info.filename;
        this.schema = info.schema;
        for (const [type, files] of Object.entries(info.outputs)) {
            for (const file of files) {
            if (type === 'stream') {
                this.activeFileStreams++;
                this.textMap.set(file.filename,  {
                "format": file.format as systemFile<'text'>, 
                "src": file?.objname ?? "default",
                "obj": createWriteStream(formatPath(1, 'txt', file.filename, 'data', 'outputs', 'system', file.format))
                });
            }
            else if(type === 'blob') {
                this.blobMap.set(file.filename,  {
                "format": file.format as systemFile<'blob'>, 
                "src": file?.objname ?? "default",
                "obj": Buffer.alloc(file?.args?.[0] ?? 256)
                });
            }
            else {
                this.jsonMap.set(file.filename,  {
                "format": file.format as systemFile<'json'>,
                "src": file?.objname ?? "default",
                "obj": {}
                });
            }
        }
    }
        // Initial Progress
        this.index = 0;
        this.status = "active";
        this.counters = new Map();
        this.amounts = new Map();
        this.stage = "cycle";
    }
    broadcastMessage(fstm: WriteStream, ...tgts: string[]) {
        return this.callGroup(this, ...tgts).map((msg) => fstm.write(msg));
    }
    update(stage: systemStage) {
        this.stage = stage;
        this.index = this.counters.get(stage) ?? -1;
        if (++this.index === this.amounts.get(stage)) {
            this.counters.delete(stage);
            return false;
        }
        else {
            this.counters.set(stage, this.index);
            return true;
        }
    }
    *interpret(schema: Schema<'loaded'>) {
        this.amounts.set('interpretation', this.letters.length);
        for(const [filename, fileobj] of this.textMap.entries()) {
            this.broadcastMessage(fileobj.obj, ...schema.hooks?.pre_interpretation);
            let fileGroup = schema.interpretations?.[filename];
        while (fileGroup&&this.update('interpretation')) {
            let letterGroup = fileGroup[this.letters?.[this.index]];
            this.inParams = [this.parameters[this.index]];
            if (!this.broadcastMessage(fileobj.obj, ...letterGroup?.[this.letters[this.index]]).includes(false)) continue;
            else yield this.status;
        }
        this.broadcastMessage(fileobj.obj, ...schema.hooks?.post_interpretation);
        fileobj.obj.close(() => this.activeFileStreams--);
    }
    return this.status;
}
}
