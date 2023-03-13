import { BuildOptions, defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command, mode }) => {
  const isProdMode = mode == 'production'

  const buildOptions: BuildOptions = {
    sourcemap: !isProdMode || command === 'serve',
    target: 'es2021',
    rollupOptions: {
      input: './src/index.ts',
      output: {
        entryFileNames: 'js/app.js',
        format: 'iife',
      },
    },
  }
  if (isProdMode) {
    buildOptions.commonjsOptions = {
      sourceMap: false,
    }
    buildOptions.minify = 'terser'
    buildOptions.terserOptions = {
      compress: {
        dead_code: true,
        drop_console: true,
      },
      ecma: 2020,
    }
  }

  const htmlTemplateReplaceConfig: { [key: string]: string } = {
    scriptType: isProdMode ? 'text/javascript' : 'module',
    scriptPath: isProdMode ? '/js/app.js' : '/dist/index.js',
  }

  return {
    server: {
      port: 8080,
    },
    preview: {
      port: 8080,
    },
    build: buildOptions,
    plugins: [
      // transform index.html file for serve task
      !isProdMode && ViteEjsPlugin(htmlTemplateReplaceConfig),
      // copies index.html for build task
      isProdMode &&
        viteStaticCopy({
          targets: [
            {
              src: './index.html',
              dest: '.',
              transform: (html: string) => {
                // replaces <%= param %>
                return html.replace(/<%=\s*(\w+)\s*%>/gi, (match: string, key: string) => htmlTemplateReplaceConfig[key] || '')
              },
            },
          ],
        }),
    ],
  }
})
