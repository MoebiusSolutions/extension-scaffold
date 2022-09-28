# ES Developers

This section documents Extension Scaffold for developers wanting
to build, run, and update ES.

# Directory Layout

## `es-compose`

A docker compose environment that starts the ES `/ui/` example. 
This is primarily for developing the `extension-scaffold`.
`es-home` is running at `http://localhost/ui`.

* See [es-compose/README.md](es-compose/README.md) for more information.

## `es-runtime`

Typescript definition of Extension Scaffold API.
The Extension Scaffold runtime. 
It will load the extensions and expose the API to the loaded extensions.
The API allows the extensions to create panels.

## `es-home`

The main single page application for ES.

## `es-extension-examples`

Contains sub-directories with extensions written with snowpack, rollup, webpack, etc.
The examples show how to use different frameworks/bundlers to create an extension.
