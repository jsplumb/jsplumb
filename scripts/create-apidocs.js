const fs = require('fs');
const g = require('./gatlight');
const cp = require("child_process")


const conf = {
    "extends": "../api-extractor-common.json",
    "mainEntryPointFilePath": "../dist/browser-ui/types/index.d.ts"
}

g.write(`ts/api-extractor.json`, JSON.stringify(conf))

cp.execSync("../node_modules/@microsoft/api-extractor/bin/api-extractor run  --local --verbose", {cwd:`ts`, env: process.env, stdio: 'inherit' })

// api-documented

cp.execSync("npx api-documenter markdown -i ./_apidoc_models -o ./apidocs", {cwd:".", env: process.env, stdio: 'inherit' })

g.remove(`ts/api-extractor.json`)
