import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

import pkg from './package.json';

const libraryName = 'QuickCTX'; 

export default [
    // Configuration for the UMD bundle (for use in browsers, example via <script> tag) 
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.browser || `dist/${libraryName.toLowerCase()}.umd.js`, 
                format: 'umd',
                name: libraryName, 
                sourcemap: true,
                globals: {}, // for now, no external dependencies
            },
            { // minified version of the UMD bundle
                file: pkg.browser.replace('.js', '.min.js') || `dist/${libraryName.toLowerCase()}.umd.min.js`,
                format: 'umd',
                name: libraryName,
                sourcemap: true,
                globals: {},
                plugins: [terser()], 
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled', // include Babel helpers in the bundle
                exclude: 'node_modules/**',
                presets: ['@babel/preset-env']
            }),
            postcss({
                plugins: [autoprefixer()],
                extract: 'quickctx.css', 
                minimize: true, 
                sourceMap: true,
            })
        ],
    },

    // configuration for the ESM bundle (for use in modern JavaScript applications, e.g., via import)
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.module || `dist/${libraryName.toLowerCase()}.esm.js`, 
                format: 'es',
                sourcemap: true,
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                presets: ['@babel/preset-env']
            }),
            postcss({
                plugins: [autoprefixer()],
                extract: 'quickctx.css', 
                minimize: true, 
                sourceMap: true,
            })
        ],
    }
];