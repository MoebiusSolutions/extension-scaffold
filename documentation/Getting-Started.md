# Getting Started

The main page for `ES` is `es-home`, a data-driven hosting page.
While it is data driven, it currently avoids the requirement to have a dynamic server side component,
such as `JBoss` or `nodejs`.
Instead it uses simple JSON files that can be served from any static web server such as Apache `httpd`.
Currently the deployment plan is to deploy `es-home` under the `/ui/es` URL.

> Note: GCCS-M chose to use `/es-home`

At startup `es-home` loads the resource `./apps/index.json` (resolves to `/ui/es/apps/index.json`).
For ONR integration purposes this file is volume mounted from `/opt/extension-scaffold/apps/`.
When the user clicks a button for an application, the `name` "slug" in the `index.json`
is appended to the URL as a fragment location (`#` hash).
For example, if the user clicks on BGO, then `es-home` navigates to `/ui/es/#bgo`.
This URL can be bookmarked for direct traversal.

When a `#bgo` is in the URL, `es-home` fetches the `./apps/bgo.json` file which defines
the ribbon, panel, and iframe URLs to pull into `ES`.
To make these files easier to build, there is a set of files in source code
under `data/applications`, and `data/extensions`.
During `rush build` these files are cross referenced to convert IDs
into the list of `extensions` that are defined to provide those IDs.
Also, `index.json` is generated.

## Adding a Left Panel

* Also see _Dynamically Adding and Removing a Left Panel_ below.

## Adding a Ribbon Tab

## Dynamically Adding and Removing a Left Panel

