import * as _l from '../static/literals';
import {ctxType, el} from '../static/generics';
import { systemData } from '../static/interfaces';
import {systemOutTypes, networkOutTypes, systemFile, networkFile, fileExtension} from '../static/fileio';

interface obj  { objname: string }
interface input { id: string }
export interface file { filename: string }
type fileext<T> =  { 
    ext: T 
}
export type maxformat<T> = {
    format: T
}

export type fileArgs = {
    blob: [number],
    json: [string, el][];
    stream: []
}
export type args<T> = {
    args: T;
}
export interface patcher_component extends input,file {
    preset?: string|number,
    opentime?: number,
    args?: el[]
}
export type systemFiles<ctx extends _l.loaded> = {
    [Tf in (keyof systemOutTypes)]?: (maxformat<systemFile<Tf>>&ctxType<ctx, input, {args?: number[]}>&file&Partial<obj>)[]
};
export type networkFiles<Tx> = {
[T in keyof networkOutTypes]?: (Tx&maxformat<networkFile<T>>&fileext<fileExtension<T>>)[]
};
//export type broadcast = id&mode&obj&file_output<_l.maxClasses["stream"]>;
export interface system_blueprint extends file,input {
    schema: string
    outputs: systemFiles<'loaded'>
}
export interface network_blueprint {
    patcher: patcher_component,
    inputs: systemFiles<'stored'>;
    outputs: networkFiles<file&obj>;
}
export interface Blueprint extends input { 
    alphabet: number[]
    systems: system_blueprint[],
    networks: network_blueprint[],
};

// add web interface ??