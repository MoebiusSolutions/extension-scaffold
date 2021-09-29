import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import externalGlobals from 'rollup-plugin-external-globals'

export default {
    input: 'src/index.tsx',
    output: {
        file: 'dist/index.js',
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
        }),
    ],
}
