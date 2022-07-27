import { Blueprint } from '../definitions/templates/blueprintSyntax';
import {System} from '../classes/system';
import {Network} from '../classes/network';
import {formatPath} from '../helpers/files';
import { NetworkLoading } from './c5_networkLoader';
export const BlueprintLoading = function<SourceClass extends ReturnType<typeof NetworkLoading>>(Source: SourceClass) {
    return class BlueprintLoader extends Source {
        static systems: Map<string, System> = new Map();
        static networks: Map<string, Network> = new Map();
    constructor(...args: any[]) {
        super();
    }
    static async load_blueprint(ID: string, ...args: string[]) {
        let blueprint: Blueprint = await require(formatPath(3, 'json',ID,'data','templates', 'blueprints'));
        this.defineCodes(...blueprint.alphabet);
        await this.load_systems(...blueprint.systems);
        await this.load_networks('none', ...blueprint.networks);
    }
}
};