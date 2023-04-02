const g = require("./gatlight")
const p = require("../package.json").packages
const v = require("../package.json").version

const target = `dist/browser-ui/package.json`
g.copy(`ts/package.json`, target)
const pp = JSON.parse(g.readString(target))
pp.version = v

g.write(target, JSON.stringify(pp, 2, 2))

