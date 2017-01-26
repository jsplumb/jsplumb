/**
 * This runs as a preinstall. It recurses through the directories in the project and runs `npm install` anywhere it finds
 * a `package.json` (it skips `node_modules` directories)
 */

"use strict";

const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const root = process.cwd()
npm_install_recursive(root)
grunt_build_recursive(root)

// Since this script is intended to be run as a "preinstall" command,
// it will be `npm install` inside root in the end.
console.log('===================================================================')
console.log(`Performing "npm install" inside root folder`)
console.log('===================================================================')

function npm_install_recursive(folder)
{
    const has_package_json = fs.existsSync(path.join(folder, 'package.json'))

    // Since this script is intended to be run as a "preinstall" command,
    // skip the root folder, because it will be `npm install`ed in the end.
    if (folder !== root && has_package_json)
    {
        console.log('===================================================================')
        console.log(`Performing "npm install" inside ${folder === root ? 'root folder' : './' + path.relative(root, folder)}`)
        console.log('===================================================================')

        npm_install(folder)
    }

    for (let subfolder of subfolders(folder))
    {
        npm_install_recursive(subfolder)
    }
}

function npm_install(where)
{
    child_process.execSync('npm install', { cwd: where, env: process.env, stdio: 'inherit' })
}

function subfolders(folder)
{
    return fs.readdirSync(folder)
        .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
        .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
        .map(subfolder => path.join(folder, subfolder))
}

function grunt_build_recursive(folder)
{
    const has_gruntfile = fs.existsSync(path.join(folder, 'Gruntfile.js'))

    // Since this script is intended to be run as a "preinstall" command,
    // skip the root folder, because it will be `npm install`ed in the end.
    if (folder !== root && has_gruntfile)
    {
        console.log('===================================================================')
        console.log(`Performing "grunt build" inside ${folder === root ? 'root folder' : './' + path.relative(root, folder)}`)
        console.log('===================================================================')

        grunt_build(folder)
    }

    for (let subfolder of subfolders(folder))
    {
        grunt_build_recursive(subfolder)
    }
}

function grunt_build(where)
{
    child_process.execSync('grunt build', { cwd: where, env: process.env, stdio: 'inherit' })
}

