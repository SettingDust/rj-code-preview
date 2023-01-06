// ==UserScript==
// @name           rj-code-preview
// @author         SettingDust
// @description    Make RJ code great again!
// @grant          none
// @match          *://*/*
// @namespace      SettingDust
// @run-at         document-start
// @version        3.0.0
// ==/UserScript==
(() => {
  // src/fetch-rj.ts
  var productPage = (rj) => `https://www.dlsite.com/maniax/work/=/product_id/${rj}.html`;

  // src/hack-rj-code.ts
  var RJ_CODE_LINK_CLASS = "rj-code";
  var RJ_CODE_ATTRIBUTE = "rj-code";
  var RJ_REGEX = new RegExp("R[JE][0-9]{6,8}", "gi");
  function wrapRJCode(rj) {
    const a = document.createElement("a");
    a.classList.add(RJ_CODE_LINK_CLASS);
    a.href = productPage(rj);
    a.innerHTML = rj;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.dataset[RJ_CODE_ATTRIBUTE] = rj;
    return a;
  }
  function injectRJCode(node) {
    var _a, _b;
    const text = node.nodeValue;
    const matches = [];
    let match;
    while (match = RJ_REGEX.exec(text)) {
      matches.push({
        index: match.index,
        value: match[0]
      });
    }
    node.nodeValue = text.slice(0, matches[0].index);
    let prev = null;
    for (let i = 0; i < matches.length; i++) {
      const match2 = matches[i];
      const a = wrapRJCode(match2.value);
      node.parentNode.insertBefore(a, (_a = prev == null ? void 0 : prev.nextSibling) != null ? _a : node.nextSibling);
      const nextIndex = (_b = matches[i + 1]) == null ? void 0 : _b.index;
      const afterText = text.slice(match2.index + match2.value.length, nextIndex);
      if (afterText) {
        const afterNode = document.createTextNode(afterText);
        node.parentNode.insertBefore(afterNode, a.nextElementSibling);
        prev = afterNode;
      } else
        prev = a;
    }
  }
  function hack_rj_code_default(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.parentElement.classList.contains(RJ_CODE_LINK_CLASS) || node.nodeValue.match(RJ_REGEX))
          return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.classList.contains(RJ_CODE_LINK_CLASS))
        injectRJCode(node);
    }
  }

  // src/index.ts
  var observer = new MutationObserver((records) => {
    for (const { addedNodes } of records)
      for (const node of addedNodes)
        hack_rj_code_default(node);
  });

  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  })

  document.addEventListener("securitypolicyviolation", (e) => {
    if (e.blockedURI.includes("img.dlsite.jp")) {
      const img = document.querySelector(`img[src="${e.blockedURI}"]`);
      img.remove();
    }
  });
})();
//# sourceMappingURL=rj-code-preview.user.js.map
