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
