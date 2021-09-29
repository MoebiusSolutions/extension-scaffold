import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import externalGlobals from 'rollup-plugin-external-globals'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [{
    input: 'src/index.tsx',
    output: {
        file: 'dist/bgo/index.js',
        format: 'esm',
    },
    plugins: [
        typescript(),
        postcss({
            inject: false,
        }),
        externalGlobals({
            react: 'React',
            'react-dom': 'ReactDOM',
            'svg-injector': 'SVGInjector',
        }),
        nodeResolve(),
        commonjs(),
    ],
}, {
    input: 'src/ribbon/index.tsx',
    output: {
        file: 'dist/es6/index.js',
        format: 'esm',
    },
    plugins: [
        typescript({ tsconfig: './tsconfig.lib.json' }),
        postcss({
            inject: false,
        }),
        externalGlobals({
            react: 'React',
            'react-dom': 'ReactDOM',
            'svg-injector': 'SVGInjector',
        }),
        nodeResolve(),
        commonjs(),
    ],
}]
