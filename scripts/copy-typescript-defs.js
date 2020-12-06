const fs = require('fs');
const g = require('./gatlight');


function isDirectory(path) {
    return fs.lstatSync(path).isDirectory()
}

const _one = (dir, subdir, targetBase) => {

    const path = subdir == null ? dir : dir + "/" + subdir;

    if (subdir != null) {
        try {
            fs.mkdirSync(targetBase + "/" + subdir);
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

g.mkdirs(targetDir + "/core/types");
g.mkdirs(targetDir + "/dom/types/core");
g.mkdirs(targetDir + "/dom/types/dom");

_one("./_build_es6/ts/core",null, "./dist/core/types");
_one("./_build_es6/ts/dom",null, "./dist/dom/types/dom");
_one("./_build_es6/ts/core",null, "./dist/dom/types/core");
