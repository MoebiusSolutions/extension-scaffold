# Login to Private NPM Registry

You will need to access a private NPM registry to build this project.
Depending on your development environment you will need to use a different login command.

See below.

## OSA/CSA Artifactory

`npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-group/ --scope @gots`

## DI2E Nexus

`npm login --registry https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM/ --scope @gots`

## Moebius Nexus

`npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots`

## Export `NPM_AUTH_TOKEN`

```bash
$ grep _authToken ~/.npmrc
$ export NPM_AUTH_TOKEN={value you copied from grep}
```

> Note: `grep` should return something like this:
```
//nexus.moesol.com/repository/gccsje-npm-hosted/:_authToken=blah-blah-some-token-here
```

Thus, your export would look like this:

```
$ export NPM_AUTH_TOKEN=blah-blah-some-token-here
```

> Note: Becareful to **not** leak this token value to the `git` repository.
