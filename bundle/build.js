const cp = require("child_process")
const g = require("../scripts/gatlight")

const v = require("../package.json").version

const base = "./bundle"

cp.execSync("rm -rf dist",{ cwd: base, env: process.env, stdio: 'inherit' } )
cp.execSync("rm -rf node_modules",{ cwd: base, env: process.env, stdio: 'inherit' } )
cp.execSync("npm i",{ cwd: base, env: process.env, stdio: 'inherit' } )
cp.execSync("rollup -c rollup.config.bundle.js",{ cwd: base, env: process.env, stdio: 'inherit' } )

const pp = JSON.parse(g.readString(`${base}/package.json`))
pp.version = v
delete pp.devDependencies
delete pp.scripts
pp.files = ["jsplumb.bundle.js"]
pp.main = "jsplumb.bundle.js"
pp.module = "jsplumb.bundle.js"

g.write(`${base}/dist/package.json`, JSON.stringify(pp, 2, 2))

cp.execSync("rm package-lock.json",{ cwd: base, env: process.env, stdio: 'inherit' } )

//rm -rf bundle/dist;rm -rf bundle/node_modules;cd bundle;npm i;rollup -c rollup.config.bundle.js;rm package-lock.json
