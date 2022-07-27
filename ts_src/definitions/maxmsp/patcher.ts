type objID = `obj-${number}`;
type dims = [ number, number, number, number ];
type color = [ number, number, number, number ];
type position = [number, number];
type patcherEnvs = 'box'|'jit.gen'|'dsp.gen';
type jsonBool = '0'|'1';
interface version {
	major: number,
	minor: number,
	revision: number,
	architecture: string,
	modernui: jsonBool
}

export interface box {
    comment?: string;
    id: objID,
    maxclass:  string,
    numinlets?: number,
    numoutlets?: number,
    outlettype?: string[],
    save?: string[],
	patcher?: patcher,
    patching_rect: dims,
    text:  string
}

export interface patchline {
    source: [objID, number],
    midpoints?: dims,
    destination: [objID, number],
}
export interface dependency {
        name: string,
        bootpath: string,
        patcherrelativepath: string,
        type: string,
        implicit: number
}

interface gridSpecs {
	gridonopen: number,
	gridsize: position,
	gridsnaponopen: number|boolean
}
interface toolbarSpecs {
	toolbarvisible: jsonBool,
	toolbars_unpinned_last_save: jsonBool,
	lefttoolbarpinned: jsonBool,
	toptoolbarpinned: jsonBool,
	righttoolbarpinned: jsonBool,
	bottomtoolbarpinned: jsonBool
}
interface fontSpecs {
	default_fontsize: number,
	default_fontface: number,
	default_fontname: string
}
interface boxSpecs {
	objectsnaponopen: jsonBool,
	tallnewobj: jsonBool,
	boxanimatetime: number,
}
interface scrollSpecs {
	enablehscroll: jsonBool,
	enablevscroll: jsonBool,
}

interface uiSpecs extends gridSpecs, toolbarSpecs, fontSpecs, boxSpecs, scrollSpecs {
	bglocked: jsonBool,
	openinpresentation: jsonBool,
	style: string,
	assistshowspatchername: jsonBool,
}

interface metadataSpecs {
    fileversion: number,
	devicewidth: number,
	description: string,
	digest: string,
	tags: string,
	subpatcher_template: string,
	autosave: number|boolean;
}
interface specs extends uiSpecs, metadataSpecs {
    appversion: version;
	classnamespace: patcherEnvs,
	rect: dims,
}
interface gradient {
	angle : number,
	autogradient : number,
	color : color,
	color1 : color,
	color2 : color,
	proportion : number,
	type : "gradient"

}
interface style {
	name: string
	default: {
		accentcolor: color
		bgcolor: color
		bgfillcolor: color|gradient
		clearcolor: color
		color: color
		editing_bgcolor: color
		elementcolor: color
		locked_bgcolor: color
		selectioncolor: color
		textcolor: color
		textcolor_inverse: color
	}
	parentstyle: string
	multi: jsonBool
}
export interface patcher_graph {
    boxes: {
        box: box;
    }[];
    lines: {
        patchline: patchline
    }[];
    dependency_cache: dependency[];
}
export interface patcher extends specs {
	patcher: patcher_graph 
	styles: style[]
}