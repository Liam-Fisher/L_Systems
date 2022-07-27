"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const f1_core_1 = require("./f1_core");
const fs_1 = require("fs");
const process_1 = require("process");
const path_1 = require("path");
class System extends f1_core_1.Core {
    // default constants 
    letters;
    parameters;
    maxGenerations;
    maxLetters;
    // generic variable Objs
    vars;
    objs;
    // Progress
    index;
    stage;
    status;
    indices;
    amounts;
    // Memory
    match;
    offset;
    inParams;
    outParams;
    tempParams;
    globalStream;
    //info
    id;
    state;
    schema;
    // Implement optional MultiStream (multiple streams of different types being written to per system)
    //    streams: SystemClass["streams"]
    constructor(info, state) {
        super();
        this['letters'] = f1_core_1.Core.decode(...f1_core_1.Core.lookup(...state.letters));
        this.vars = state.vars;
        state.objs.forEach(o => this.buildObj(o));
        Object.entries(state.consts).forEach(c => this[c[0]] = c[1]);
        for (const i in info) {
            if (i === 'broadcast') {
                this.globalStream = (0, fs_1.createWriteStream)((0, path_1.join)((0, process_1.cwd)(), `../data/outputs/stream/qlist/${info.broadcast}.txt`));
            }
            else {
                this[i] = info[i];
            }
        }
        // Initial Progress
        this.index = 0;
        this.status = "active";
        this.indices = new Map();
        this.amounts = new Map();
        this.stage = "cycle";
        this.amounts.set('cycle', this?.maxGenerations ?? Number.MAX_SAFE_INTEGER);
    }
    broadcastMessage(tgts) {
        return this.callGroup(this, tgts ?? []).map((msg) => this.globalStream.write(msg));
    }
    update(stage) {
        this.stage = stage;
        this.index = this.indices.get(stage) ?? -1;
        if (++this.index === this.amounts.get(stage)) {
            this.indices.delete(stage);
            return false;
        }
        else {
            this.indices.set(stage, this.index);
            return true;
        }
    }
    *interpret(schema) {
        this.amounts.set('interpretation', this.letters.length);
        this.broadcastMessage(schema.hooks?.preInterpretation);
        while (this.update('interpretation')) {
            this.inParams = [this.parameters[this.index]];
            if (!this.broadcastMessage(schema.interpretations?.[this.letters[this.index]]).includes(false))
                continue;
            else
                yield this.status;
        }
        this.broadcastMessage(schema.hooks?.postInterpretation);
        return this.status;
    }
}
exports.System = System;
/*

                if (this.index === 0) {
                    let tgts = this.hooks?.[`pre${stage}`] ?? [];
                    if(stage === 'Interpretation') this.broadcast(tgts);
                    this.callGroup(this,tgts);
                this.callGroup(this, this.hooks?.[`post${stage}`] ?? []);
                }

*/ 
