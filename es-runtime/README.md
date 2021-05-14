# Extension Scaffold Runtime (@gots/es-runtime)

This library provides the runtime code
to load extensions, create and manage panels wrapped
in ShadowDOM elements, and resize the panels.

## Available Scripts

### `npm run build`

Builds the library as ES module in the `build/` folder.

# Publish `@gots/es-runtime`

## 1. Update Version Number

NPM helps out with the `npm version` command.
To go to the next release candidate version you can use:

```
npm version prerelease --preid=rc
```

To go to the next release you can use:

```
npm version patch
```

Or to tag a specific version, say 1.0.8 use `npm version 1.0.8`

Normally, this would also create a `git tag`, but because `es-runtime` is nested
one level down in our directory layout, `npm` skips the tagging part.
See below for when / how to `git tag`.

## 2. Make sure you are logged into npm repository:

For DI2E use:

```
npm login --registry https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM --scope @gots
```

For CSA use:

```
npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-local/ --scope @gots
```

For Moebius use:

```
npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots
```

  > Note: If you need to switch registries back and forth a lot,
  > then you may want to put one of the registries into a different `npmrc` file.
  > For example, 

  > `npm login --userconfig ~/npmrc-moesol --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots`
  > (see below for how to use `~/npmrc-moesol`)

## 3. Publish the release

```
npm publish
```

  > Note: `npm pack` and `npm publish` will now trigger `npm run build` because of `script.prepack` in `package.json`.

  > If you are using a different file for your `npmrc`, then you can publish with something like:
  
  > `npm publish --userconfig ~/npmrc-di2e`

  or

  > `npm publish --userconfig ~/npmrc-csa`

## 4. Update examples and demo

Be sure you `npm login` to the registry you want to pull `@gots/es-runtime` from.
If you are using a file you can use `NPM_CONFIG_USERCONFIG=~/npmrc-di2e` to get `npm install`
to use those credentials.

```
NPM_CONFIG_USERCONFIG=~/npmrc-di2e ./extension-scaffold/es-runtime/scripts/upgrade-all.sh
git add -a
git commit -m'upgrade to version x.y.z`
```

## 5. Tag the repository

NPM would normally tag the git repository with a tag named `v{$version}`.
So for version 1.2.3, you would tag with this command:

```
git tag v1.2.3
```

## 6. Push to the repositories

You can get a list of the git repositories you have configured with

```
git remote
```

For each remote:
```
git push {remote}
git push {remote} --tags
```

For example, if you have `di2e`, `csa`, and `moelab` as remotes, then you would run:

```
git push di2e
git push di2e --tags
git push csa
git push csa --tags
git push moelab
git push moelab --tags
```
