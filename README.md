# Extension Scaffold (ES)

ES is designed to be a lightweight alternative to OWF.
The extension design concept comes from opensource tools such as Eclipse, VSCode, and Theia.
However, code from the above projects was not directly utilized
in an attempt to make a small and understandable implementation.

One of the major differences between OWF and `ES` is that OWF uses `iframes` to isolate each widget;
while, `ES` uses JavaScript `modules` to mostly isolate JavaScript code,
and HTML5 Shadow DOM to mostly isolate unwanted CSS interactions.
Extensions are free to use `iframes` to create a stronger barrier between extensions,
but currently `ES` does not aid (or hinder) the use of `iframes`.

Like OWF extensions can be server of outside the "Same Origin" as the "hosting" webpage.
`ES` is delivered as a NPM module.
You will need to setup your "hosting" webpage, and bundle `@gots/es-runtime`, with your webpage.
Your "hosting" webpage will use `loadExtension` to load extensions from one or more web servers.

```typescript
await extensionScaffold.loadExtension('http://localhost:9091/dist/ext-react-snowpack.js')
```

## Extension Adding Panel

![Extension Adding Panel](out/Extension-Adding-Panel/Extension-Adding-Panel.svg)

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
2) In same folder type `npm pack`
3) In es-demo folder type:
   `npm i ../../es-runtime/gots-es-runtime-0.2.0-build-<#>.tgz`
    ex. type:
    `npm i ../../es-runtime/gots-es-runtime-0.2.0-build-4.tgz`
4) restart es-demo docker container, use UI or `cd compose`
   and then `docker-compose restart es-demo`
5) refresh browser
