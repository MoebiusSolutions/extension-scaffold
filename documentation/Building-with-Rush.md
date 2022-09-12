# Building with Rush

Normally, the `docker-compose` runtime environment is sufficient for development.
However, building with `rush` is a way to make sure all of the examples
will "compile" against the `es-runtime` library.

## Install Rush

```
$ npm install -g @microsoft/rush
```

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

For NPM authentication steps see [Login-to-Private-NPM-Registry](./Login-to-Private-NPM-Registry.md).

## Install Dependencies

```
cd /home/extension-scaffold
rush update
```

> Note: existing `node_modules` folders may cause `rush update` to fail.
```
$ find . -type d -name node_modules | grep -v home-node | xargs rm -rf
```

> Note: existing `common/config/rush/pnpm-lock.yaml` may cause `rush update` to fail.
> Typically this happens if there are links to a private NPM repository that you no longer have access.
> As a test, you can remove the file to force it to be regenerated.

## Build

```
cd /home/extension-scaffold
rush build
```
