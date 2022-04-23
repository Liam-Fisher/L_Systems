"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = void 0;
class Template {
    constructor(src) {
        this.metadata = src?.metadata ?? {
            "alphabet": [70],
            "yields": {
                "activity": {
                    "generating": true,
                    "matching": true,
                    "rewriting": true
                },
                "modification": {
                    "preCycle": false,
                    "postCycle": false,
                    "preProduction": true,
                    "postProduction": true,
                    "preWrite": true,
                    "postWrite": true
                },
                "interpretRate": 1
            }
        };
        this.schemata = src?.schemata ?? {};
        this.specifications = src?.specifications ?? {};
        this.library = src?.library ?? {
            "interpretive": {},
            "syntax": {},
            "metric": {},
            "map": {},
            "modifier": {}
        };
    }
}
exports.Template = Template;
