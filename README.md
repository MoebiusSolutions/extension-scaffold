# Extension Scaffold (ES)

ES is designed to be a lightweight alternative to OWF.
The extension design concept comes from opensource
tools such as Eclipse, VSCode, and Theia.
However, code from the above projects was not directly
utilized in an attempt to make a small and understandable implementation.

# Layout

## `es-api`

Typescript definition of Extension Scaffold API

## `es-extension-examples`

Contains sub-directories with extensions written with snowpack, rollup, webpack, etc.

## `es-runtime`

The scaffold runtime. It will load the extensions and expose the API to the loaded extensions.
The API allows the extensions to create panels.

# Extension Examples

Until a `docker-compose` demonstration environment is configured,
you will need to start each example in its own shell.
From a clean `git clone`, create a new console/shell window.
Change to the directory of the example you want to build/run.

```
npm install
npm start
```

Once you have one or more of the example servers running,
you can finally start the `es-runtime`, which is currently
hard coded to find the extensions on `localhost` but on different ports.

From the `es-runtime` directory,

```
npm install
npm start
```

A webpage should open showing the extensions in panels.
