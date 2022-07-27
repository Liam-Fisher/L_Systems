"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPath = void 0;
const formatPath = function (depth, filename, ...categories) {
    let ext;
    if (categories[0] === 'templates')
        ext = 'json';
    else if (categories[0] === 'modules')
        ext = 'js';
    else
        ext = 'txt';
    return `${'../'.repeat(depth)}${categories.concat(filename.replaceAll('_', '/')).join('/')}.${ext}`;
};
exports.formatPath = formatPath;
