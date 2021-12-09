/*
 * This file is designed to be loaded as an ES Module.
 * It is not under the `src` directory, since all JavaScript files
 * under `src` get bundled by `webpack`.
 */

export async function activate(scaffold, baseUrl) {
    const url = new URL('../static/js/bundle.js', baseUrl)
    await scaffold.loadWebpackScript({
        url,
        library: 'ext-example-webpack',
    })
}
