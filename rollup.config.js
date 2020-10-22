import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

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

export default [
    {
        input: './ts/core/index.ts',
        output: [
            {
                name: 'jsplumb-core',
                file: 'dist/core/js/jsplumb.core.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsplumb-core',
                file: 'dist/core/js/jsplumb.core.es.js',
                format: 'es'
            },
            {
                name: 'jsplumb-core',
                file: 'dist/core/js/jsplumb.core.umd.js',
                format: 'umd'
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/core/**/*'] })
        ],
        onwarn:ON_WARN
    },
    {
        input: './ts/dom/index.ts',
        output: [
            {
                name: 'jsPlumb',
                file: 'dist/dom/js/jsplumb.dom.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumb',
                file: 'dist/dom/js/jsplumb.dom.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumb',
                file: 'dist/dom/js/jsplumb.dom.umd.js',
                format: 'umd'
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/**/*'] })
        ],
        onwarn:ON_WARN
    }
];
