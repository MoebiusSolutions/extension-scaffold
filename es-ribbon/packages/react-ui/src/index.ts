import { extensionScaffold } from '@gots/es-runtime/build/es-api'

async function loadExtensions() {
    extensionScaffold.boot(document.getElementById('demo-grid-container'))

    await extensionScaffold.loadExtensions([
        '/static/ribbon',
        '/static/security-banner',
    ])
}

loadExtensions()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept()
}
