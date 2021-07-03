import resolve from '@rollup/plugin-node-resolve';

export default {
    input: `./index.js`,
    output: [
        {
            name: "jsPlumbBrowserUI",
            file: `./dist/jsplumb.bundle.js`,
            format: 'iife'
        }
    ],
    plugins: [
        resolve()
    ]
}



