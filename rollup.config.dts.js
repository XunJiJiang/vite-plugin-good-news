import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import alias from '@rollup/plugin-alias'
import image from '@rollup/plugin-image'

const __dirname = dirname(fileURLToPath(import.meta.url))

const joinTo = (...paths) => resolve(__dirname, ...paths)

export default defineConfig(() => {
  return {
    plugins: [
      dts({
        tsconfig: joinTo('tsconfig.node.json'),
        compilerOptions: {
          declaration: true,
          emitDeclarationOnly: true
        }
      }),
      alias({
        entries: [
          {
            find: '@',
            replacement: joinTo('src')
          }
        ]
      }),
      image()
    ],
    input: joinTo('src/index.ts'),
    external: ['vite', '**/*.jpg', '**/*.mp3', '**/*.js?raw'],
    output: {
      dir: joinTo('dist'),
      format: 'es'
    }
  }
})
