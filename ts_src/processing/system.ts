import * as _f from '../definitions/formats';
import {activity} from "../definitions/literals";
export class System {
    gCtx: _f.globalContext;
    sCtx: _f.stageContext;
    pCtx: _f.productionContext;
    iCtx: _f.interpretationContext;
    update(act: activity) {
        if (this.sCtx.stage === 'idle') return false;
        this.sCtx.stage = act;
        this.sCtx.index = this.sCtx.indices.get(act) ?? -1;
        if (++this.sCtx.index === this.sCtx.amounts.get(act)) return !this.sCtx.indices.delete(act); // fancy way of saying false
        else return this.sCtx.indices.set(act, this.sCtx.index).has(act);
    }
    match() {
        this.pCtx.matches = [...this.gCtx.letters.matchAll(RegExp(this.pCtx.regex, 'g'))];
        this.sCtx.amounts.set('rewriting', this.pCtx.matches.length);
    }
    rewrite() {
        let mInd = this.pCtx.matches[this.sCtx.index].index; // where was the match?
        if (!this.pCtx.rewritten.has(mInd)) {
            this.pCtx.rewritten.add(mInd);
            this.pCtx.letters.set(mInd, this.pCtx.output.letters);
            this.pCtx.parameters.set(mInd, this.pCtx.output.parameters);
            let matchLength = this.pCtx.matches[this.sCtx.index][0].length;
            
            while (--matchLength) { // clear extra spaces if more than one character was 
                this.pCtx.letters.set(mInd + matchLength,  "");
                this.pCtx.parameters.set(mInd + matchLength,  [[]]);
            }
        }
    }
    reset() {
        this.pCtx.rewritten.clear();
        this.gCtx.letters = [...this.pCtx.letters.values()].toString().replace(/,/g, "");
        this.pCtx.letters = new Map(Array.from(this.gCtx.letters).map((l, i) => [i, l]));
        this.gCtx.parameters = [...this.pCtx.parameters.values()].flat();
        this.pCtx.parameters = new Map(this.gCtx.parameters.map((arr, i) => [i, [arr]]));
        if (this.gCtx.letters.length >= this.gCtx.constants?.letterLimit) return true;
    }
}