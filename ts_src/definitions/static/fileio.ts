import {maxformat} from '../templates/blueprintSyntax';
import { WriteStream } from 'fs';
import { systemData } from './interfaces';
import { templates } from './literals';
export type systemOutTypes =  { 'blob', 'json', 'text'};
export type systemOutType = keyof systemOutTypes;
export interface networkOutTypes extends systemOutTypes { 'image', 'audio', 'movie', 'video', 'model' };
export type networkOutType = keyof systemOutTypes;
export type maxClasses = {
blob: { 'text', 'jit-textfile', 'buffer-'};
// add aliases, ex. mc.cascade~ = filterdesign~,
json: { 'dict', 'pattrstorage', 'mtr', 'mc_pattern' }
//dict: { 'dict', 'dict.view', 'pattrstorage', 'mtr', 'mc_pattern', 'mc_chord', 'mc_cascade', 'mc_groove', 'umenu', 'matrix', 'mc_matrix'}
text: { 'qlist', 'coll', 'midi', 'table' };
//script: { 'js', 'jsui', 'node.script'};
audio: { 'buffer-', 'polybuffer-', 'sfrecord-'};
image: { 'jit-matrix', 'jit_grab' };
video: { 'jit-record', 'jit_matrixset' };
movie: { 'jit-vcr' };
model: { 'jit-gl_model' };
};
export type fileExtensions = {
blob: { 'txt' };
text: { 'txt' };
json: { 'json', 'jsonc' };
audio: { 'aif', 'wav', 'snd' };
image: {  'png', 'jpeg', 'tiff' };
video: {  'mov', 'avi' }
movie: {  'mov' };
model: {  'obj', 'dae' };
}

export type systemFile<component extends (keyof maxClasses)> = keyof maxClasses[component];
export type fileExtension<component extends (keyof fileExtensions)> = keyof fileExtensions[component]; 


export interface FileWrapper<T extends systemOutType> extends maxformat<keyof maxClasses[T]> {
    src: string;
}
export type FileObjs = {
    blob: Buffer
    json: object
    text: WriteStream
}
export type FileMap<T extends systemOutType> = Map<string, FileWrapper<T>&{obj: FileObjs[T]}>; 