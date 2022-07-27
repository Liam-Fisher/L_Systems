
import { cwd } from 'process';
import { join } from 'path';
export const formatPath = function(depth: number, ext: string, filename: string, ...categories: string[]){
        return `${join(cwd(),'../'.repeat(depth), ...categories.concat(filename.replaceAll('_','/')))}.${ext}`;
};