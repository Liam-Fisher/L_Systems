import {regexpReserved} from '../definitions/literals';
import  {Schema} from '../definitions/formats';
import  {breakpoints} from '../definitions/interfaces';
import { System } from './system';
import { Routine } from './routine';
export class Core {
    alphabetCodes: number[];
    yields: breakpoints;
    systems: Map<string, System>;
    schemata: Map<string, Schema>;
    routines: Map<string, Routine>;
    constructor() {
    }
    encode(char: string){
        return this.alphabetCodes.indexOf(char.codePointAt(0))
    }
    decode(coded: number[]) {
        let codes: number[] = coded.map(l => this.alphabetCodes[l]);
        let escaped = codes.map((i) => regexpReserved.includes(i) ? [92, i] : i).flat();
        return String.fromCodePoint(...escaped);
    }
}