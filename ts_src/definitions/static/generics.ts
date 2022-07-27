import {loaded, hookTriggers} from './literals';
export type ctxType<ctx extends loaded, typeA, typeB> = ctx extends 'stored' ? typeA : typeB;
export type gctor<T> = new (...args: any[]) => T;
export type nested_el<T> = T | (nested_el<T>[]);
export type el = string|number|boolean;
export type json_el = nested_el<el>;
export type nested_obj<T> = {
    [key: string]: T|nested_obj<T>;
}
export type fileSets<T extends nested_obj<string>|string> = {
    [Prop in keyof T]: T[Prop] extends string ? Set<string> : fileSets<T[Prop] extends nested_obj<string> ? T[Prop] : string >
}
type storedHooks<T> = { [Prop in keyof T as `${hookTriggers}_${string & T}`]: string[] };
export type hooks<T, ctx extends loaded> = ctxType<ctx, storedHooks<T>, Partial<storedHooks<T>>>;
export type indexWord<ctx extends loaded> = ctxType<ctx, number[], string>;