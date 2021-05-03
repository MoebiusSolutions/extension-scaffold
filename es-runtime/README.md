# Extension Scaffold Runtime (@gots/es-runtime)

This library provides the runtime code
to load extensions, create and manage panels wrapped
in ShadowDOM elements, and resize the panels.

## Available Scripts

### npm run build

Builds the library as ES module `build/` folder.
Your app is ready to be deployed!

# Publish the library

1. Update Version Number

NPM helps out with the `npm version` command.
To go to the next release candidate version you can use:

`npm version prerelease --preid=rc`

To go to the next release you can use:

`npm version patch`

Or to tag a specific version, say 1.0.8 use `npm version 1.0.8`

2. Make sure you are logged into npm repository:

`npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-local/ --scope @gots`

or

`npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots`

  > Note: If you need to switch registries back and forth a lot,
  > then you may want to put one of the registries into a different `npmrc` file.
  > For example, 

  > `npm login --userconfig ~/npmrc-moesol --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots` (see below for how to use `~/npmrc-moesol`)

3. Publish the release

  ```npm publish```

  > Note: `npm publish` will now trigger `npm run build` because of `script.prepublishOnly`.

  > If you are using a different file for your `npmrc`, then you can publish with something like:
  
  > `npm publish --userconfig ~/npmrc-moesol`

  or

  > `npm publish --userconfig ~/npmrc-csa`

4. Update `release` and push tags

```
git checkout release
git pull
git merge v1.0.8 # or the version you just released
git checkout develop
npm --no-git-tag-version version x.y.z-SNAPSHOT
git add .
git commit -m'x.y.z-SNAPSHOT'
git push moesol develop release --tags
git push csa develop release --tags
```
