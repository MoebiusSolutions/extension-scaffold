# Extension Scaffold

This application is designed to load extensions.
The extensions is where the primary functionality should be hosted.
This application allows extensions to register panels that
are wrapped in a shadow DOM so that each extension does not
have to worry about the CSS of other extensions interacting
with its components.

# Data Driven Panels

> Note: Work In-Progress these formats may be updated as development continues

In order to prevent the need for creating multiple "hosting" pages,
this web application makes a `fetch` request back to the server
to load the data for the requested "application".

We borrow a design from Linux where we allow the configuration data
to be spread over many files. Then, we use a script `es-home/scripts/pack-descriptors.js`
to combine the files so that we only need to make a single `fetch` to get
all of the configuration information we need to initialize the panels.

## Folder Layout

* `data/applications/*.json`

We expect one file per "application". 
An "application" configuration is defined in JSON.
It must define a "name" property, which defines the "application" name.
Then it defines other properties to define the panel layout.

Below is an example for `aasw.json`

```json
{
    "name": "aasw",
    "title": "Adaptive ASW",
    "ribbon": [
        "aeolus.view",
        "aeolus.chart.settings",
        "aasw.ribbon.tab",
        "dss.help"
    ],
    "left": [ 
        "aasw.case.explorer" 
    ],
    "center": [
        "aeolus.map"
    ],
    "bottom-bar": [
        "aasw.case.manager"
    ]
}
```

* `data/extensions/*.json`

We expect one file per "extension".
Extensions are defined in JSON format.

> Note: a single extension can create and register multiple panels

The extension configuration defines the "url" of the extension.
It also defines an array panel IDs in the "provides" property.
The extensions configuration does not need to list every panel ID that is provides,
but it should list the panel IDs that will be needed by "applications".

These IDs are then used by `es-home/scripts/pack-descriptors.js` to compute
which extensions are needed by an "application".

Below is an example for "aeolus":

```json
{
    "url": "https://dev26/aeolus/es-init.js",
    "provides": [
        {
            "title": "Map",
            "id": "aeolus.map"
        },
        {
            "title": "View",
            "id": "aeolus.view"
        },
        {
            "title": "View",
            "id": "aeolus.chart.settings"
        },
        {
            "title": "Layer Manager",
            "id": "aeolus.layer.manager",
            "iframe": "https://dev26/aeolus/map.layer.html"
        }
    ]
}
```

Finally, these files are combined to produce `public/aaws.json`:

```json
{
  "name": "aasw",
  "ribbon": [
    "aeolus.view",
    "aeolus.chart.settings",
    "aasw.ribbon.tab",
    "dss.help"
  ],
  "left": [
    "aasw.case.explorer"
  ],
  "center": [
    "aeolus.map"
  ],
  "bottom-bar": [
    "aasw.case.manager"
  ],
  "extensions": [
    "https://dev26/aeolus/es-init.js",
    "https://dev26/case/es-entry.js",
    "https://dev26/help/es-entry.js"
  ]
}
```

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
