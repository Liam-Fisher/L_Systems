import {Core} from '../classes/core';
import {GeneratorProcessing} from '../processing/p4_generating';
import {InterpretationProcessing} from '../processing/p3_interpretation';
import {ProductionProcessing} from '../processing/p2_production';
import {CodeLoading} from '../loaders/c1_codeLoader';
import {SubroutineLoading} from '../loaders/c2_subroutineLoader';
import {SchemaLoading} from '../loaders/c3_schemaLoader';
import { SystemLoading } from '../loaders/c4_systemLoader';
import {NetworkLoading} from '../loaders/c5_networkLoader';
import {BlueprintLoading} from '../loaders/c6_blueprintLoader';



export const load_class = async function (path: string) {
return GeneratorProcessing( InterpretationProcessing( ProductionProcessing (
    BlueprintLoading( NetworkLoading( SystemLoading( SchemaLoading( SubroutineLoading( CodeLoading(
        Core) ) ) ) ) ) ) ) );
}
