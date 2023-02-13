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

Below is an example for `example.json`

```json
{
  "name": "example",
  "title": "ES Example",
  "ribbon": [
    {
      "location": "left-of-tabs",
      "sections": ["example.document.selector"]
    },
    {
      "location": "right-of-tabs",
      "sections": ["example.users", "shared.search"]
    },
    {
      "tab": "View",
      "sections": ["view.section1", "display.theme", "view.split.button"]
    },
    {
      "tab": "Document Controls",
      "sections": ["dc.group.one", "dc.group.two", "dc.group.three"]
    },
    {
      "tab": "Settings",
      "sections": ["settings.group.one", "settings.options"]
    },
    {
      "tab": "Example Tab",
      "sections": ["example.tab.show.code"]
    },
    {
      "tab": "Example Content",
      "hidden": true,
      "sections": []
    },
    {
      "tab": "Help",
      "sections": [
        "debug.console",
        "debug.network",
        "debug.metrics",
        "help.about.es-home"
      ]
    }
  ],
  "header": ["ext.snowpack.header"],
  "footer": ["ext.snowpack.footer"],
  "left": ["ext.snowpack.left"],
  "center": ["ext.example.snowpack"],
  "right": ["ext.example.rollup", "ext.example.webpack"],
  "top-bar": ["ext.snowpack.ribbon"],
  "bottom-bar": ["ext.snowpack.bottom", "ext.example.lit-element"],
  "extensions": ["/ui/ext-example-snowpack/dist/ext-react-snowpack.js"],
  "iframes": [
    {
      "id": "es.example.iframe",
      "title": "IFrame",
      "location": "right",
      "iframeSource": "http://localhost:9095/",
      "resizeHandle": true,
      "removeButton": true
    }
  ]
}
```

### Property: `"context"`

> `context` is deprecated.

The `context` was used to define IWC parameters,
but the current release of `es-home` sets up the IWC parameters
by default making the `context` unnecessary.

```json
  "context": {
    "iwc": "broadcast",
    "busUrl": "https://SOME_URL/bcst-bus/index.html"
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
      "ext.example.snowpack"
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

Below is a possible example for the snowpack example:

```json
{
    "url": "http://localhost:9091/dist/ext-react-snowpack.js",
    "provides": [
        {
            "title": "Example Header",
            "id": "ext.snowpack.header"
        },
        {
            "title": "Example Footer",
            "id": "ext.snowpack.footer"
        },
        {
            "title": "Example Ribbon",
            "id": "ext.snowpack.ribbon"
        },
        {
            "title": "Time Slider",
            "id": "ext.snowpack.bottom"
        },
        {
            "title": "Snowpack Left",
            "id": "ext.snowpack.left"
        }
    ]
}
```

Finally, these files are combined to produce `public/example.json`:

```json
{
  "name": "example",
  "title": "ES Example",
  "ribbon": [
    {
      "location": "left-of-tabs",
      "sections": [
        "example.document.selector"
      ]
    },
    {
      "location": "right-of-tabs",
      "sections": [
        "example.users",
        "shared.search"
      ]
    },
    {
      "tab": "View",
      "sections": [
        "view.section1",
        "display.theme",
        "view.split.button"
      ]
    },
    {
      "tab": "Document Controls",
      "sections": [
        "dc.group.one",
        "dc.group.two",
        "dc.group.three"
      ]
    },
    {
      "tab": "Settings",
      "sections": [
        "settings.group.one",
        "settings.options"
      ]
    },
    {
      "tab": "Shape",
      "sections": [
        "shape.show.code"
      ]
    },
    {
      "tab": "Example Content",
      "hidden": true,
      "sections": []
    },
    {
      "tab": "Help",
      "sections": [
        "debug.console",
        "debug.network",
        "debug.metrics",
        "help.about.es-home"
      ]
    }
  ],
  "header": [
    "ext.snowpack.header"
  ],
  "footer": [
    "ext.snowpack.footer"
  ],
  "left": [
    "ext.snowpack.left"
  ],
  "right": [
    "ext.example.rollup",
    "ext.example.webpack"
  ],
  "top-bar": [
    "ext.snowpack.ribbon"
  ],
  "bottom-bar": [
    "ext.snowpack.bottom",
    "ext.example.lit-element"
  ],
  "extensions": [
    "/ui/ext-example-snowpack/dist/ext-react-snowpack.js",
    "/es/common/dist/theme-extension.js",
    "/es/ui/dist/extensions/console-extension.js",
    "/es/ui/dist/extensions/network-extension.js",
    "/es/common/dist/debug-metrics.js",
    "/es/ui/dist/extensions/help-about-extension.js",
    "http://localhost:9091/dist/ext-react-snowpack.js",
    "http://localhost:9092/ext-react-rollup.js",
    "http://localhost:9093/ext-react-webpack.js",
    "http://localhost:9094/dist/ext-lit-element.js"
  ],
  "iframes": [
    {
      "id": "es.example.iframe",
      "title": "IFrame",
      "location": "right",
      "iframeSource": "http://localhost:9095/",
      "resizeHandle": true,
      "removeButton": true
    }
  ]
}
```

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
