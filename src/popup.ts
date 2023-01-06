import { RJ_CODE_ATTRIBUTE, RJ_CODE_LINK_CLASS } from './hack-rj-code'
import fetchRj from './fetch-rj'
import mustache from 'mustache'
import delegate from 'delegate-it'

export let currentWork: Awaited<ReturnType<typeof fetchRj>>

const linkSelector = `a.${RJ_CODE_LINK_CLASS}`

const template = `
  <img src='{{ image }}'>
  <div class='info'>
    <h3>{{ name }}</h3>
    {{ #rating }}<p><span>评价：</span><span>{{ rating }}</span></p>{{ /rating }}
    {{ #sale }}<p><span>贩卖数：</span><span>{{ sale }}</span></p>{{ /sale }}
    {{ #group }}<p><span>社团名：</span><span>{{ group }}</span></p>{{ /group }}
    {{ #date }}<p><span>贩卖日：</span><span>{{ date }}</span></p>{{ /date }}
    {{ #series }}<p><span>系列名：</span><span>{{ series }}</span></p>{{ /series }}
    {{ #hasCreators }}<p><span>作者：</span>{{ #creators }}<span>{{ . }} / </span>{{ /creators }}</p>{{ /hasCreators }}
    {{ #hasScenarios }}<p><span>剧情：</span>{{ #scenarios }}<span>{{ . }} / </span>{{ /scenarios }}</p>{{ /hasScenarios }}
    {{ #hasIllusts }}<p><span>插画：</span>{{ #illusts }}<span>{{ . }} / </span>{{ /illusts }}</p>{{ /hasIllusts }}
    {{ #hasVoices }}<p><span>声优：</span>{{ #voices }}<span>{{ . }} / </span>{{ /voices }}</p>{{ /hasVoices }}
    {{ #hasMusics }}<p><span>音乐：</span>{{ #musics }}<span>{{ . }} / </span>{{ /musics }}</p>{{ /hasMusics }}
    {{ #age }}<p><span>年龄指定：</span><span>{{ age }}</span></p>{{ /age }}
    {{ #type }}<p><span>作品类型：</span><span>{{ type }}</span></p>{{ /type }}
    {{ #hasTags }}<p><span>分类：</span>{{ #tags }}<span>{{ . }} </span>{{ /tags }}</p>{{ /hasTags }}
  </div>`

async function show(rj: string, x: number, y: number) {
  const popup = document.getElementById('rj-popup')
  currentWork = await fetchRj(rj)
  console.debug('[rj-code-preview/work]', currentWork)
  const rendered = mustache.render(template, currentWork, null, {
    escape: (it) => it
  })
  console.debug('[rj-code-preview/rendered]', rendered)
  popup.innerHTML = rendered
  move(x, y)
  popup.getElementsByTagName('img').item(0).onload = () => move(x, y)
}

function hide() {
  currentWork = undefined
  document.getElementById('rj-popup').innerHTML = ''
}

function move(x: number, y: number) {
  const popup = document.getElementById('rj-popup')
  // 如果右侧没有超出屏幕范围
  if (popup.offsetWidth + x + 24 < window.innerWidth) {
    popup.style.left = x + 8 + 'px'
  } else {
    // 显示在左侧
    popup.style.left = x - popup.offsetWidth - 8 + 'px'
  }

  // 如果下方超出屏幕范围
  if (popup.offsetHeight + y + 16 > window.innerHeight) {
    // 尽可能靠下
    popup.style.top = window.innerHeight - popup.offsetHeight - 16 + 'px'
  } else {
    popup.style.top = y + 'px'
  }
}

delegate(document.body, linkSelector, 'mouseout', () => {
  hide()
})

delegate(
  document.body,
  linkSelector,
  'mouseover',
  async (event) => {
    const element = <HTMLElement>event.target
    const rj = element.dataset[RJ_CODE_ATTRIBUTE]
    console.debug('[rj-code-preview/rj]', rj)
    if (!rj) return
    await show(rj, event.clientX, event.clientY)
  }
)

delegate(document.body, linkSelector, 'mousemove', (event) => {
  move(event.clientX, event.clientY)
})

export default function initPopup() {
  GM_addElement(document.body, 'div', { id: 'rj-popup' })
  GM_addStyle(`
  #rj-popup {  
    max-width: 360px;
    position: fixed;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #fff;
    background-color: #424242;
    border-radius: 12px;
    z-index: 99999;
  }
  #rj-popup > img {
    width: 100%;
    height: auto;
    border-radius: 0;
  }
  
  #rj-popup > .info {
    padding: 12px 16px;
    font-size: 0.88rem;
    line-height: 1.2;
    display: grid;
    grid-gap: 6px;
    box-sizing: border-box;
  }
  
  #rj-popup > .info > * {
    margin: 0;
  }
  
  #rj-popup > .info > h3 {
    font-size: 1.1rem;
    font-weight: bold;
    line-height: 1;
  }`)
}
