/**
 Updates the current version in all package.jsons across the ts + integrations folders to match the version listed in @jsplumb/core
 */

const g = require('./gatlight')

const communityVersion = require("../package.json").version
const filePath = "./ts/package.json"

try {

    const p = JSON.parse(g.readString(filePath))
    p.version = communityVersion

    const deps = p.dependencies

    console.log(`Updating ${filePath} to version ${communityVersion}`)
    g.write(filePath, JSON.stringify(p, 4, 4))
} catch (e) {
    console.log("Did not update " + filePath, e)
}

