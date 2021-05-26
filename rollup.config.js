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

const EXTERNALS = {
    "@jsplumb/core":'jsPlumb',
    "@jsplumb/util":'jsPlumbUtil',
    "@jsplumb/bezier":'jsPlumbBezier',
    "@jsplumb/geom":'jsPlumbGeom'
}

export default [
    {
        input: './ts/util/index.ts',
        output: [
            {
                name: 'jsPlumbUtil',
                file: 'dist/util/js/jsplumb.util.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumbUtil',
                file: 'dist/util/js/jsplumb.util.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumbUtil',
                file: 'dist/util/js/jsplumb.util.umd.js',
                format: 'umd'
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/util/**/*'] }),
            cleanup({ extensions:['ts', 'js']})
        ],
        onwarn:ON_WARN
    },
    {
        input: './ts/bezier/index.ts',
        output: [
            {
                name: 'jsPlumbBezier',
                file: 'dist/bezier/js/jsplumb.bezier.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumbBezier',
                file: 'dist/bezier/js/jsplumb.bezier.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumbBezier',
                file: 'dist/bezier/js/jsplumb.bezier.umd.js',
                format: 'umd'
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/bezier/**/*'] }),
            cleanup({ extensions:['ts', 'js']})
        ],
        onwarn:ON_WARN
    },
    {
        input: './ts/geom/index.ts',
        output: [
            {
                name: 'jsPlumbGeom',
                file: 'dist/geom/js/jsplumb.geom.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumbGeom',
                file: 'dist/geom/js/jsplumb.geom.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumbGeom',
                file: 'dist/geom/js/jsplumb.geom.umd.js',
                format: 'umd'
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/geom/**/*'] }),
            cleanup({ extensions:['ts', 'js']})
        ],
        onwarn:ON_WARN
    },
    {
        input: './ts/core/index.ts',
        output: [
            {
                name: 'jsPlumb',
                file: 'dist/core/js/jsplumb.core.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumb',
                file: 'dist/core/js/jsplumb.core.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumb',
                file: 'dist/core/js/jsplumb.core.umd.js',
                format: 'umd',
                globals:{
                    "@jsplumb/util":'jsPlumbUtil',
                    "@jsplumb/bezier":'jsPlumbBezier',
                    "@jsplumb/geom":'jsPlumbGeom'
                }
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/core/**/*'] }),
            cleanup({ extensions:['ts', 'js']})
        ],
        onwarn:ON_WARN
    },
    {
        input: './ts/dom/index.ts',
        external: ['@jsplumb/core'],
        output: [
            {
                name: 'jsPlumbBrowserUI',
                file: 'dist/browser-ui/js/jsplumb.browser-ui.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumbBrowserUI',
                file: 'dist/browser-ui/js/jsplumb.browser-ui.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumbBrowserUI',
                file: 'dist/browser-ui/js/jsplumb.browser-ui.umd.js',
                format: 'umd',
                globals:EXTERNALS
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/**/*'] }),
            cleanup({ extensions:['ts', 'js']})
        ],
        onwarn:ON_WARN
    }
];


