const v = require("../package.json").version
const cp = require("child_process")
console.log(`Running npm pack in ./dist/browser-ui`)
cp.execSync("npm pack",{ cwd: `./dist/browser-ui`, env: process.env, stdio: 'inherit' } )
cp.execSync(`mv jsplumb-browser-ui-${v}.tgz jsplumb-browser-ui.tgz`,{ cwd: `./dist/browser-ui`, env: process.env, stdio: 'inherit' } )
