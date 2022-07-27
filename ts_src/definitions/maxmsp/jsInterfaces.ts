export interface networkNode {
    id: number;
    input: string;
    obj: string;
    args: (string|number)[]
}

export type bufferAttrs = {
    id: string,
    samples: number,
    channels: number
}
export type matrixAttrs = {
    id: string,
    dims: number[],
    planecount: number[],
    type: 'char'|'long'|'float32'|'float64'
}