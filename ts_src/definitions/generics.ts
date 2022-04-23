// helper types
export type Obj<Val> = {
    [key: string]: Val
}
export type Track<Type> = {
    [Prop in keyof Type]: Map<number, Type[Prop]>; 
};
export type Count<Union> = {
    stage: Union;
    index: number;
    indices: Map<Union, number>;
    amounts: Map<Union, number>;
}
// type structures
export type Modification<Type> = {    
    preCycle?: Type;
    preProduction?: Type; // stage is "generating", next it will be 'matching'
    preWrite?: Type; // stage is "matching", next it will be 'rewriting'
    postWrite?: Type; // stage is "matching", next it will be 'matching', if not at maximum index
    postProduction?: Type; // stage is "generating", next it will be 'generating', if not at maximum index
    postCycle?: Type;
}
export type Cycle<Type> = {
    generating: Type;
    matching: Type;
    rewriting: Type;
}
