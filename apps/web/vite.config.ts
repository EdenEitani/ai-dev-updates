import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  existsSync,
  cpSync,
  mkdirSync,
  createReadStream,
  statSync,
  writeFileSync,
} from 'fs'
import type { IncomingMessage, ServerResponse } from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_DIR = resolve(__dirname, '../../data')

function dataPlugin() {
  return {
    name: 'data-plugin',

    // Dev server: serve /data/* directly from repo-root data/
    configureServer(server: {
      middlewares: {
        use: (
          fn: (
            req: IncomingMessage,
            res: ServerResponse,
            next: () => void,
          ) => void,
        ) => void
      }
    }) {
      server.middlewares.use(
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          const url = req.url ?? ''
          if (!url.startsWith('/data/')) return next()

          const relativePath = decodeURIComponent(
            url.slice('/data/'.length).split('?')[0],
          )
          const filePath = resolve(DATA_DIR, relativePath)

          if (!existsSync(filePath)) return next()

          try {
            if (statSync(filePath).isDirectory()) return next()
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.setHeader('Cache-Control', 'no-cache')
            createReadStream(filePath).pipe(res)
          } catch {
            next()
          }
        },
      )
    },

    // Production build: copy data/ into dist/data/
    closeBundle() {
      const destDir = resolve(__dirname, 'dist/data')

      if (existsSync(DATA_DIR)) {
        mkdirSync(destDir, { recursive: true })
        cpSync(DATA_DIR, destDir, { recursive: true })
        console.log('\nCopied data/ → dist/data/')
      } else {
        console.warn(
          '\nWarning: no data/ directory found. Creating empty stubs.',
        )
        mkdirSync(resolve(destDir, 'index'), { recursive: true })
        writeFileSync(resolve(destDir, 'items.json'), '[]')
        writeFileSync(
          resolve(destDir, 'index/tags.json'),
          JSON.stringify({ tools: {}, industry: {}, topic: {}, type: {} }),
        )
        writeFileSync(resolve(destDir, 'index/recent.json'), '[]')
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), dataPlugin()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
