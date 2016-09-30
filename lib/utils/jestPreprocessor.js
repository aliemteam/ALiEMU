const tsc = require('typescript');

const DEBUG_FILE = false;

module.exports = {
    process(src, path) {
        if (path.endsWith('.ts') || path.endsWith('.tsx')) {
            return transpile(src, path, DEBUG_FILE); // eslint-disable-line
        }
        return src;
    },
};


// Debug function to help weed out transpiled nonsense that negatively affects testing
function transpile(src, path, debugFile) {
    if (!debugFile) {
        return (
            tsc.transpile(
                src, {
                    module: tsc.ModuleKind.CommonJS,
                    jsx: tsc.JsxEmit.React,
                },
                path, []
            )
            .replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2')
            .replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */')
            .replace(/(var __assign = \(this && this.__assign\) \|\| Object.assign)/g, '$1 /* istanbul ignore next */')
            .replace(/^(require|import).*\.css.*;$/gm, '')
        );
    }

    const fs = require('fs'); // eslint-disable-line
    const code = tsc.transpile(
        src, {
            module: tsc.ModuleKind.CommonJS,
            jsx: tsc.JsxEmit.React,
        },
        path, []
    )
    .replace(/(}\)\()(.*\|\|.*;)/g, '$1/* istanbul ignore next */$2')
    .replace(/(var __extends = \(this && this.__extends\))/g, '$1/* istanbul ignore next */')
    .replace(/(var __assign = \(this && this.__assign\) \|\| Object.assign)/g, '$1 /* istanbul ignore next */')
    .replace(/^(require|import).*\.css.*;$/gm, '');


    if (path.endsWith(debugFile)) fs.writeFileSync('DEBUG_FILE.js', code);
    return code;
}
