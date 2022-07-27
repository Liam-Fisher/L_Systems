"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNetwork = void 0;
const promises_1 = require("fs/promises");
const parseNetwork = async function (networkName) {
    let networkNodes = [];
    let networkObj = await JSON.parse(await (0, promises_1.readFile)(`../patchers/networks/${networkName}.maxpat`, 'utf-8')).patcher;
    let connectionMap = new Map(networkObj.lines.map(l => [l.patchline.source[0], l.patchline.destination[0]]));
    let textMap = new Map(networkObj.boxes.map(b => [b.box.id, b.box.text]));
    for await (const [src_id, txt] of textMap) {
        let src_txt = txt.split(' ');
        let src_class = src_txt[0].toLowerCase();
        if (((src_class === 'r ') || (src_class.toLowerCase() === 'receive ')) && connectionMap.has(src_id)) {
            let tgt_id = connectionMap.get(src_id);
            let tgt_txt = textMap.get(tgt_id).split(' ');
            let tgt_class = tgt_txt.shift().toLowerCase();
            networkNodes.push({
                "id": parseInt(tgt_id.slice(4), 10),
                "input": src_txt[1],
                "obj": tgt_class,
                "args": tgt_txt
            });
        }
    }
    return networkNodes;
};
exports.parseNetwork = parseNetwork;
