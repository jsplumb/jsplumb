const path = require('path');
// update from 23.12.2018



//function requireAll(r) { r.keys().forEach(r); }
//requireAll(require.context('./_build/', true, /\.js$/));



//require.context('./_build/', true, /\.js$/)

const webConfig = {
    //entry: { main: './_build/index.js' },
    entry:'./_build/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jsplumb-web.js'
    },
    target: 'web',
    devtool: 'source-map'//,
    // module: {
    //     rules: [
    //         {
    //             test: /\.ts$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: "babel-loader"
    //             }
    //         }
    //     ]
    // }
};

/*

 //const nodeExternals = require('webpack-node-externals');

 const serverConfig = {
     entry: { main: './_build/index.js' },
     output: {
         path: path.resolve(__dirname, 'dist'),
         filename: 'jsplumb-node.js'
     },
     target: 'node',
     externals: [nodeExternals()]

 };
 */

module.exports = [ webConfig ];