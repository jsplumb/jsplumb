const p = require("../package.json").packages
const cp = require("child_process")
p.forEach(pkg => {
    console.log(`Running npm pack in ./dist/${pkg}`)
    cp.execSync("npm pack",{ cwd: `./dist/${pkg}`, env: process.env, stdio: 'inherit' } )
})
