# grunt-jsdoc-plugin [![Build Status](https://travis-ci.org/krampstudio/grunt-jsdoc-plugin.png)](https://travis-ci.org/krampstudio/grunt-jsdoc-plugin)

This plugin enables you to integrate the generation of comments based documentation into your Grunt build.

## To your attention

The grunt team ask me to change the plugin name into NPM. The `grunt-contrib` namespace is now reserved to the tasks developed by the Grunt Team.
I'll in a first time, deprecate the module in NPM and then update the name to `grunt-jsdoc`. You'll have to upgrade your `package.json` once the plugin will be removed from NPM.

## Install

You need [grunt >= 0.4][grunt] as well as [node] and [npm] installed and running on your system.

You also need `java` installed and a valid `JAVA_HOME` environment variable set.

Install this grunt plugin next to your project's [Gruntfile.js][getting_started] with: 

```bash
npm install grunt-jsdoc --save-dev
```

If you use the previous version of Grunt (0.3), you can install it with:

```bash
npm install grunt-jsdoc-plugin
```


## Documentation

### Configuration

Configure the plugin to your project's [Gruntfile.js][getting_started].

First, add the `jsdoc` entry to the options of the `initConfig` method :

```javascript
grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['src/*.js', 'test/*.js'], 
            options: {
                destination: 'doc'
            }
        }
    }
});
```

The supported options are 

 * `src` : (required) an array of pattern that matches the files to extract the documentation from. You can also add the pattern to a README.md file to include it in your doc as described [there](http://usejsdoc.org/about-including-readme.html).
 * `dest` : (deprecated) to support the previous way to set up destination folder
 * `jsdoc`: (optional) the path to the jsdoc bin (needed only for some border line cases)
 * `options` : options used by jsdoc 
   * `destination`: (required) the folder where the doc is generated
   * `configure` : (optional) path to a config file
   * `template` : (optional) path or name to a different template
   * `private` : (optional) include the private functions to the doc (`true` by default).
   * ... refer the [usejsdocCli] documentation for all the available options.

Then, load the plugin 

```javascript
grunt.loadNpmTasks('grunt-jsdoc');
```

### Documentation

The current version supports only [jsdoc3] documentation style. The sources configured 
must contains valid [jsdoc3] tags. Consult the [usejsdoc] website for the details.

### Build

To generate the documentation, you need to call the `jsdoc` task :

```bash
$> grunt jsdoc
```

or integrate it to your build sequence : 

```javascript
grunt.registerTask('default', ['lint', 'test', 'jsdoc']);
```

## Contributing

Any contribution is welcome! Please check the [issues](https://github.com/krampstudio/grunt-jsdoc-plugin/issues). Do some unit tests as far as possible.

## Release History
 * _0.4.0_ Update to jsdoc 3.2.0 stable, Fix [bug #37](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/37), add integration tests
 * _0.3.0_ Partial rewrite, Fix [bug #29](https://github.com/krampstudio/grunt-jsdoc-plugin/pull/30) and minor typos fixs
   * _0.3.1_ Fix [bug #29](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/29)
   * _0.3.2_ Fix [bug #32](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/32)
   * _0.3.3_ Fix [bug #34](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/34) and [bug #36](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/34)
 * _0.2.0_ Migrate to grunt 0.4
   * _0.2.1_ Fix [bug #10](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/10)
   * _0.2.2_ Fix [bug #11](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/11)
   * _0.2.3_ Fix [bug #14](https://github.com/krampstudio/grunt-jsdoc-plugin/pull/14) and [bug #15](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/15)
   * _0.2.4_ Fix Jsdoc 3 dependency to 3.1.1 tag, enables jsdoc options [issue #19](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/19), enable to add jsdoc path [issue #13](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/13) and add peerDependencies
 * _0.1.0_ First release, includes basic support of [jsdoc3]
   * _0.1.1_ Fix [bug #2](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/2)
   * _0.1.2_ Fix [bug #4](https://github.com/krampstudio/grunt-jsdoc-plugin/issues/4) 
   * _0.1.3_ Fix [bug #7](https://github.com/krampstudio/grunt-jsdoc-plugin/pull/7), Add [feature #8](https://github.com/krampstudio/grunt-jsdoc-plugin/pull/8)
   * _0.1.4_ Use `child_process.spawn` instead of `exec` to run the command
 

[jsdoc3]: https://github.com/jsdoc3/jsdoc

## License
Copyright (c) 2012 Bertrand Chevrier  
Licensed under the MIT license.


[grunt]: https://gruntjs.com
[node]: http://nodejs.org
[npm]: http://npmjs.org
[getting_started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[usejsdoc]: http://usejsdoc.org
[usejsdocCli]: http://usejsdoc.org/about-commandline.html
