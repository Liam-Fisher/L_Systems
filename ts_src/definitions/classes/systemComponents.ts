import {systemStage, systemStatus} from '../static/literals';
import {FileMap} from '../static/fileio';
import {bufferNum} from '../static/literals';
interface Progress {
index: number;
stage: systemStage;
status: systemStatus;
counters: Map<systemStage, number>;
amounts: Map<systemStage, number>;
}
interface Memory {
match: string;
offset: number;
inParams: number[][];
outParams: number[][];
tempParams: number[][];
}
export interface SystemClass extends Progress, Memory {
//maxGenerations?: number
//maxLetters?: number
parameterType: bufferNum
parameterBytes: number
maxParameters: number
activeFileStreams: number
textMap: FileMap<'text'>;
blobMap: FileMap<'blob'>;
jsonMap: FileMap<'json'>;
}
