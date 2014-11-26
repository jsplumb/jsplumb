// Test Meteor-specific functionality

'use strict';

Tinytest.add('Instantiation', function (test) {
  var container = document.createElement('div');
  var plumber = jsPlumb.getInstance({container: container});

  test.instanceOf(plumber, Object, 'Instantiation OK');
});
