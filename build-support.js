module.exports = {
	//
	// helper to create front matter from a JS object.
	//
	createFrontMatter : function(options) {
	    var f = "---\n";
	    for (var k in options)
	        f += (k + ": " + options[k] + "\n");
	    f += "---\n";
	    return f;
	},

	//
	// helper to create a timestamp for inclusion in yaml front matter.
	//
	timestamp : function() {
	    var d = new Date();
	    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " 12:00:00";
	},

	processMarkdownFile : function(grunt, inputDir, filename, template, base, outputDir) {
	    /*var s = grunt.file.read(inputDir + "/" + filename),
	        o = this.createFrontMatter({
	            layout:template,
	            date:this.timestamp(),
	            base:base
	        });

	    grunt.file.write(outputDir + "/" + filename, o + s);*/
        this.createMarkdownFile(grunt, inputDir, filename, {
            layout:template,
            date:this.timestamp(),
            base:base
        }, outputDir);
	},

    createMarkdownFile:function(grunt, inputDir, filename, options, outputDir) {
        var s = grunt.file.read(inputDir + "/" + filename),
            o = this.createFrontMatter(options);

        grunt.file.write(outputDir + "/" + filename, o + s);
    }
};