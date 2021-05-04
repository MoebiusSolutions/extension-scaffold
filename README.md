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

## Running `npm install` in all containers

To speed startup, the docker-compose configuration normally
skips `npm install` if the `node_modules` folder already exists.
However, if you find you need to run `npm install` for all the
containers, you can use the command below to start the containers
and have `npm install` run before the `build` or `serve` steps.

`docker-compose --env-file .env.install up`

### Running Enterprise Client

You might want to run `enterprise-client` to compare how it does something.
Clone a copy of `enterprise-client` into the directory next to `extension-scaffold`.

```
$ cd ..
$ ls 
extension-scaffold
$ git clone git@gitlab.moesol.com:je/gwa/enterprise-client.git
$ ls
enterprise-client
extension-scaffold
```

You will need to log `npm` into the Nexus repository inside the container,
or the container will not start, because it will get access errors during `npm install`.
To log `npm` into Nexus:

```
$ cd ../extension-scaffold/compose
$ docker-compose run enterprise-client bash
$ npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots
```
>  Might as well verify npm install is going to work:

```
$ npm install
$ exit
```

The next time you run `docker-compose up` it will include `enterprise-client`

Browse to http://localhost:32125

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

# TODOs

[X] docker-compose
[X] Drag and drop resize
[X] Update examples to use `@gots/es-runtime`
[KT] Get rid of `ping` method
[KT] Limit max size of panel when resizing
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
