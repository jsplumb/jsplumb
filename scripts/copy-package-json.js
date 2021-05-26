const g = require("./gatlight")
const p = require("../package.json").packages

p.forEach(pkg => g.copy(`ts/${pkg}/package.json`, `dist/${pkg}/package.json`))

