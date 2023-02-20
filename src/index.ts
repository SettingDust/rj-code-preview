import hackRjCode, { RJ_CODE_LINK_CLASS } from './hack-rj-code'
import initPopup from "./popup";

const observer = new MutationObserver((records) => {
  for (const { addedNodes } of records)
    for (const node of addedNodes) hackRjCode(node)
})
observer.observe(document.body, { childList: true, subtree: true })
hackRjCode(document.body)

const style = document.createElement('style')
style.innerHTML = `
.${RJ_CODE_LINK_CLASS} {
  color: inherit;
  -webkit-text-stroke-width: 1px;
  width: fit-content !important;
  display: inline-flex !important;
  line-height: 1;
  font-size: inherit !important;
}`
document.head.append(style)

initPopup()

document.addEventListener('securitypolicyviolation', (e) => {
  if (e.blockedURI.includes('img.dlsite.jp')) {
    const img = document.querySelector(`img[src="${e.blockedURI}"]`)
    img.remove()
  }
})
