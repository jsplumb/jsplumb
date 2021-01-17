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

const EXTERNALS = {
    "@jsplumb/community-core":'@jsplumb/community-core'
}

export default [
    {
        input: './ts/core/index.ts',
        output: [
            {
                name: '@jsplumb/community-core',
                file: 'dist/core/js/jsplumb.core.cjs.js',
                format: 'cjs'
            },
            {
                name: '@jsplumb/community-core',
                file: 'dist/core/js/jsplumb.core.es.js',
                format: 'es'
            },
            {
                name: '@jsplumb/community-core',
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
        external: ['@jsplumb/community-core'],
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
            babel({ extensions, include: ['ts/**/*'] })
        ],
        onwarn:ON_WARN
    },
    // deprecated. This is the original way the community edition was packaged, with core and the browser ui stuff.
    // We make this available for users for the time being.
    {
        input: './ts/dom/index.ts',
        output: [
            {
                name: 'jsPlumb',
                file: 'dist/community/js/jsplumb.community.cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsPlumb',
                file: 'dist/community/js/jsplumb.community.es.js',
                format: 'es'
            },
            {
                name: 'jsPlumb',
                file: 'dist/community/js/jsplumb.community.umd.js',
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
