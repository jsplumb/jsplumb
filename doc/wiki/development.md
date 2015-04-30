## jsPlumb Development

#### Building jsPlumb

Instructions for running a build can be found [here](Build).

#### Pluggable Library Support
Out of the box, jsPlumb can be run standalone, or on top of jQuery.  This is achieved by delegating several core methods - tasks such as finding an element by id, finding an element's position or dimensions, initialising a draggable, etc - to the library in question.

It is possible to develop your own library adapter, should you need to, although since the introduction of "vanilla" jsPlumb there is less reason to do so.  If you do decide to do so, the existing implementations may be documented well enough for you to create your own, but contact us if you need assistance.  

###### ExtJS
To date, we've been contacted by a few different groups who have been working on an ExtJS adapter, but nothing seems to have yet come to fruition.