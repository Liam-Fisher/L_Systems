import {System} from '../classes/system';
import {Network} from '../classes/network';
import { SystemLoading } from './c4_systemLoader';
import { formatPath } from '../helpers/files';
import {networkNode} from '../definitions/classes/networkComponents';
import { patcher_graph } from '../definitions/maxmsp/patcher';
import { readFile, writeFile } from 'fs/promises';
import { network_blueprint } from '../definitions/templates/blueprintSyntax';
export const NetworkLoading = function<SourceClass extends ReturnType<typeof SystemLoading>>(Source: SourceClass) {
    return class NetworkLoader extends Source {
        static systems: Map<string, System> = new Map();
        static networks: Map<string, Network> = new Map();
    constructor(...args: any[]) {
        super();
    }
    static async load_networks(tag: string, ...networks: network_blueprint[]){
        for await(const network of networks) {
            this.networks.set(network.patcher.id, 
                (new Network(network, ...(await this.parseNetwork(network.patcher.filename, tag)))));
        }
    }
    static async parseNetwork(networkName: string, tag: string) {
        if(tag !== 'nodes') return [];
        let networkNodes: networkNode[] = [];
        let networkObj: patcher_graph = await JSON.parse(await readFile(formatPath(3, 'maxpat', networkName, 'patchers', 'networks'), 'utf-8')).patcher;
        let connectionMap = new Map(networkObj.lines.map(l => [l.patchline.source[0],l.patchline.destination[0]]));
        let textMap = new Map(networkObj.boxes.map(b => [b.box.id, b.box.text]));
        for await (const [src_id, txt] of textMap) {
            let src_txt = txt.split(' ');
            let src_class = src_txt[0].toLowerCase();
            if(((src_class === 'r ') || (src_class.toLowerCase() === 'receive ')) && connectionMap.has(src_id)) {
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
    }
}
};