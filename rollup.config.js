import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const extensions = [
    '.ts'
];


export default [
    {
        input: './ts/index.ts',
        output: [
            {
                name: 'jsplumb',
                file: 'dist/js/jsplumb-cjs.js',
                format: 'cjs'
            },
            {
                name: 'jsplumb',
                file: 'dist/js/jsplumb-es.js',
                format: 'es'
            },
            {
                name: 'jsplumb',
                file: 'dist/js/jsplumb.js',
                format: 'umd'
            }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, include: ['ts/**/*'] })
        ]
    }
];
