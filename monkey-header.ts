import { generate } from '@userscripters/generate-headers'

export default await generate('violentmonkey', {
  collapse: true,
  packagePath: './package.json',
  output: 'dist/header.txt',
  namespace: 'SettingDust',
  matches: ['*://*/*'],
  grants: ['style', 'fetch', 'set', 'get'],
  inject: 'auto',
  // @ts-ignore
  custom: ['grant GM_addElement']
})
