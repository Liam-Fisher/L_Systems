import { networkStages } from "../static/literals";
export interface networkNode {
    id: number;
    input: string;
    obj: string;
    args: (string|number)[]
}
export type messages = {
[Stage in keyof networkStages]?: string[]
}
export interface NetworkClass {
    messages: messages
    nodes: networkNode[]
}