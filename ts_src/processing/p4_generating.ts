import { System } from "../classes/system";
import { Schema } from "../definitions/templates/schemaSyntax";
import { InterpretationProcessing } from "./p3_interpretation";
export const GeneratorProcessing =
    function <SourceClass extends ReturnType<typeof InterpretationProcessing>>(Source: SourceClass) {
        return class GeneratorProcessor extends Source {
            static generators: Map<string, Generator<string, string, unknown>>;
            constructor(...args: any[]) {
                super();
            }
            createGenerator(systemID: string) {
                if (!GeneratorProcessor.generators.has(systemID)) {
                    let targetSystem = GeneratorProcessor.systems.get(systemID);
                    if (!targetSystem) console.error(`systemID: ${systemID} generator failed, id does not exist`);
                    let targetSchema = GeneratorProcessor.schemata.get(targetSystem.schema); // make this a schema
                    if (!targetSchema) console.error(`systemID: ${systemID} generator failed, no schema: ${targetSystem.schema}`);
                    if (targetSystem && targetSchema) GeneratorProcessor.generators.set(systemID, this.produce(targetSystem, targetSchema));
                    else return false;
                }
                return true;
            }
            generate(systemID: string) {
                if (!this.createGenerator(systemID)) return ['error', systemID];
                let systemStatus = GeneratorProcessor.generators.get(systemID).next();
                if (!systemStatus.done) GeneratorProcessor.systems.delete(systemID);
                return [systemStatus.value, systemID];
            }
            *produce(sys: System, schema: Schema<'loaded'>) {
                yield* this.cycle(sys, schema);
                yield* this.interpret(sys, schema);
                return sys.status;
            }
        }
    }
