module.exports = {
	// find the project base dir from the assetPath
    baseDir: function(assetPath) {
        return "\"" + (assetPath.indexOf("../") == -1 ? ".." : "../..") + "\"";
    }
};