# Extension Scaffold Runtime (@gots/es-runtime)

This library provides the runtime code
to load extensions, create and manage panels wrapped
in ShadowDOM elements, and resize the panels.

## Available Scripts

### `npm run build`

Builds the library as ES module in the `build/` folder.

# Publish `@gots/es-runtime`

## 1. Update the [CHANGELOG.md](../CHANGELOG.md)

By updating what has changed since the last release, you can decide if there are breaking changes,
which require a major version number change.
Determine what the next version number will be.

## 2. Update Version Number

From the `es-runtime` folder, use the `npm version` command. 
To go to the next minor release you can use:

```bash
$ cd es-runtime
$ npm version minor
```

Or to set a specific version, say 1.0.8 use `npm version 1.0.8`

Normally, this would also create a `git tag`, but because `es-runtime` is nested
one level down in our directory layout, `npm` skips the tagging part.
See below for when / how to `git tag`.

## 3. Make sure you are logged into a private npm repository

Depending on which project/contract you are working you may
have access to one or more private npm repositories.
These are the ones that are currently known to the author:

1. OSA/CSA - https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-local/
2. DI2E - https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM
3. Moebius - https://nexus.moesol.com/repository/gccsje-npm-hosted/

You can verify if you are logged into a registry using the `npm whoami` command.

For example, for the Moebius registry you can run:

```
npm whoami --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/
```

If you are not logged into the private npm repository you can
login for the "scope" `@gots` using one of the command lines below.

For CSA use:

```
npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-local/ --scope @gots
```

For DI2E use:

```
npm login --registry https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM --scope @gots
```

For Moebius use:

```
npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots
```

  > Note: If you need to switch registries back and forth a lot,
  > then you may want to put one of the registries into a different `npmrc` file.
  > For example: 
  >
  > `npm login --userconfig ~/npmrc-moesol --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots`
  > (see below for how to use `~/npmrc-moesol`).
  > The `--userconfig` option works for `npm whoami` as well: 
  > `npm --userconfig ~/npm-moe whoami --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/`

## 4. Publish the release

```
npm publish
```

  > Note: `npm pack` and `npm publish` will now trigger `npm run build` because of `"scripts": { "prepack": ... }` in `package.json`.

  > If you are using a different file for your `npmrc`, then you can publish with something like:
  
  > `npm publish --userconfig ~/npmrc-di2e`

  or

  > `npm publish --userconfig ~/npmrc-csa`

## 5. Update examples and demo

Be sure you `npm login` to the registry you want to pull `@gots/es-runtime` from.
If you are using a file you can use `NPM_CONFIG_USERCONFIG=~/npmrc-di2e` to get `npm install`
to use those credentials.

```
NPM_CONFIG_USERCONFIG=~/npmrc-di2e ./extension-scaffold/es-runtime/scripts/upgrade-all.sh
git add -a
git commit -m'upgrade to version x.y.z`
```

> Note: if you leave `es-home` or `es-common-extensions` referencing
> `es-runtime@file:../es-runtime` then the Dockerfile build for `es-home` 
> will fail since the reference points outside of the files copied into
> the docker build environment.

## 6. Tag the repository

### Checkout the `develop` branch and get the latest changes.

```
$ git checkout develop
$ git pull
$ git status # make sure we have a clean folder
```

### Checkout the `release` branch and get the latest changes.

To follow the NIWC practice of having the `release` branch
point at the latest release, switch to the release branch.

```
$ git checkout release
$ git pull
$ git status            # make sure we have a clean folder
$ git merge develop     # Catch release up to develop
$ git status            # make sure we have a clean folder
```

### Create the Tag

NPM would normally tag the git repository with a tag named `v{$version}`.
So for version 1.2.3, you would tag with this command:

```
git tag v1.2.3
```

## 7. Setup for the next release

```
$ git checkout develop
$ git merge release     # So that develop has the tag too

$ npm --no-git-tag-version version x.y.z-SNAPSHOT            # Example input: 1.2.0-SNAPSHOT
# Do not use the --preid example below or the nightly build script will not pickup the updates.
# npm --no-git-tag-version version prepatch --preid=SNAPSHOT # Example output: 1.2.1-SNAPSHOT.0

$ NPM_CONFIG_USERCONFIG=~/npmrc-di2e ./extension-scaffold/es-runtime/scripts/link-all.sh


$ git -a .
$ git commit -m 'Prepare for next development cycle, set version to 1.2.1-SNAPSHOT.0' # Use your new version

$ gitk --all # Verify branches and tags
```

## 8. Push to the repositories

You can get a list of the git repositories you have configured with

```
git remote
```

For each remote:
```
git push {remote} develop release --tags
```

For example, if you have `di2e`, `csa`, and `moelab` as remotes, then you would run:

```
git push di2e develop release --tags
git push csa develop release --tags
git push moelab develop release --tags
```
