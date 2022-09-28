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

## Choose Your NPM Private Registry

Default is for `rush update` to install NPM artifacts from TRMC.

> Optionally, copy `common/config/rush/variants/dot-npmrc-{csa,trmc,moelab}`
> to `common/config/rush/.npmrc` in order to switch private NPM registries.

More recently the team has been building by setting up `$HOME/.npmrc`
to point at TRMC. If you want to setup your `$HOME/.npmrc` file to
point to CSA/OSA, then you can use `rush update --variant csa`, so that,
you get a pnpm-lock.yml file that points at CSA/OSA.

## Export NPM_AUTH_TOKEN

If you setup `common/config/rush/.npmrc`, that file is committed to `git`.
Rather that your real NPM authentication information use environment variables in the file
as a place holder for your actual NPM authentication information.
By default we have configured for TRMC.
Remarks show how to configure for CSA and Moebius Nexus servers.

For NPM authentication steps see 
[Login-to-Private-NPM-Registry](./Login-to-Private-NPM-Registry.md).

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

### Rush Variants

To help with the `pnpm-lock.yaml` issue, 
ES has two "Rush Variants" for the private NPM repositories for CSA and Moebius.
The default variant contains a `pnpm-lock.yaml` file built using TRMC.
So instead of removing and rebuilding `common/config/rush/pnpm-lock.yaml`,
you can use the correct variant. For example, for CSA you would run

```
cd /home/extension-scaffold
rush update --variant csa
```

## Build

Build all the ES projects:

```
cd /home/extension-scaffold
rush build
```

## CI/CD Builds - `node common/scripts/install-run-rush.js`

This option is designed to support CI/CD builds.

```bash
$ node common/scripts/install-run-rush.js update --variant csa
$ node common/scripts/install-run-rush.js build
```

Finally once `rush update` completes successfully,
you can locally build just `es-runtime` if you like using:

`cd es-runtime; npm run build`

> Node: `rush build` is preferred as it makes sure everything builds.
