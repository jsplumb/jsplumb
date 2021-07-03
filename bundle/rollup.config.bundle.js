import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

const extensions = [
    '.ts'
];

export default {
    input: `./index.js`,
    output: [
        {
            name: "jsPlumb",
            file: `./dist/jsplumb.bundle.umd.js`,
            format: 'iife'
        }
    ],
    plugins: [
        resolve({ extensions }),
        babel({ extensions, include: [`ts/**/*`] }),
        cleanup({ extensions:['ts', 'js']})
    ]
}



