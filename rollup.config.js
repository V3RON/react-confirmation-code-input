import babel from '@rollup/plugin-babel'
import external from 'rollup-plugin-peer-deps-external'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import visualizer from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'

import pkg from './package.json'

const plugins = [
  external(),
  resolve({
    browser: true,
  }),
  commonjs(),
  typescript(),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
  }),
  visualizer(),
  postcss({
    modules: true,
  }),
]

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins,
}
