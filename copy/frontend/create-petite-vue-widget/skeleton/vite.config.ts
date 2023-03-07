import { BuildOptions, defineConfig } from 'vite'

export default defineConfig(({ command, mode }) => {
  const buildOptions: BuildOptions = {
    sourcemap: mode !== 'production' || command === 'serve',
    target: 'es2021',
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        entryFileNames: 'js/app.js',
        format: 'iife',
      },
    },
  }
  if (mode == 'production') {
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

  return {
    server: {
      port: 8080,
    },
    preview: {
      port: 8080,
    },
    build: buildOptions,
  }
})
