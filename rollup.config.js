import resolve from 'rollup-plugin-node-resolve';
//import commonjs from 'rollup-plugin-commonjs';

import babel from 'rollup-plugin-babel';
//import typescript from 'rollup-plugin-typescript';

const extensions = [
    '.ts'
];


export default [
    // browser-friendly UMD build
    {
        input: './ts/index.ts',
        output: {
            name: 'jsplumb-rollup',
            file: 'dist/jsplumb-rollup.js',
            format: 'umd'
        },
        plugins: [
            resolve({ extensions }),   // so Rollup can find `ms`
            //commonjs(),  // so Rollup can convert `ms` to an ES module
            //typescript() // so Rollup can convert TypeScript to JavaScript

            babel({ extensions, include: ['ts/**/*'] })
        ]
    }//,

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    // {
    //     input: 'src/main.ts',
    //     external: ['ms'],
    //     plugins: [
    //         typescript() // so Rollup can convert TypeScript to JavaScript
    //     ],
    //     output: [
    //         { file: pkg.main, format: 'cjs' },
    //         { file: pkg.module, format: 'es' }
    //     ]
    // }
];
