# Building (with Rush)

Rush is a monorepo tool like Learna or Nx.

> NOTE: `npm install` is **not** supported because we use
> dependency version  `workspace: *` to link dependencies within this repository.
> If you attempt to run `npm install` in all of the projects
> some projects will fail because `npm install` cannot resolve `workspace: *`
> as a dependency version.

Furthermore, building with `rush` is a way to make sure all of the examples
will "compile" against the `es-runtime` library.

## Install Rush

```
$ npm install -g @microsoft/rush
```

> Above is a one time requirement

## Install Dependencies

```
cd /home/extension-scaffold
rush update
```

At this point the docker container volume mounts 
have the dependencies to run the develop servers.
See below for troubleshooting tips if `rush update` fails.

> Note: existing `node_modules` folders may cause `rush update` to fail.

```
$ find . -type d -name node_modules | grep -v home-node | xargs rm -rf
```

> Note: existing `common/config/rush/pnpm-lock.yaml` may cause `rush update` to fail.
> Typically this happens if there are links to a private NPM repository 
> that you no longer have access.
> As a test, you can remove `common/config/rush/pnpm-lock.yaml` 
> to force it to be regenerated.

## Build

Build all the ES projects:

```
cd /home/extension-scaffold
rush build
```

## CI/CD Builds - `node common/scripts/install-run-rush.js`

This option is designed to support CI/CD builds.

```bash
$ node common/scripts/install-run-rush.js update
$ node common/scripts/install-run-rush.js build
```

Finally once `rush update` completes successfully,
you can locally build just `es-runtime` if you like using:

`cd es-runtime; npm run build`

> Node: `rush build` is preferred as it makes sure everything builds.
