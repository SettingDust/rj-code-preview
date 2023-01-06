import hackRjCode, { RJ_CODE_LINK_CLASS } from './hack-rj-code'

const observer = new MutationObserver((records) => {
  for (const { addedNodes } of records)
    for (const node of addedNodes) hackRjCode(node)
})
document.addEventListener('DOMContentLoaded', async () => {
  observer.observe(document.body, { childList: true, subtree: true })
  hackRjCode(document.body)

  GM_addStyle(`
  .${RJ_CODE_LINK_CLASS} {
    color: inherit;
    -webkit-text-stroke-width: 1px;
  }`)

  await import('./popup').then((it) => it.default())
})

document.addEventListener('securitypolicyviolation', (e) => {
  if (e.blockedURI.includes('img.dlsite.jp')) {
    const img = document.querySelector(`img[src="${e.blockedURI}"]`)
    img.remove()
  }
})
