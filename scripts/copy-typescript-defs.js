const fs = require('fs');
const g = require('./gatlight');

const packages = require("../package.json").packages



function isDirectory(path) {
    return fs.lstatSync(path).isDirectory()
}


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

packages.forEach(pkg => {
    //g.copy(`ts/${pkg}/package.json`, `dist/${pkg}/package.json`)
    g.mkdirs(`./dist/${pkg}/types`);
    _one(`./_build_es6/ts/${pkg}`,null, `./dist/${pkg}/types`);
})

