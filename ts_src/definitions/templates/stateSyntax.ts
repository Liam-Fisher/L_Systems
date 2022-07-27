import { loaded} from '../static/literals';
import { jsCtors} from '../static/interfaces';
import {ctxType, el} from '../static/generics';

type argOrObj<ctx extends loaded, ctorKey extends keyof jsCtors> = ctxType<ctx, jsCtors[ctorKey]['args'], jsCtors[ctorKey]['obj']>;

export interface ObjectInitializer<T extends keyof jsCtors> {
    id: string;
    ctor: T;
    args: argOrObj<'stored', T>; 
}
export type stateObj<ctx extends loaded> =  ctxType<ctx, ObjectInitializer<keyof jsCtors>, argOrObj<'loaded', keyof jsCtors>>;
export type consts<ctx extends loaded> = ctxType<ctx,Record<string, el>, undefined>;
export interface State<ctx extends loaded> {
    word: number[][]
    consts?: consts<ctx> 
    vars: Record<string, el>
    objs: stateObj<ctx>[]
}