### Webpack

jsPlumb can be bundled with Webpack - see `/demo/webpack` for an example. This page discusses that demonstration.

#### package.json

```
{
  "name": "jsplumb-webpack-demo",
  "version": "1.0.0",
  "description": "example of using webpack to bundle jsplumb",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "jsPlumb <hello@jsplumbtoolkit.com> (https://jsplumbtoolkit.com)",
  "license": "MIT",
  "devDependencies": {
    "grunt-webpack": "^1.0.11",
    "jsplumb": "file:../../jsplumb.tgz",
    "webpack": "^1.13.1",
    "webpack-dev-server": "^1.14.1"
  }
}
```

Note that we reference jsPlumb as a local fie (`jsplumb.tgz` is the output of `npm pack`, which creates a local copy of
what `npm publish` would post to npm). You can just require jsPlumb as you would any other dependency:

```
"devDependencies":{
  "jsplumb":"2.2.11"
}
```

2.2.11 is the most current at the time of writing. It may not be now.


#### webpack.config.js

```
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
```


#### Gruntfile.js

We're using Grunt for this demo. You don't have to use Grunt.


```
module.exports = function(grunt) {

    var webpackConfig = require("./webpack.config.js");

    grunt.loadNpmTasks("grunt-webpack");

    grunt.initConfig({
        webpack: {
            options: webpackConfig,
            build: {}
        }
    });

    grunt.registerTask("build", ["webpack:build"]);
};

```


#### index.js


```
var j = require("./node_modules/jsplumb/dist/js/jsplumb.js").jsPlumb.getInstance({
    Connector: "Flowchart",
    Anchor: "Bottom",
    Endpoint: [ "Dot", { radius: 2 }],
    ConnectionOverlays: [
        [ "Arrow", { location: 0, width: 10, length: 7, foldbackPoint: 0.62, direction:-1 }]
    ]
});

j.connect({source: "one", target: "two" });

j.on(window, "resize", j.repaintEverything);

```

A point to note is that jsPlumb exports a bunch of things, so the `require` statement has to further specify `jsPlumb`
before it can call `getInstance`. We do this (export a bunch of things) because several of the modules that jsPlumb
depends on can be used independently of jsPlumb.

The full list of exports from the `require` statement above is:

- Biltong  - Geometry functions
- Katavorio - Drag/drop manager
- Mottle    - Event manager
- jsBezier  - Bezier curve functions
- jsPlumb   
- jsPlumbUtil - Utility functions

