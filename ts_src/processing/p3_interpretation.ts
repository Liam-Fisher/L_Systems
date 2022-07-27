import { BlueprintLoading } from '../loaders/c6_blueprintLoader';
import { System } from '../classes/system';
import { Schema } from '../definitions/templates/schemaSyntax';
import { ProductionProcessing } from './p2_production';
export const InterpretationProcessing =
    function <SourceClass extends ReturnType<typeof ProductionProcessing>>(Source: SourceClass) {
        return class InterpretationProcessor extends Source {
            constructor(...args: any[]) {
                super();
            }
            *interpret(sys: System, schema: Schema<'loaded'>) {
                sys.amounts.set('interpretation', sys.letters.length);
                for (const [filename, fileobj] of sys.textMap.entries()) {
                    sys.broadcastMessage(fileobj.obj, ...schema.hooks?.pre_interpretation);
                    let fileGroup = schema.interpretations?.[filename];
                    while (fileGroup && sys.update('interpretation')) {
                        let letterGroup = fileGroup[sys.letters?.[sys.index]];
                        sys.inParams = [sys.parameters[sys.index]];
                        if (!sys.broadcastMessage(fileobj.obj, ...letterGroup?.[sys.letters[sys.index]]).includes(false)) continue;
                        else yield sys.status;
                    }
                    sys.broadcastMessage(fileobj.obj, ...schema.hooks?.post_interpretation);
                    fileobj.obj.close();
                }
                sys.status = 'complete';
                return sys.status;
            }
        }
    }
