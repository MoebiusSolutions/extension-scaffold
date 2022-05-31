# Extension Scaffold

This application is designed to load extensions.
The extensions is where the primary functionality should be hosted.
This application allows extensions to register panels that
are wrapped in a shadow DOM so that each extension does not
have to worry about the CSS of other extensions interacting
with its components.

# Data Driven Panels

> Note: new integrations with ES are using ribbon button driven panels.
> The advantage of using ribbon button driven panels is that
> the resources for the panel are not created until the panel
> is added with `addPanel`.

In order to prevent the need for creating multiple "hosting" pages,
this web application makes a `fetch` request back to the server
to load the data for the requested "application".

We borrow a design from Linux where we allow the configuration data
to be spread over many files. Then, we use a script `es-home/scripts/resolve-applications.js`
to combine the files so that we only need to make a single `fetch` to get
all of the configuration information we need to initialize the panels.

## Folder Layout

### Folder: `data/applications/*.json`

We expect one file per "application". 
An "application" configuration is defined in JSON.
It must define a `"name"` property, which defines the "application" name.
Then it defines other properties to define the panel layout.

Below is an example for `aasw.json`

```json
{
  "name": "aasw",
  "title": "Adaptive ASW",
  "context": {
    "iwc": "broadcast",
    "busUrl": "https://security.dev26.minerva.navy.mil/bgapp2/bcst-bus/index.html"
  },
  "ribbon": [
    { "tab": "File", "sections": [
      "file.section1",
      "file.section2"
    ]},
    { "tab": "Display", "sections": [
        "display.theme",
        "display.map",
        "display.tracks",
        "display.controls"
    ]}
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

### Property: `"context"`

Currently the `context` object defines the IWC parameters:

```json
  "context": {
    "iwc": "broadcast",
    "busUrl": "https://security.dev26.minerva.navy.mil/bgapp2/bcst-bus/index.html"
  },
```

> Note: `es-home` hosts a shared `bcst-bus` and automatically passes the query parameters
> `iwc` and `busUrl` to any `iframeSource` panels.

### Property: `"ribbon"`

* See [Extensible Ribbon](../Extensible-Ribbon.md)

### Panel Location Properties: `"left"`, `"bottom-bar"`, etc.

The IDs places into these panel locations will override the location of a panel 
added via `addPanel` unless `relocating` is true in the `AddPanelOptions`.
This way an application can declaratively control the layout of its panels.

Example: 

```json
  "center": [
      "ext.aeolus.map"
  ],
```

### Property: `"iframes"`

IFrames declared here are automatically loaded at startup.
The JSON allows any of the `AddPanelOptions` to be passed through to the `addPanel` API.
If the `iframeSource` is missing then the entry is ignored.

Example:

```json
  "iframes": [
    {
      "id": "es.example.iframe",
      "title": "IFrame",
      "location": "right",
      "iframeSource": "http://localhost:9095/",
      "resizeHandle": true
    }
  ]
```

### Property: `"extensions"`

Normally, you use `npm run resolve-applications` (automatically triggered from `npm run build`)
to build the list of extensions to load.
However, you can force extensions into the resulting `app` definition by including
an `"extensions"` property.

Example:

```json
    "extensions": [
        "/ui/ext-example-snowpack/dist/ext-react-snowpack.js"
    ],
```

> Tip: it is common to begin the URL without the protocol, hostname, and port.
> This works well when everything is behind a common reverse proxy.

### Folder: `data/extensions/*.json`

We expect one file per *extension*.
Extensions are defined in JSON format.

> Note: a single extension can create and provide multiple panels

The extension configuration defines the `"url"` of the extension.
It also defines an array panel IDs in the `"provides"` property.
The extensions configuration does not need to list every panel ID that is provides,
but it should list the panel IDs that will be needed by *applications*.

These IDs are then used by `es-home/scripts/resolve-applications.js` to compute
which extensions are needed by an *application*.

Below is a possible example for Aeolus:

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
            "id": "aeolus.layer.manager"
        }
    ]
}
```

Finally, these files are combined to produce `public/aaws.json`:

```json
{
  "name": "aasw",
  "context": {
    "iwc": "broadcast",
    "busUrl": "https://security.dev26.minerva.navy.mil/bgapp2/bcst-bus/index.html"
  },
  "ribbon": [
    { "tab": "File", "sections": [
      "file.section1",
      "file.section2"
    ]},
    { "tab": "Display", "sections": [
        "display.theme",
        "display.map",
        "display.tracks",
        "display.controls"
    ]}
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

> Note: Minerva has opted to host the full set of JSON files for applications under `dfntc-ansible`.
> So, Minerva does not use the files under `es-home/data`.

## Login to Private NPM Registry

* See [Login to Private NPM Registry](../documentation/Login-to-Private-NPM-Registry.md)

## Available Scripts

### `npm start`

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

### `npm test`

Launches the application test runner.
Run with the `--watch` flag (`npm test -- --watch`) to run in interactive watch mode.

### `npm run war`

Bundles the `build/` folder into a WAR file.
