import {systemStages, loaded} from '../static/literals';
import {ctxType, hooks, indexWord} from '../static/generics';
import {systemData} from '../static/interfaces';

export type Rule<ctx extends loaded> = ctxType<ctx, { syntax: string }, {}> & {
    metric?: string;
    maps: string[];
    successors: indexWord<ctx>[];
}

export type Schema<ctx extends loaded> = ctxType<ctx, {}, {regex?: RegExp}> & {
    rules: Rule<ctx>[]
    hooks: hooks<systemStages, ctx>
    interpretations:  ctxType<ctx, string[][][], Record<string, Record<string, string[]>>>
};
export type schemataFiles = systemData<Set<string>>["templates"]["subroutine"];