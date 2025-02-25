import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js', // Your library's entry point
    output: [
        {
            file: 'docs/dist/undoable-ui.cjs.js',
            format: 'cjs',        // CommonJS format for Node.js
            sourcemap: true,
        },
        {
            file: 'docs/dist/undoable-ui.umd.js',
            format: 'umd',        // UMD format for browsers (global variable)
            name: 'UndoableUI',   // Global variable name
            sourcemap: true,
        },
        {
            file: 'docs/dist/undoable-ui.esm.js',
            format: 'esm',        // ES Modules format for modern bundlers
            sourcemap: true,
        }
    ],
    plugins: [
        resolve(),   // Helps Rollup find modules in node_modules
        commonjs(),  // Converts CommonJS modules to ES6 so Rollup can include them
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**' // Don’t transpile external libraries
        })
    ]
};
