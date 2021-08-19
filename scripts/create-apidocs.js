const fs = require('fs');
const g = require('./gatlight');
const packages = require("../package.json").packages
const cp = require("child_process")

packages.forEach(pkg => {

    const conf = {
        "extends": "../../api-extractor-common.json",
        "mainEntryPointFilePath": "../../dist/<unscopedPackageName>/types/index.d.ts"
    }

    g.write(`ts/${pkg}/api-extractor.json`, JSON.stringify(conf))

    cp.execSync("../../node_modules/@microsoft/api-extractor/bin/api-extractor run  --local --verbose", {cwd:`ts/${pkg}`, env: process.env, stdio: 'inherit' })

})

// api-documented

cp.execSync("npx api-documenter markdown -i ./temp -o ./apidocs", {cwd:".", env: process.env, stdio: 'inherit' })

packages.forEach(pkg => {
    g.remove(`ts/${pkg}/api-extractor.json`)
})
