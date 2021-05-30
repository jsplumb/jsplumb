const p = require("../package.json").packages
const v = require("../package.json").version
const cp = require("child_process")
p.forEach(pkg => {
    console.log(`Running npm pack in ./dist/${pkg}`)
    cp.execSync("npm pack",{ cwd: `./dist/${pkg}`, env: process.env, stdio: 'inherit' } )
    cp.execSync(`mv jsplumb-${pkg}-${v}.tgz jsplumb-${pkg}.tgz`,{ cwd: `./dist/${pkg}`, env: process.env, stdio: 'inherit' } )
})
