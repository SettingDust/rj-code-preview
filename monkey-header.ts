import { generate } from '@userscripters/generate-headers'

export default await generate('violentmonkey', {
  collapse: true,
  packagePath: './package.json',
  output: 'dist/header.txt',
  namespace: 'SettingDust',
  matches: ['*://*/*', '*://dlsite.com/*'],
  grants: ['fetch', 'set', 'get'],
  inject: 'auto',
  custom: ['name:zh-CN DLSite_RJ_码预览'],
  run: "end"
})
