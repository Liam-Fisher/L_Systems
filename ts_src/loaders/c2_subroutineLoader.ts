import {subroutineTemplate} from '../definitions/templates/subroutineSyntax';
import {functionFromTemplate} from '../helpers/subroutine';
import { CodeLoading } from './c1_codeLoader';
import { formatPath } from '../helpers/files';
export const SubroutineLoading = function<BaseClass extends ReturnType<typeof CodeLoading>>(Base: BaseClass) {
    return class SubroutineLoader extends Base {
static _has_subroutine(ID: string) {
    return (typeof this?.[ID] === 'function');
}
static _create_subroutine(ID: string, obj: subroutineTemplate) {
    this[ID] = Function(...functionFromTemplate(obj, ID));
    return ID;
}
static _destroy_subroutine(ID: string) {
    if (this._has_subroutine(ID)) return delete this[ID];
}
static async load_subroutine(ID: string, ...categories: string[]) {
    if (this._has_subroutine(ID)) {
        return this._create_subroutine(ID, await require(
            formatPath(3, 'json', ID, 'data','templates', 'subroutines', ...categories)));
    }
}
}
}