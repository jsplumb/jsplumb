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

//
// gets the list of packages considered external to the current one, which is every package except the current one
//
function getExternalsList(current) {
    return packages.filter(p => p !== current).map(p => `@jsplumb/${p}`)
}

const out = []
packages.filter(p => {
    const name = packageNames[`@jsplumb/${p}`]
    if (name == null) {
        throw `No package name found in package.json for package ${p}. Add a mapping in the "packageNames" map for this package.`
    }
    out.push({
        input: `./ts/${p}/index.ts`,
        external:getExternalsList(p),
        output: [
            {
                name: name,
                file: `dist/${p}/js/jsplumb.${p}.cjs.js`,
                format: 'cjs'
            },
            {
                name: name,
                file: `dist/${p}/js/jsplumb.${p}.es.js`,
                format: 'es'
            },
            {
                name: name,
                file: `dist/${p}/js/jsplumb.${p}.umd.js`,
                format: 'umd',
                globals:packageNames
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: [`ts/${p}/**/*`] }),
            cleanup({ extensions:['ts', 'js']})
        ],
        onwarn:ON_WARN
    })
})

export default out



