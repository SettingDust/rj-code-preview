export const RJ_CODE_LINK_CLASS = "rj-code"
const RJ_REGEX = new RegExp('R[JE][0-9]{6,8}', 'gi')

export default function (root: Node) {
    document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node: Node): number {
            if (node.parentElement.classList.contains(RJ_CODE_LINK_CLASS) ||
                node.nodeValue.match(RJ_REGEX)) return NodeFilter.FILTER_ACCEPT
        }
    })
}