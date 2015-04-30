## Documentation
jsPlumb's documentation is maintained in the associated wiki on GitHub, which is at [git@github.com:sporritt/jsPlumb.wiki.git](git@github.com:sporritt/jsPlumb.wiki.git). A branch that matches the current dev branch is used; at release time this branch is merged into master and then you see it on GitHub.

Documentation is edited locally using Gollum (or by hand) as per the discussion on [this page](https://github.com/wicketstuff/core/wiki/Editing-Wiki-Locally). During development, all of the `Documentation` links in the demo pages point to `http://localhost:4567`, as this is the default port on which Gollum runs.

The jsPlumb build script converts all the markdown files into html and inserts them into a final template, copying everything into `dist/docs`.

### API Documentation

API documentation, from release 1.6.0, is being generated with YUIDoc, as part of the Grunt build.

The build places the API docs in `dist/apidocs`.

