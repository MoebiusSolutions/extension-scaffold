# Extension Example Lit Element

This is an example of an extension.
Extensions are where the primary functionality should be hosted.
The `es-runtime` allows extensions to register panels that
are wrapped in a shadow DOM so that each extension does not
have to worry about the CSS of other extensions interacting
with its components.

This extension uses `HtmlElements` as the component library and `snowpack` as its bundler.

## Available Scripts

### npm start

Runs the extension server in the development mode.
Load extension from http://localhost:9094/dist/ext-lit-element.js.

### npm run build

Builds the app for production to the `dist/` folder.
It correctly bundles the app in production mode and optimizes the build for the best performance.

## Directives

In case you need to add a directive like `classMap` you should add the extension to the import:

```
import { classMap } from "lit-html/directives/class-map.js";
```
