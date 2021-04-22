# Extension Scaffold (ES)

ES is designed to be a lightweight alternative to OWF.
The extension design concept comes from opensource
tools such as Eclipse, VSCode, and Theia.
However, code from the above projects was not directly
utilized in an attempt to make a small and understandable implementation.

# Layout

## `compose`

A docker compose environment that runs a proxy and starts
the runtime and the example extensions.
This is primarily for developing the `extension-scaffold`.

After installing `docker-compose` on your system and checking out this project
you can run the demonstration with `cd compose` followed by `docker-compose up -d`.
Finally, browse to `http://localhost:8080/`. Currently, the compose environment
uses many ports: `80`, `8080`, `9091`, `9092`. 
It also reserves `8081`, `8082`, and `3000` for the `nodejs` development container,
which is not used.

> Note: the `proxy` is still under construction.

## `es-api`

Typescript definition of Extension Scaffold API

## `es-extension-examples`

Contains sub-directories with extensions written with snowpack, rollup, webpack, etc.

## `es-runtime`

The scaffold runtime. It will load the extensions and expose the API to the loaded extensions.
The API allows the extensions to create panels.

# Extension Examples

The examples show how to use different bundlers to create an extension.

# WIP

Expose a `boot` function from `es-runtime`. Then you would
npm i @gots/es-runtime
use a module script to load the module
and call the exported `boot` function passing
in the extensions you want to load.

# TODOs

[_] docker-compose
[ ] DnD resize
[ ] Save/restore panel layout
[ ] More layout options
    Does the bottom panel stretch all the way across or
    does the left panel touch the bottom
[ ] Themes?
[ ] Get display-rules to run in a panel
[ ] Get AE, PWC or webmap to run in a panel
[ ] PWA support
[ ] publish npm modules