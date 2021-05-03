# Extension Scaffold

This application is designed to load extensions.
The extensions is where the primary functionality should be hosted.
This application allows extensions to register panels that
are wrapped in a shadow DOM so that each extension does not
have to worry about the CSS of other extensions interacting
with its components.

## Login to Private NPM Registry

You will need to access a private NPM registry to build this project.
Depending on your development environment you will need to use a different login command.
See below.

### OSA/CSA Artifactory

`npm login --registry https://services.csa.spawar.navy.mil/artifactory/api/npm/mtc2-c2f-npm-group/ --scope @gots`

### DI2E Nexus

`npm login --registry https://nexus.di2e.net/nexus3/repository/Private_DFNTC_NPM/ --scope @gots`

### Moebius Nexus

`npm login --registry https://nexus.moesol.com/repository/gccsje-npm-hosted/ --scope @gots`

## Available Scripts

### npm start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like "@snowpack/plugin-webpack" to your `snowpack.config.js` config file.

### npm test

Launches the application test runner.
Run with the `--watch` flag (`npm test -- --watch`) to run in interactive watch mode.
