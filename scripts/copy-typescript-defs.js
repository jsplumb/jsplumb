const fs = require('fs');

const sourceDir = "./_build_es6";
const targetDir = "./dist";

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory()
}

const _one = (dir, subdir) => {

    const path = subdir == null ? dir : dir + "/" + subdir;

    if (subdir != null) {
        try {
            fs.mkdirSync(targetDir + "/" + subdir);
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
            _one(dir, (subdir ? subdir + "/" : "") + filename);
        } else {
            if (filename.endsWith(".d.ts")) {
                const s = fs.readFileSync(path + "/" + filename);
                fs.writeFileSync(targetDir + "/" + (subdir ? subdir + "/" : "") + filename, s);
            }
        }
    })

};

_one(sourceDir, null);
