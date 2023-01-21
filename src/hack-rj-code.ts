import { productPage } from './fetch-rj'

export const RJ_CODE_LINK_CLASS = 'rj-code'
export const RJ_CODE_ATTRIBUTE = 'rjCode'
const RJ_REGEX = new RegExp('R[JE][0-9]{6,8}', 'gi')

function wrapRJCode(rj: string) {
  const a = document.createElement('a')
  a.classList.add(RJ_CODE_LINK_CLASS)
  a.href = productPage(rj)
  a.innerHTML = rj
  a.target = '_blank'
  a.rel = 'noreferrer'
  a.dataset[RJ_CODE_ATTRIBUTE] = rj.toUpperCase()
  return a
}

function injectRJCode(node: Node) {
  const text = node.nodeValue
  const matches = <{ index: number; value: string }[]>[]

  let match
  while ((match = RJ_REGEX.exec(text))) {
    matches.push({
      index: match.index,
      value: match[0]
    })
  }

  if (matches.length) console.debug('[rj-code-preview/matches]', text, matches)

  node.nodeValue = text.substring(0, matches[0].index)
  let prev = <Node | null>null
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const a = wrapRJCode(match.value)
    node.parentNode.insertBefore(a, prev ? prev.nextSibling : node.nextSibling)
    const nextIndex = matches[i + 1]?.index
    const afterText = text.substring(
      match.index + match.value.length,
      nextIndex
    )
    if (afterText) {
      const afterNode = document.createTextNode(afterText)
      node.parentNode.insertBefore(afterNode, a.nextElementSibling)
      prev = afterNode
    } else prev = a
  }
}

export default function (root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node): number {
      if (
        node.parentElement.classList.contains(RJ_CODE_LINK_CLASS) ||
        node.nodeValue.match(RJ_REGEX)
      )
        return NodeFilter.FILTER_ACCEPT
    }
  })

  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.parentElement.classList.contains(RJ_CODE_LINK_CLASS))
      injectRJCode(node)
  }
}
