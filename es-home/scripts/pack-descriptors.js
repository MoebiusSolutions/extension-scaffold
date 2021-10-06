const fs = require('fs')
const path = require('path');

const extensions = []
const applications = []

function readExtensions() {
    const directory = 'data/extensions'
    fs.readdirSync(directory).forEach(file => {
        const full = path.resolve(directory, file)
        console.log(`Info: reading ${full}`)
        const bytes = fs.readFileSync(full)
        const record = JSON.parse(bytes)
        if (!record.url) {
            console.error('Missing url property')
        }
        if (!record.provides) {
            console.error('Missing provides property')
        }
        extensions.push(record)
    })
}

function readApplications() {
    const directory = 'data/applications'
    fs.readdirSync(directory).forEach(file => {
        const full = path.resolve(directory, file)
        console.log(`Info: reading ${full}`)
        const bytes = fs.readFileSync(full)
        const record = JSON.parse(bytes)
        if (!record.name) {
            console.error('Missing name property')
        }
        if (!record.ribbon) {
            console.error('Missing ribbon property')
        }
        if (!record.center) {
            console.error('Missing center property')
        }
        if (!record.extensions) {
            record.extensions = []
        }
        applications.push(record)
    })
}

function resolveApplications() {
    const idToExtension = new Map()

    extensions.forEach(ext => {
        ext.provides.forEach(entry => {
            idToExtension.set(entry.id, ext.url)
        })
    })
    // console.log('id2ext', idToExtension)

    applications.forEach(app => {
        const searchKeys = [
            'ribbon',
            'header',
            'footer',
            'left',
            'right',
            'center',
            "top-bar",
            'bottom-bar'
        ]

        const neededExtensionUrls = new Set()
        const missingExtensions = new Set()
        searchKeys.forEach(key => {
            if (app[key]) {
                app[key].forEach(id => {
                    const url = idToExtension.get(id)
                    if (url) {
                        neededExtensionUrls.add(url)
                    } else {
                        missingExtensions.add(id)
                    }
                })
            }
        })
        if (missingExtensions.size > 0) {
            console.warn(`Warning: ${app.name} is missing extensions to provide`, missingExtensions)
        }
        app.extensions = app.extensions.concat(Array.from(neededExtensionUrls))
    })
}

function writeApplications() {
    const directory = 'public/apps'
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    applications.forEach(app => {
        const full = path.resolve(directory, `${app.name}.json`)
        console.log(`Info: writing ${full}`)
        const bytes = JSON.stringify(app, null, 2)
        fs.writeFileSync(full, bytes)
    })
}

function main() {
    readExtensions()
    readApplications()
    resolveApplications()
    writeApplications()
}

main()
