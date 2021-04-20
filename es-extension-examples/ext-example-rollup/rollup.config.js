import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'

/*
 * NOTE: this setup bundles react and react-dom with this extension.
 * Probably more efficient for extensions to share common libraries like react.
 * TODO: define how to share react
 */

const isProd = process.env.NODE_ENV === 'production';

export default {
    input: 'src/extension-entry.tsx',
    output: {
        file: 'build/bundle.js',
        format: 'es'
    },
    plugins: [
        replace({
            values: {
                'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
            },
            preventAssignment: true
        }),
        typescript(),
        nodeResolve(),
        commonjs({
            include: /node_modules/,
        }),
        process.env.DO_SERVE && serve({
            port: 9092,
            contentBase: 'build',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        }),
    ],
}
