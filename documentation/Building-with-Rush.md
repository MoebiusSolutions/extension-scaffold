# Building with Rush

Normally, the `docker-compose` runtime environment is sufficient for development.
However, building with `rush` is a way to make sure all of the examples
will "compile" against the `es-runtime` library.

## Install Rush

```
$ npm install -g @microsoft/rush
```

## Choose Your NPM Private Registry

Default is for `rush update` to install against DI2E.

Copy `common/config/rush/variants/dot-npmrc-{csa,di2e,moelab}`
to `common/config/rush/.npmrc`
in order to switch private NPM registries.

## Export NPM_AUTH_TOKEN

Since `rush` uses `common/config/rush/.npmrc`, and that file is commited
to `git`, we have placed `${NPM_AUTH_TOKEN}` in the file
as a place holder for your actual NPM authentication token.
By default we have configured for DI2E.
Remarks show how to configure for CSA and Moebius Nexus servers.

You can get an authentication token by using `npm login --registry <URL>`.
After logging in, the token will be in your `${HOME}/.npmrc` file.

## Install Dependencies

```
cd /home/extension-scaffold
rush update
```

> Note: existing `node_modules` folders may cause `rush update` to fail.
```
$ find . -type d -name node_modules | grep -v home-node | xargs rm -rf
```

## Build

```
cd /home/extension-scaffold
rush build
```
