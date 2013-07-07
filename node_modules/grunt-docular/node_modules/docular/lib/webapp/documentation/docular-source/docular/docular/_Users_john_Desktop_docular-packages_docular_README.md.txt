@doc overview
@name index
@description

#Docular

> Extensible Documentation Generation Based on AngularJS's Documentation Generation
> NOTE: NodeJS has access to your filesystem so please proceed with caution. I will not be held responsible for side effects of bad code or malitious docular extensions.

#Grunt Plugin For Docular: "grunt-docular"

> Docular is best used as a dependency by the grunt-docular plugin.
> The grunt-docular plugin exposes the api in a simple fashion and helps you include documentation tasks in your grunt-based build process.

![docular](http://grunt-docular.com/public/docular-screenshot.png "Docular Image")

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-docular --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-docular');
```

## The "docular" task

### Overview
In your project's Gruntfile, add a section named `docular` to the data object passed into `grunt.initConfig()`.

```js

grunt.initConfig({
    docular: {
        baseUrl: 'http://localhost:8000', //base tag used by Angular
        showAngularDocs: true, //parse and render Angular documentation
        showDocularDocs: true, //parse and render Docular documentation
        docAPIOrder : ['doc', 'angular'], //order to load ui resources
        groups: [] //groups of documentation to parse
    },
})

```

### Options
``baseURL`` (Type: `string`, default: `""`): Angular uses the <base> tag to designate the baseUrl for an app. This is helpful for helping resolve routes and location through the $location service

``showAngularDocs`` (Type: `boolean`, default: `false`): The angular source is included in the docular package so it can be parsed and rendered to both help test the docular package and provide angular documentation for apps that use it.

``showDocularDocs`` (Type: `boolean`, default: `false`): Setting this to true will have docular parse and render the documentation for the docular plugin itself. This is helpful for developers to understand the default doc api (docular-doc-api-doc) to help them create their own docular api extensions.

``docAPIOrder`` (Type: `array [string]`, default: `['doc', 'angular']`): For each docular api extension, we need to know which order to include the UI scripts and CSS due to overrides etc..

``groups`` (Type: `array [group object]`, default: `[]`): This is an array of group objects. Groups have their own api but generally consists of some meta data and lists of files that need to be parsed and rendered for documentation. For more check out

### Groups
Group configurations for Angular and the docular documentation are stored and pushed into all groups if you set the showAngularDocs and showDocularDocs options to true. These configurations are identical to what you would use to configure docular to parse and render your own documentation.

Here is the group configuration for Angular:
```js
{
    groupTitle: 'Angular Docs', //Title used in the UI
    groupId: 'angular', //identifier and determines directory
    groupIcon: 'icon-book', //Icon to use for this group
    sections: [
        {
            id: "api",
            title:"Angular API",
            scripts: ["lib/angular/js"]
        },
        {
            id: "guide",
            title: "Developers Guide",
            docs: ["lib/angular/ngdocs/guide"]
        },
        {
            id: "tutorial",
            title: "Tutorial",
            docs: ["lib/angular/ngdocs/tutorial"]
        },
        {
            id: "misc",
            title: "Overview",
            docs: ["lib/angular/ngdocs/misc"]
        }
    ]
}
```
### Group Object Attributes
``groupTitle`` (required) `string` : The string value that will propogate up to the UI as the name of the tab

``groupId`` (required) `string` : This will be the id used globally within the code and as the directory for this code. It will show in the URL for these docs ie 'http:/localhost:8000/documentation/<groupId>/blah blah'.

``groupIcon`` `(default="icon-book")` string : This is an optional attribute that determines the class put on the icon attribute in the UI. This comes from Twitter Boostrap. See [Twitter Boostrap](http://twitter.github.io/bootstrap/base-css.html#images)

``sections`` (required) `array [sectionObject]` : This determines the different sections of documentation within your group. You can see the Angular example above in how it's documentation is broken up into sections that make logical sense.

``sectionObject.id`` (required) `string` : This will be the id used globally within the code and will be the identifier in the url for documentation within this section ie 'http:/localhost:8000/documentation/<groupId>/<sectionObject.id>/blah blah'.

``sectionObject.title`` (required) `string` : The title that will show in the tab drop downs for this section of documentation

``sectionObject.scripts`` (optional) `array [string]` : The scripts array is an array of paths to folders and files that contain scripts (really of any kind... could probably be php or java or whatever although that has not been tested). These files will be parsed for documentation that resides within comments (within /** and *). The end of a comment will conclude the end of a complete documentation entry.

``sectionObject.docs`` (optional) `array [string]` : The docs array is an array of paths to folders and files that contain documentation. These files will be parsed assuming that the docs here are not within comments. So this is basically a text file full of docs. This is a great way to provide supplimental documentation, tutorials, guides, and definitions for types etc..


## Contributing
Contributing includes setting up a dev environment by cloning docular, grunt-docular, doc apis (optional), and setting up an example project. You must have NodeJS installed as well as npm (which now should come bundled with NodeJS).

NodeJS can be installed here [Install NodeJS](http://nodejs.org/)

Here is an example setup:

### Create a directory for development
In the command line create a directory and cd into it:
```shell
mkdir docular-environment
cd docular-environment
```

### Clone docular, grunt-docular, and docular api extensions
From within your environment directory:
```shell
git clone https://github.com/gitsome/docular.git
git clone https://github.com/gitsome/grunt-docular.git
```
optionally clone the docular extensions
```shell
git clone https://github.com/gitsome/docular-doc-api-doc.git
git clone https://github.com/gitsome/docular-doc-api-angular.git
```

### Setup Development Sym Links
NPM provides some sweet methods to setup a dev environment. This allows you to develop NPM dependencies for other NPM packages. [npm link documentation](https://npmjs.org/doc/link.html).

If you follow all of these steps you will have a dev environment that can run the grunt-docular grunt plugin. The grunt-plugin cloned repo will be isolated outside your docular-test code via sym links, so changes you make in the grunt-plugin code will be kept isolated from changes in your docular-test code. Additionally, docular will be sym linked from the grunt-docular code. This allows you to isolate changes for the docular code while seeing its changes in the docular-test environment.

Setup global symlink for docular:
```shell
cd docular
npm link
cd ..
```

Setup global symlink for grunt-docular:
```shell
cd grunt-docular
npm link
cd ..
```

Setup global symlink for docular extensions (optional):
```shell
cd docular-doc-api-doc
npm link
cd ..
cd docular-doc-api-angular
npm link
cd ..
```

Wire up docular sym link in the grunt-docular package. CD into the grunt-docular directory:
```shell
cd grunt-docular
npm link docular
cd ..
```

Optionally wire up the sym links for the docular extension api:
```shell
cd docular
npm link docular-doc-api-doc
npm docular-doc-api-angular
cd ..
```

Okay now time to setup the separate test project from your environment base:
```shell
mkdir docular-test
cd docular-test
```

Use npm to create an npm package for your test. Run `npm init` and follow the directions, you can use all the defaults:
```shell
npm init
```

For Grunt v4.x
```shell
npm install grunt
```

Use npm to access the global sym link for the grunt-docular npm package:
```shell
npm link grunt-docular
```

Create the following Gruntfile.js file within the root of your docular-test npm package:
```js
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        docular: {
            groups: [],
            showDocularDocs: true,
            showAngularDocs: true
        }

    });

    // Load the plugin that provides the "docular" and "docular-server" task.
    grunt.loadNpmTasks('grunt-docular');

    // Default task(s).
    grunt.registerTask('default', ['docular']);

};
```

### Run the grunt-docular tasks
Now within your docular-test project, run grunt to compile the Angular and Docular source:
```shell
grunt docular // you can also do "grunt" beaucse we set up "docular" as the default
```

Now start up the NodeJS server so you can view the documentation:
```shell
grunt docular-server
```

### Commit your changes
As usual, edit the different packages.. your changes will immediatly propagate through the sym links to your docular-test project. Submit pull requests as desired. Thank you so much for you time, energy, and ingenuity!!


## Release History
version: 0.1.1
* Included hooks into the docular api for the docular and docular-server api
