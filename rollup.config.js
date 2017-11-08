import babel from 'rollup-plugin-babel';
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
        commonjs({
            exclude:'node_modules/**',
            include: 'node_modules/katavorio/src',

            extensions:["js"],
            ignoreGlobal: false,  // Default: false
            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: false
        })
    ]
};