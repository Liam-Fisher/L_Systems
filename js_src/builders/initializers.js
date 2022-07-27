"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemDefaults = exports.schemataFileSet = void 0;
const schemataFileSet = function () {
    return {
        "interpretations": new Set(),
        "metrics": new Set(),
        "maps": new Set(),
        "hooks": new Set()
    };
};
exports.schemataFileSet = schemataFileSet;
const systemDefaults = function () {
    return {
        "index": 0,
        "status": "active",
        "indices": new Map(),
        "amounts": new Map(),
        "section": "cycle"
    };
};
exports.systemDefaults = systemDefaults;
