// import type { Plugin } from 'vite'
import goodNewsImg from '@/assets/imgs/good-news.jpg'
import sadNewsImg from '@/assets/imgs/sad-news.jpg'
import goodNewsAudio from '@/assets/audios/good-news.mp3'
import sadNewsAudio from '@/assets/audios/sad-news.mp3'
import { join, dirname, resolve } from 'node:path'

const __dirname = resolve(dirname(''))

interface Options {
  music?: boolean
  newsType?: 'good' | 'sad'
}

const defaultOptions: Options = {
  music: true,
  newsType: 'good'
}

export default function ({
  music = true,
  newsType = 'good'
}: Options = defaultOptions) {
  const enterFiles: string[] = []

  const changeViteErrorBackground =
    `() => {\n` +
    `  const viteErrorOverlay = document.querySelector('vite-error-overlay');\n` +
    `  if (viteErrorOverlay) {\n` +
    `    const shadowRoot = viteErrorOverlay.shadowRoot;\n` +
    `    if (shadowRoot) {\n` +
    `      const backdrop = shadowRoot.querySelector('div.backdrop');\n` +
    `      if (backdrop && backdrop.classList.contains('custom-backdrop')) return;\n` +
    `      if (backdrop) backdrop.classList.add('custom-backdrop');\n` +
    `      const windowElement = shadowRoot.querySelector('.backdrop .window');\n` +
    `      if (windowElement) windowElement.classList.add('custom-window');\n` +
    `      const styleElement = document.createElement('style');\n` +
    `      styleElement.textContent = \`.custom-backdrop { background-image: url(${newsType === 'good' ? `${goodNewsImg}` : `${sadNewsImg}`}); background-size: auto 100%; background-position: center; }\`;\n` +
    `      styleElement.textContent += \`.custom-window { background: rgba(85, 85, 85, 0.8); margin-top: 26vh; }\`;\n` +
    `      shadowRoot.appendChild(styleElement);\n` +
    `    }\n` +
    `  }\n` +
    `}`

  const changeViteErrorMusic = music
    ? `() => {\n` +
      `  const viteErrorOverlay = document.querySelector('vite-error-overlay');\n` +
      `  if (viteErrorOverlay) {\n` +
      `    const shadowRoot = viteErrorOverlay.shadowRoot;\n` +
      `    if (shadowRoot) {\n` +
      `      if (shadowRoot.querySelector('audio')) return;\n` +
      `      const audioElement = document.createElement('audio');\n` +
      `      audioElement.autoplay = true;\n` +
      `      shadowRoot.appendChild(audioElement);\n` +
      `      audioElement.src = "data:audio/mp3;base64,${newsType === 'good' ? goodNewsAudio : sadNewsAudio}";\n` +
      `      audioElement.play();\n` +
      `    }\n` +
      `  }\n` +
      `}`
    : '() => {}'

  return {
    name: 'vite-plugin-good-news',
    apply: 'serve',
    transform(code: string, id: string) {
      if (enterFiles.includes(resolve(id))) {
        const errorHandle =
          `const __changeViteErrorMusic = ${changeViteErrorMusic};\n` +
          `const __changeViteErrorBackground = ${changeViteErrorBackground};\n` +
          `if (import.meta.hot) {\n` +
          `  import.meta.hot.on('vite:error', data => {\n` +
          `    setTimeout(() => {\n` +
          `      __changeViteErrorMusic();\n` +
          `      __changeViteErrorBackground();\n` +
          `    });\n` +
          `  });\n` +
          `}\n`
        return {
          code: errorHandle + code,
          map: null
        }
      }
    },
    transformIndexHtml(html: string) {
      const scriptImportRxg = /<script type="module" src=".*?"><\/script>/g
      const scriptImportMatch = html
        .match(scriptImportRxg)
        ?.filter((src) => !src.includes('vite'))
        .map((script) =>
          join(__dirname, script.split('src="')[1].split('">')[0])
        )
      if (scriptImportMatch) enterFiles.push(...scriptImportMatch)

      return html.replace(
        '<head>',
        `<head>\n` +
          `<script>\n` +
          `const __changeViteErrorMusic = ${changeViteErrorMusic};\n` +
          `const __changeViteErrorBackground = ${changeViteErrorBackground};\n` +
          `window.addEventListener('DOMContentLoaded', () => {\n` +
          `    setTimeout(() => {\n` +
          `      __changeViteErrorMusic();\n` +
          `      __changeViteErrorBackground();\n` +
          `    }, 30);\n` +
          `  });\n` +
          `</script>\n`
      )
    }
  } as const
}
