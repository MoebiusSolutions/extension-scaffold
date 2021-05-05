# Extension Scaffold (ES)

ES is designed to be a lightweight alternative to OWF.
The extension design concept comes from opensource
tools such as Eclipse, VSCode, and Theia.
However, code from the above projects was not directly
utilized in an attempt to make a small and understandable implementation.

# Directory Layout

## `compose`

A docker compose environment that starts the demo 
using the `es-runtime` and starts the example extensions.
This is primarily for developing the `extension-scaffold`.

See [compose/README.md](compose/README.md)


## `es-api`

Typescript definition of Extension Scaffold API

## `es-extension-examples`

Contains sub-directories with extensions written with snowpack, rollup, webpack, etc.

## `es-runtime`

The scaffold runtime. It will load the extensions and expose the API to the loaded extensions.
The API allows the extensions to create panels.

# Extension Examples

The examples show how to use different frameworks/bundlers to create an extension.

# WIP

Expose a `boot` function from `es-runtime`. Then you would
npm i @gots/es-runtime
use a module script to load the module
and call the exported `boot` function passing
in the extensions you want to load.

# Developing es-runtime
When making changes to es-runtime we need to be able to test our code changes
using es-demo. This requires updating es-demo/node_modules/@gots/es-runtime.
To do this follows the six steps:
1) Change es-runtime/package.json version: ex: 0.2.0-build-1 --> 0.2.0-build-2
2) In es-runtime folder type: npm run build
3) In same folder type npm pack
4) In es-demo folder type: npm i ../../es-runtime/gots-es-runtime-0.2.0-build-<#>.tgz
    ex. type:  npm i ../../es-runtime/gots-es-runtime-0.2.0-build-4.tgz
5) restart es-demo docker container
6) refresh browser

# TODOs

[X] docker-compose
[X] Drag and drop resize
[X] Update examples to use `@gots/es-runtime`
[X] Get rid of `ping` method
[X] Limit max size of panel when resizing
[ ] Have an API that lets you get/set the layout as JSON
[X] Make rollup example add a center panel
[X] More layout options
    Does the bottom panel stretch all the way across or
    does the left panel touch the bottom
[ ] Add support for `body` location - like Phoenix
[ ] Themes?
[X] publish `es-runtime` as npm module
[ ] Get display-rules to run in a panel
[ ] Get AE, PWC or webmap to run in a panel
[ ] PWA support
[ ] Show loading until extensions load
[ ] If you hide `left` then also hide `above-left` (same for `right`)
[ ] Get import css to work with `rollup`, `webpack`, and `snowpack`.
[ ] Push to DI2E Bitbucket
[ ] Write Getting-Started-Guid.md
[ ] Write Programmer's Guid.md
