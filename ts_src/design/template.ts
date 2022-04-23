import * as _ from '../definitions/formats';
export class Template {
    metadata: _.metadata;
    schemata: _.schemata;
    specifications: _.specifications;
    library: _.library;
    constructor(src: _.template | undefined) {
        this.metadata = src?.metadata ?? {
            "alphabet":  [70],
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
        }
    }
}