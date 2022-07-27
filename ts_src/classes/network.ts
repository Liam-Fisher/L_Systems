import { network_blueprint } from "../definitions/templates/blueprintSyntax";
import { NetworkClass } from "../definitions/classes/networkComponents";
import { formatPath } from "../helper";
export class Network implements NetworkClass {
    messages: NetworkClass["messages"];
    nodes: NetworkClass["nodes"];
    constructor(blueprint: network_blueprint, ...nodes: NetworkClass["nodes"]){
        this.nodes = nodes;
        let loadMessages = [`CONTROL load ${
            blueprint.patcher.filename} ${
            blueprint.patcher.id} ${
            blueprint.patcher.preset ?? `${blueprint.patcher.filename}_${blueprint.patcher.id}`} ${
            blueprint.patcher.opentime ?? 1 } ${
            blueprint.patcher.args.join(' ')}`];
            let startMessages = [];
            let readMessages = [];
            for (const [filetype, fileobjs] of  Object.entries(blueprint.inputs)) {
                for (const fileobj of fileobjs) {
                let ext = filetype === 'json' ? 'json' : 'txt';
                readMessages.push(`CONTROL send ${
                    fileobj.objname} ${blueprint.patcher.id}`); 
                readMessages.push(`CONTROL read ${
                    formatPath(3, ext, fileobj.filename, 'data', 'outputs', 'system', filetype, fileobj.format, fileobj.id)}`);
                startMessages.push(`CONTROL send ${
                    fileobj.objname} ${blueprint.patcher.id}`, `CONTROL bang`);
            }
        }
        let writeMessages = []; 
        for (const [filetype, fileobjs] of  Object.entries(blueprint.outputs)) {
            for (const fileobj of fileobjs) {
            writeMessages.push(`CONTROL send ${
                fileobj.objname} ${blueprint.patcher.id}`);
            writeMessages.push(`CONTROL write ${
                formatPath(3, fileobj.ext, fileobj.filename, 'data', 'outputs', 'network', filetype, fileobj.format)}`)
        }
    }
    let endMessages = [`CONTROL send ${blueprint.patcher.id}::this`, `CONTROL wclose`];
    let closeMessages = [];
    this.messages = {
        "start": startMessages,
        "load": loadMessages,
        "read": readMessages,
        "write": writeMessages,
        "end": endMessages,
        "close": closeMessages
    }
}
}