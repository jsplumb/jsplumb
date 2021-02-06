const childProcess = require("child_process");
const g = require("./gatlight")

const output = childProcess.execSync("npm link", { cwd: "./ts/core"/*, env: process.env, stdio: 'inherit' */});

const r = /(.*)\s{1}->/
const linkPath = output.toString().match(r)[1]
console.log("Path to linked core : " + linkPath)
if (linkPath != null) {
    g.mkdirs("./ts/dom/node_modules")
    g.mkdirClean("./ts/dom/node_modules/@jsplumb")
    childProcess.execSync("ln -s " + linkPath + " core", { cwd: "./ts/dom/node_modules/@jsplumb", env: process.env, stdio: 'inherit' });

} else {
    console.log("Linked path to core is null; this is a fail.")
}


