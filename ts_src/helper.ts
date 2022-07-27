
import { cwd } from 'process';
import { join } from 'path';
import {network_blueprint } from './definitions/templates/blueprintSyntax'
export const formatPath = function(depth: number, ext: string, filename: string, ...categories: string[]){
        return `${'../'.repeat(depth)}${categories.concat(filename.replaceAll('_','/')).join('/')}.${ext}`;
};
export const networkExport = function(fileName: string, fileType: string, fileFormat: string){
        return join(cwd(), formatPath(0, fileFormat, fileName, 'data', 'outputs', 'network', fileType));
};