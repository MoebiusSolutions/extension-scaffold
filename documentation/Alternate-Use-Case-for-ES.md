# Alternate Use Case for Extension Scaffold (`ES`)

The default "hosting" page is `es-home`.
However, `ES` is also delivered as a NPM module.
Create a your own "hosting" single page application (SPA), and bundle `@gots/es-runtime`, with your SPA.
When creating a new "hosting" SPA, 
follow the instructions for the bundler you want to use to setup a simple SPA.
Install `es-runtime` locally using:

```shell
npm install -D @gots/es-runtime
```

The `es-application-examples/es-demo` folder contains an example "hosting" SPA 
that is based the `snowpack` bundler and the `typescript` language.
> Note: To simplify information assurance scans `es-demo` was removed from the `develop` and `release` branches.
> However, you can view `es-demo` by checking out the tag `v2.4.0`.
> Or you can review the source code for `es-home`.

The "hosting" webpage should contain a root element, similar to a React application.

```html
<div id="grid-container"></div>
```

Your "hosting" webpage will call the `boot` method to connect the grid layout it manages to the root element. 
After calling `boot` it will call `loadExtension` one or more times to load extensions from one or more web servers.

```typescript
import { extensionScaffold } from '@gots/es-runtime/build/es-api'

async function loadExtensions() {
  extensionScaffold.boot(document.getElementById('demo-grid-container'))
  
  await extensionScaffold.loadExtension('http://localhost:9091/dist/ext-react-snowpack.js')
  await extensionScaffold.loadExtension('http://localhost:9092/ext-react-rollup.js')
  await extensionScaffold.loadExtension('http://localhost:5000/build/ext-svelte-rollup.js')
  await extensionScaffold.loadExtension('http://localhost:9093/ext-react-webpack.js')
  await extensionScaffold.loadExtension('http://localhost:9094/dist/ext-lit-element.js')
}

loadExtensions()
```
