import { build, BuildOptions, serve } from 'esbuild'
import packageJson from './package.json'
import * as process from 'process'
import * as fs from 'fs'

fs.rmSync('./dist', { force: true, recursive: true })
fs.mkdirSync('./dist')

const options = <BuildOptions>{
  entryPoints: ['src/index.ts'],
  outfile: `dist/${packageJson.name}.user.js`,
  logLevel: 'info',
  bundle: true,
  minifySyntax: true,
  // sourcemap: 'inline',
  format: 'esm',
  target: ['es2017'],
  banner: {
    js: await import('./monkey-header').then((it) => it.default)
  }
}

await build(options)
if (process.argv[2] === '--watch' || process.argv[2] === '-w')
  await serve(
    {
      port: 7000,
      servedir: 'dist'
    },
    options
  )
