/*
 * This file is designed to be loaded as an ES Module.
 * It is not under the `src` directory, since all JavaScript files
 * under `src` get bundled by `webpack`.
 */

export async function activate(scaffold) {
    console.log('webpack loading...', scaffold)
    await scaffold.loadWebpackScript({
        url: 'http://localhost:9093/static/js/bundle.js',
        library: 'ext-example-webpack',
    })
    console.log('webpack activated')
}
