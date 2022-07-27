"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpreting = void 0;
const fs_1 = require("fs");
const process_1 = require("process");
const path_1 = require("path");
const interpreting = function (Base) {
    return class Interpreter extends Base {
        stream;
        id;
        alphabet;
        network;
        sequenceFilePath;
        mediaFilePath;
        constructor(...args) {
            super();
            this.id = args[0].id;
            this.alphabet = args[0].alphabet;
            this.network = args[0].network;
            this.sequenceFilePath = (0, path_1.join)((0, process_1.cwd)(), `../data/sequences/${args[0].seqFile}`);
            this.mediaFilePath = (0, path_1.join)((0, process_1.cwd)(), `../data/media/${args[0].mediaFile}`);
            this.stream = (0, fs_1.createWriteStream)(this.sequenceFilePath);
        }
        callGroup(sys, targets) {
            let tgts = targets.filter(tgt => typeof this?.[tgt] === 'function');
            return tgts.map(tgt => this[tgt](sys)).filter(el => el);
        }
        enqueueMsg(sys, tgts) {
            return this.callGroup(sys, tgts ?? []).map((msg) => this.stream.write(`${msg}\n`));
        }
        *interpret(sys, schema) {
            sys.amounts.set('interpretation', sys.letters.length);
            this.enqueueMsg(sys, schema.hooks?.preInterpretation);
            while (sys.update('interpretation')) {
                sys.inParams = [sys.parameters[sys.index]];
                if (!this.enqueueMsg(sys, schema.interpretations?.[sys.letters[sys.index]]).includes(false))
                    continue;
                else
                    yield sys.status;
            }
            this.enqueueMsg(sys, schema.hooks?.postInterpretation);
            return sys.status;
        }
    };
};
exports.interpreting = interpreting;
