const fs = require('fs');
const g = require('./gatlight');


function isDirectory(path) {
    return fs.lstatSync(path).isDirectory()
}

const targetDir = "./_build_es6/ts";

const _one = (dir, subdir, targetBase) => {

    const path = subdir == null ? dir : dir + "/" + subdir;

    if (subdir != null) {
        try {
            g.mkdirs(targetBase + "/" + subdir);
        }
        catch (e) {
            // dir exists, no problem.
        }
    }

    let inputPath;

    const files = fs.readdirSync(path);
    files.forEach((filename) => {
        inputPath = path + "/" + filename;
        if (isDirectory(inputPath)) {
            _one(dir, (subdir ? subdir + "/" : "") + filename, targetBase);
        } else {
            if (filename.endsWith(".d.ts")) {
                const s = fs.readFileSync(path + "/" + filename);
                fs.writeFileSync(targetBase + "/" + (subdir ? subdir + "/" : "") + filename, s);
            }
        }
    })

};

_one("./_build_es6/ts/core",null, "./dist/core/types");

g.mkdirs("./dist/browser-ui/types/core");
g.mkdirs("./dist/browser-ui/types/browser-ui");
_one("./_build_es6/ts/core",null, "./dist/browser-ui/types/core");
_one("./_build_es6/ts/dom",null, "./dist/browser-ui/types/browser-ui");

g.mkdirs("./dist/community/types/core");
g.mkdirs("./dist/community/types/browser-ui");
_one("./_build_es6/ts/core",null, "./dist/community/types/core");
_one("./_build_es6/ts/dom",null, "./dist/community/types/browser-ui");
