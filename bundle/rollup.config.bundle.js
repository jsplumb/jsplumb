import resolve from '@rollup/plugin-node-resolve';

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
        resolve()
    ]
}



