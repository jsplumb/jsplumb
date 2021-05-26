const g = require("./gatlight")

g.copy("ts/core/package.json", "dist/core/package.json")
g.copy("ts/dom/package.json", "dist/browser-ui/package.json")
g.copy("ts/util/package.json", "dist/util/package.json")
