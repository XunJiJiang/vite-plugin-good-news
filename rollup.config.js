import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { createFilter } from '@rollup/pluginutils'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import { string } from 'rollup-plugin-string'
import image from '@rollup/plugin-image'

function base64(opts = {}) {
  if (!opts.include) {
    throw Error("include option must be specified");
  }

  const filter = createFilter(opts.include, opts.exclude);
  return {
    name: "base64",
    transform(data, id) {
      if (filter(id)) {
        const fileData = readFileSync(id);
          return  `export default "${fileData.toString('base64')}";`
      }
    }
  };
}

const __dirname = dirname(fileURLToPath(import.meta.url))

const joinTo = (...paths) => resolve(__dirname, ...paths)

export default defineConfig(() => {
  return {
    plugins: [
      typescript({
        tsconfig: joinTo('tsconfig.json'),
        allowSyntheticDefaultImports: true,
        moduleResolution: 'NodeNext',
        module: 'NodeNext',
        target: 'esnext'
      }),
      nodeResolve({ extensions: ['.ts'] }),
      terser(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts'],
        presets: ['@babel/preset-typescript']
      }),
      alias({
        entries: [
          {
            find: '@',
            replacement: joinTo('src')
          }
        ]
      }),
      string({
        include: '**/*.*?raw'
      }),
      image(),
      base64({
        include: ['**/*.mp3']
      })
    ],
    input: joinTo('src/index.ts'),
    external: ['vite'],
    output: [
      {
        dir: joinTo('dist'),
        format: 'cjs',
        entryFileNames: '[name].cjs.js'
      },
      {
        dir: joinTo('dist'),
        format: 'es',
        entryFileNames: '[name].es.js'
      }
    ]
  }
})
