import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

const extensions = [
    '.ts'
];

function ON_WARN(warning, rollupWarn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
        warning.cycle.forEach((c) => {
            if (c.endsWith("index.ts")) {
                throw new Error(warning.message)
            }
        })
        console.log(warning.message)
    }
}

// package list is stored in package.json
const packages = require("./package.json").packages
// as are names for the packages.
const packageNames = require("./package.json").packageNames

const out = []

out.push({
    input: `./ts/index.ts`,
    output: [
        {
            name: "jsPlumb",
            file: `dist/browser-ui/js/jsplumb.browser-ui.cjs.js`,
            format: 'cjs'
        },
        {
            name: "jsPlumb",
            file: `dist/browser-ui/js/jsplumb.browser-ui.es.js`,
            format: 'es'
        },
        {
            name: "jsPlumb",
            file: `dist/browser-ui/js/jsplumb.browser-ui.umd.js`,
            format: 'umd'
        }
    ],
    plugins: [
        resolve({ extensions }),
        commonjs(),
        babel({ extensions, include: [`ts/**/*`], babelHelpers:"bundled" }),
        cleanup({ extensions:['ts', 'js']})
    ],
    onwarn:ON_WARN
})


export default out



