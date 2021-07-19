const g = require("./gatlight")
const p = require("../package.json").packages
const v = require("../package.json").version

p.forEach(pkg => {
    const target = `dist/${pkg}/package.json`
    g.copy(`ts/${pkg}/package.json`, target)
    const pp = JSON.parse(g.readString(target))
    pp.version = v

    for (let dep in pp.dependencies) {
        if (dep.indexOf("@jsplumb/") === 0) {
            pp.dependencies[dep] = v
        }
    }

    g.write(target, JSON.stringify(pp, 2, 2))
})

