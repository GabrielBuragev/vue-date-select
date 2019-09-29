import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import vue from 'rollup-plugin-vue';
import scss from 'rollup-plugin-scss';

const LIBRARY_NAME = 'VueDateselect';
const FILE_NAME = 'vue-dateselect';

const sourcemap = true;
const plugins = [
    vue({
        css: `dist/${FILE_NAME}.css`,
        compileTemplate: true, // Explicitly convert template to render function
    }),
    scss(),
    resolve({
        browser: true
    }),
    babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
    }),
    commonjs({
        namedExports: {
            'node_modules/vue-dragscroll/dist/vue-dragscroll.min.js': ['dragscroll'],
            'node_modules/mobile-device-detect/dist/index.js': ['isMobile'],
        }
    }),
];
const pluginsWithMinify = plugins.slice(0);

const defaultConfig = {
    input: 'src/index.js'
};

if (process.env.NODE_ENV === 'production') {
    pluginsWithMinify.push(minify());
}

if (process.env.NODE_ENV === 'development') {
    defaultConfig.input = 'dev/main.js';
    defaultConfig.watch = {
        include: ['src/**', 'dev/**']
    };

    plugins.push(livereload());
    plugins.push(serve({
        contentBase: '.',
        open: true
    }));
}

export default [
    Object.assign({}, defaultConfig, {
        output: [
            {
                file: `dist/${FILE_NAME}.common.js`,
                format: 'cjs',
                sourcemap,
                exports: 'named',
            },
            {
                file: `dist/${FILE_NAME}.es.js`,
                format: 'es',
                sourcemap,
                exports: 'named',

            },
            {
                file: `dist/${FILE_NAME}.umd.js`,
                format: 'umd',
                name: LIBRARY_NAME,
                sourcemap,
                exports: 'named',

            },
        ],
        plugins
    }),
    Object.assign({}, defaultConfig, {
        output: {
            file: `dist/${FILE_NAME}.js`,
            format: 'iife',
            name: LIBRARY_NAME,
            sourcemap,
            exports: 'named',

        },
        plugins
    }),
    Object.assign({}, defaultConfig, {
        output: {
            file: `dist/${FILE_NAME}.min.js`,
            format: 'iife',
            name: LIBRARY_NAME,
            sourcemap,
            exports: 'named',
        },
        plugins: pluginsWithMinify
    }),
];