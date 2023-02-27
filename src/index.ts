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
  
  /* 幻想次元首页列表会让宽度变成 70% */
  width: fit-content !important;
  
  /* 幻想次元和绅士之庭会让 a 标签换行 */
  display: inline-flex !important;
  line-height: 1;
  
  /* [[绅士之庭]] 首页标题的 [[RJ 码]] 会变得很大 */
  font-size: inherit !important;
  
  /* [[南+]] 的帖子列表会给 a 标签一个右侧 [[margin]] */
  margin: 0;
  
  align-items: center;
}`
document.head.append(style)

initPopup()

document.addEventListener('securitypolicyviolation', (e) => {
  if (e.blockedURI.includes('img.dlsite.jp')) {
    const img = document.querySelector(`img[src="${e.blockedURI}"]`)
    img.remove()
  }
})
