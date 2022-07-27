"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subroutine_1 = require("../helpers/subroutine");
const promises_1 = require("fs/promises");
const helper_1 = require("../helper");
const fileSetRecurse = async function (fileset, category) {
    for await (const [category, files] of Object.entries(fileset)) {
        for await (const filename of fileset) {
            let name = filename.split('_').pop();
            if (!tgtObj?.[name])
                tgtObj[name] = await require((0, helper_1.formatPath)(3, filename, 'templates', 'subroutines', categories));
            console.log(`loading ${category} subroutine: ${filename}`);
        }
    }
    export const build_routine = async function (ID, files) {
        let modulePath = (0, helper_1.formatPath)(1, ID + 'Routine', 'modules');
        await emitModule(await compile_routine(files), modulePath);
        try {
            await (0, promises_1.access)(seqPath);
            await (0, promises_1.rm)(seqPath);
        }
        catch { }
        console.log(`loading module`);
        let Routine = await require(`../../${modulePath}`).Routine;
        console.log(`module loaded`);
        return Routine;
    };
    export const compile_routine = async function (files) {
        let tgtObj = {};
        let categories = [];
        for await (const [method, fileGroup] of Object.entries(files)) {
            for await (const [format, fileSets] of Object.entries(fileGroup)) {
                for await (const [folder, fileList] of Object.entries(fileSets)) {
                    for await (const filename of fileList) {
                        let name = filename.split('_').pop();
                        if (!tgtObj?.[name]) {
                            tgtObj[name] = await require((0, helper_1.formatPath)(3, filename, 'templates', 'subroutines', method, format, folder));
                            console.log(`loading ${category} subroutine: ${filename}`);
                        }
                    }
                }
                return tgtObj;
            }
            ;
            const emitModule = async function (obj, modulePath, staticRegex) {
                let str = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routine = void 0;

class Routine {
    ${staticRegex ? `static regex = /${staticRegex.source}/${staticRegex.flags};` : ''}
    constructor(){
    }
    ${Object.entries(obj).map(([name, template]) => `\n\t\t\t${(0, subroutine_1.functionFromTemplate)(template, name)}\n\t\t`).join('')}
};
exports.Routine = Routine;`;
                await (0, promises_1.writeFile)(modulePath, str);
                console.log(`module emitted`);
                return;
            };
        }
    };
};
