var jsPlumb = require('jsplumb');
jsPlumb.ready(function() {
  alert("hi");
  var jsp = jsPlumb.getInstance();
  jsp.connect({source:"one", target:"two"});
  jsp.draggable(document.querySelectorAll("div"));
});

