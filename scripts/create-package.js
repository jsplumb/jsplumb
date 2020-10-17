const version = require("../package.json").version
const fs = require('fs')

const inputFile = "./jsplumb-community-" + version + ".tgz"
const j = fs.readFileSync(inputFile)
fs.writeFileSync("./jsplumb.tgz", j)

fs.unlink(inputFile, function() {})

