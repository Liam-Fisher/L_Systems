import { Core } from '../classes/core';
import { gctor} from '../definitions/static/generics';
export const CodeLoading = function<BaseClass extends gctor<Core>>(Base: BaseClass) {
    return class CodeLoader extends Base {
        static codes: number[] = [];
        static alphabet: string[] = [];
        static ctors: Map<string, new (...args: any[]) => void> = new Map();
        //static regexSpecial = [33, 36, 40, 41, 42, 43, 47, 63, 91, 92, 93, 94, 123, 124, 125];
        constructor(...args: any[]) {
            super(...args);
        }
        static defineCodes(...codes: number[]) {
            codes.forEach(code => {
                if(!this.codes.includes(code)){
                    this.codes.push(code);
                    this.alphabet.push(this.decode(code));
                } 
            });
        }
        static fromAxiom(word: number[][]) {
                let axiom = Array.from(word);
                let letters = this.decode(...this.lookup(...axiom.map(m => m.pop())));
                return [letters, axiom]; 
        }
        //regexSafe(expression: string){}
        static decode(...codes: number[]): string {
            return String.fromCodePoint(...codes);
        }
        static encode(word: string): number[] {
            return Array.from(word).map(letter => letter.codePointAt(0));
        }
        static lookup(...indices: number[]) {
            return indices.map(index => this.codes[index]).filter(code => code);
        }
        static indexed(...codes: number[]){
            return codes.map(code => this.codes.indexOf(code)).filter(index => index !== -1);
        }
    }
}