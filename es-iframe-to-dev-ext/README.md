# IFrame to Developer Extension

The extension scaffold (ES) developer extension provides access to
`console` log and `network` log activity in browsers that do not enable `DevTools`.
This developer extension support does not extend to `iframe` based panels.
This small library allows an `iframe` based panel to forward
`console` log and `network` log information from the `iframe`
to the `console-extension` and `network-extension`.

## Dependency on `@moesol/inter-widget-communication`

In order to send information to the `console-extension` and the `network-extension`
this library depends on `@moesol/inter-widget-communication`.
It also relies on the hosting `iframe` to call
`@moesol/inter-widget-communication#initialize`
before calling either `initConsoleLog` or `initNetworkLog`

## Console Log Initialization

Call `initConsoleLog(options?: InitConsoleLogOptions)` to "hook' `console` methods.
The hook calls the original native `console` method
and then forwards log records to the `console-extension`.

```ts
export interface InitConsoleLogOptions {
  /**
   * levels defaults to ['debug', 'info', 'log', 'warn', 'error']
   */
  levels?: string[]
}
```

> Note: excessive logging adds inter-widget communication load.
> To hook only warnings and errors you could use:

```ts
initConsoleLog({
    levels: ['warn', 'error']
})
```

## Network Log Service Worker

In order to capture information about network requests,
this library provides a service worker.
Copy the file
`node_modules/@moesol/es-iframe-to-dev-ext/public/debug-network-service-worker.js`
into your iframe's root folder next to its `index.html` page.

Call `initNetworkLog(window.location.href)`.
This will query the `network-extension` to see if `network` logging is active.
If active, then `initNetworkLog` will register the service worker.
If not active, then `initNetworkLog` will unregister the service worker.
