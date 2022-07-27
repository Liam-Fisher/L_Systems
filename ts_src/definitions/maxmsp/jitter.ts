 
type jitSplice = 'concat'|'split'|'glue'|'scissors'|'submatrix'|'unpack'|'pack';
type jitData = 'demultiplex'|'multiplex'|jitSplice|'coerce'|'thin';

type jitSystem = `p.${'bounds'|'shiva'|'vishnu'}`|'conway'|'linden';
type jitDevices = 'avc'|'desktop'|'displays'|'videoout'|'window';
type jitLists = 'fill'|'iter'|'spill';
type jitNetworking = 'net.send'|'net.recv'|'uldl';
type jitFile = 'movie'|'record'|'vcr';
type jitCode = 'gen'|'pix'|'turtle'|'openexr';
type jitMap = 'bfg'|'noise'|'gencoord'|'gradient'|'graph'|'plot';
type jitGenerators = jitMap|jitSystem|jitCode|jitFile|jitDevices|jitLists|jitNetworking;

type jitAnalysis = '3m'|'bsort'|'change'|'findbounds'|'histogram'|'normalize'|'fft';
type jitLaMath = `la.${'determinant'|'diagproduct'|'inverse'|'mult'|'trace'|'uppertri'}`;
type jitOp = `${'char'|'dim'|''}map`|`${'plane'|'dim'|''}op`;
type jitMath = 'clip'|'expr'|'scalebias'|'transpose'|jitOp|jitLaMath|jitAnalysis;

type jitGLdata = 'buffer'|'bfg'|'texture'|'material'|'cubemap'|'pbr';
type jitGLcode = 'pix'|'shader'|'sketch'|'slab'|'pass';
type jitGLgeo =  'graph'|'gridshape'|'isosurf'|'mesh'|'nurbs'|'plato';
type jitGLobj =  'model'|'text2d'|'text3d'|'videoplane'|'multiple';
type jitGLctrl = 'asyncread'|'camera'|'handle'|'render'|'node'|'tf';
type jitGL = `gl.${jitGLctrl|jitGLdata|jitGLcode|jitGLgeo|jitGLobj}`;

type jitSpatial = 'mxform2d'|'plume';
type jitFB = 'avg4'|'brass'|'convolve'|'fastblur'|'robcross'|'sobel'|'wake'|'slide'|'glop';
type jitColorSpace =  'brcosa'|'colorspace'|'hue'|'traffic';
type jitCompositing = 'altern'|'fluoride'|'alphablend'|'chromakey'|'keyscreen'|'lumakey'|'shade'|'xfade';
type jitGrid = 'roy'|'tiffany'|'rubix'|'hatch'|`scan${'offset'|'slide'|'wrap'}`;
type jitSamp = 'ameba'|'eclipse'|'plur'|'repos'|'resamp'|'sprinkle'|'streak';
type jitFX = jitSpatial|jitColorSpace|jitFB|jitCompositing|jitGrid|jitSamp;

type jitAudio = `${'buffer'|'catch'|'peek'|'poke'|'release'}~`;
type jitStr = `str.${'fromsymbol'|'tosymbol'|'op'|'regexp'}`|'fprint'|'textfile';
type jitUI = 'matrixinfo'|'print'|'fpsgui'|'pwindow'|'scope';
type jitMisc = jitStr|jitUI|jitAudio|'cycle';

export type jitObjs = `jit.${jitData|jitGenerators|jitMath|jitGL|jitFX|jitMisc}`;