//Wrapper function with one parameter
module.exports = function(grunt) {

  // What to do by default. In this case, nothing.
  //grunt.registerTask('default', []);


  // Project configuration.
      grunt.initConfig({
   
          pkg: grunt.file.readJSON('package.json'),
   
          docular: {
              groups: [
              	{
              	                    groupTitle: 'Example Docs',
              	                    groupId: 'example',
              	                    groupIcon: 'icon-beer',
              	                    sections: [
              	                                            {
              	                                                id: "globals",
              	                                                title: "Globals",
              	                                                scripts: [
              	                                                    "src/jsPlumb.js"
              	                                                ],
              	                                                docs: [],
              	                                                rank : {}
              	                                            }
              	                                        ]
              	                }
              ],
              showDocularDocs: false,
              showAngularDocs: false
          }
   
      });
   
      // Load the plugin that provides the "docular" tasks.
      grunt.loadNpmTasks('grunt-docular');
   
      // Default task(s).
      grunt.registerTask('default', ['docular']);

};



// http://flippinawesome.org/2013/07/01/building-a-javascript-library-with-grunt-js/?utm_source=javascriptweekly&utm_medium=email

// angular  docs:
//  http://grunt-docular.com/ 