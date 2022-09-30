# Releasing a New Version

## 1. Update the [CHANGELOG.md](../CHANGELOG.md)

By updating what has changed since the last release, you can decide if there are breaking changes,
which require a major version number change.
Determine what the next version number will be.

---

# Rush Instructions

## 2. Tag Release/Publish Using Rush (Experimental)

```bash
$ rush version --bump -b release
$ git switch release; git tag v{x.y.z}
$ export NPM_TRMC_TOKEN=(your trmc token)
$ rush publish --include-all --publish
$ git switch develop
$ git merge release
$ rush version --bump --override-bump preminor --override-prerelease-id SNAPSHOT
$ gitk --all # verify
$ git push all develop release --follow-tags
```

The default location for `rush publish` is TRMC.
To publish to CSA use:
```bash
$ export NPM_CSA_TOKEN=(your csa token)
$ rush publish --include-all --publish \
    --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-local/
```

To publish to Moebius Nexus use:
```bash
$ export NPM_MOE_TOKEN=(your moebius token)
$ rush publish --include-all --publish \
    --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/
```

---

# Non-Rush Instructions
## 2. Update Version Number

From the `extension-scaffold` folder, use the `npm version` command. 
To go to the next minor release you can use:

```bash
$ (cd es-runtime; npm version minor)
$ (cd es-home; npm version minor)
$ (cd es-iframe-to-dev-ext; npm version minor)
```

Or to set a specific version, say 1.0.8 use `npm version 1.0.8`

Normally, this would also create a `git tag`, but because `es-runtime` is nested
one level down in our directory layout, `npm` skips the tagging part.
See below for when / how to `git tag`.

## 3. Make sure you are logged into a private npm repository

Depending on which project/contract you are working you may
have access to one or more private npm repositories.

See [Login-to-Private-NPM-Registry](../documentation/Login-to-Private-NPM-Registry.md)

## 4. Publish the release

```
npm publish
```

  > Note: `npm pack` and `npm publish` will now trigger `npm run build` because of `"scripts": { "prepack": ... }` in `package.json`.

  > If you are using a different file for your `npmrc`, then you can publish with something like:
  
  > `npm publish --userconfig ~/npmrc-trmc`

  or

  > `npm publish --userconfig ~/npmrc-csa`

## 5. Update examples and demo

Now that we are using `rush`, the dependency on `@gots/es-runtime` will be listed as `workspace:*`.
So this step is no longer needed.

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

$ cd es-runtime
$ npm --no-git-tag-version version x.y.z-SNAPSHOT            # Example input: 1.2.0-SNAPSHOT
$ cd ../es-home
$ npm --no-git-tag-version version x.y.z-SNAPSHOT            # Example input: 1.2.0-SNAPSHOT

# Do not use the --preid example below or the nightly build script will not pickup the updates.
# npm --no-git-tag-version version prepatch --preid=SNAPSHOT # Example output: 1.2.1-SNAPSHOT.0

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

For example, if you have `trmc`, `csa`, and `moelab` as remotes, then you would run:

```
git push trmc develop release --tags
git push csa develop release --tags
git push moelab develop release --tags
```
