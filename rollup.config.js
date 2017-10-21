import babel from 'rollup-plugin-babel';
//import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: '_build/es6/main.js',
    output: {
        file:'_build/es5/jsplumb.js',
        format: 'iife',
        name:'jsplumb',
        sourcemap:"inline"
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            sourceMaps:"inline"
        }),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs()
    ]
};