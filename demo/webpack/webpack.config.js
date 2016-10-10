var path = require("path");
var webpack = require("webpack");
module.exports = {
    cache: true,
    entry: {
        bundle: "./index.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "dist/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    }
};