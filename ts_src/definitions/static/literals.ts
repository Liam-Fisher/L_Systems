import * as _j from '../maxmsp/patcher';
export type networkStages = { 'load', 'read', 'start', 'write', 'end', 'close'};
export type networkStage = keyof networkStages;
export type ctrlStages = { 'systems', 'interactions', 'files', 'networks'}
export type ctrlStage = keyof ctrlStages;

export type templates = { 'blueprints', 'schemata', 'states', 'subroutines'}
export type template = keyof templates;
export type subroutines = { 'hooks', 'rules', 'interpretations'}
export type subroutine = keyof subroutines;

export type systemStages = { 'cycle', 'production', 'mapping', 'interpretation'}
export type systemStage = keyof systemStages;

export type systemStatus = 'active'|'error'|'complete';

export type loaded = 'stored'|'loaded';
export type ruleType = 'metric'|'map';

export type hookTriggers = 'pre'|'post'|'on';
export type hooks = `${hookTriggers}_${systemStage}`;
export type streamModes = { "Readable", "Writable", "Duplex", "Transform" }
export type streamMode = keyof streamModes;
export type sInt = `${'U'|''}Int`;
export type bufferNum = `${`${sInt}${'16'|'32'}`|`Big${sInt}64`|'Float'|'Double'}BE`|`${sInt}8`;


export type patcherHosts = { 'abstraction', 'bpatcher','window','shroud','unique','dynamic' }
export type patcherHost = keyof patcherHosts; 


export type boolOps = "&&" | "||" | "??";
export type eqOps = `${`${'!' | '='}${'=' | ''}` | '>' | '<'}${'=' | ''}`;
export type mathOps = "&" | "|" | ">>" | "<<" | ">>>" | "+" | "-" | "*" | "**" | "/" | "%";
export type assignOps = `${mathOps | boolOps }=`;
export type loops = { 'while', 'do.while', 'for'};
export type iterations = { 'for.in', 'for.of', 'for.await' };

//export type systemStreams = { "file", "std", "net" };
//export type maxStreams = { "audio", "video", "midi" };

// aliases
// compiled types




