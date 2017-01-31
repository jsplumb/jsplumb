## Building

jsPlumb consists of several scripts in development, which are concatenated together when it comes time to release.  You can run this yourself on the source - you need [Grunt](https://github.com/gruntjs/grunt) and [Jekyll](http://jekyllrb.com/).  


### Building jsPlumb

In the main project directory, execute the following command:

    grunt build   
    
The output is written into `./dist`. Subsequent builds will overwrite the contents of the `dist` directory.


### Building Custom Versions

1.5.0 introduced the ability to build custom versions of jsPlumb, omitting connectors you do not need.  This does not, 
admittedly, save you a huge amount; future releases will take this ability a step further and allow you, for instance, 
to leave out the whole `makeTarget`/`makeSource` module, should you wish to.
    
If you need only the Flowchart connectors, you'd do this:

    grunt build --connectors=flowchart
    
If you need only the State Machine connectors:

    grunt build --connectors=statemachine 
    
Valid values for `connectors` are connector names, all in lower case.

**Note** It is important you do not leave a space between values for the `connectors` or `renderers` parameters. Grunt 
will get confused if you do.

