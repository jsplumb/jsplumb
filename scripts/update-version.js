/**
 Updates the current version in all package.jsons across the ts + integrations folders to match the version listed in @jsplumb/core
 */

const g = require('./gatlight')

const communityVersion = require("../package.json").version

const packages = require("../package.json").packages

function _one(filePath) {
    try {
        const p = JSON.parse(g.readString(filePath + "/package.json"))
        p.version = communityVersion

        const deps = p.dependencies
        for (let dep in deps) {
            if (dep.indexOf("@jsplumb") === 0) {
                deps[dep] = communityVersion
            }
        }

        const peerDeps = p.peerDependencies
        for (let dep in peerDeps) {
            if (dep.indexOf("@jsplumb") === 0) {
                peerDeps[dep] = communityVersion
            }
        }

        console.log(`Updating ${filePath} to version ${communityVersion}`)
        g.write(filePath + "/package.json", JSON.stringify(p, 4, 4))
    } catch (e) {
        console.log("Did not update " + filePath)
    }


}

packages.forEach((package) => {
    _one("./ts/" + package)
})

