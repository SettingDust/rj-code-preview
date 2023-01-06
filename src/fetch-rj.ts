export const productPage = (rj: string) => `https://www.dlsite.com/maniax/work/=/product_id/${rj}.html`

export function productInfo(rj: string) {
  return new Promise<{
    work_name: string
    work_type_string: string
    maker_name: string
    regist_date: string
    title_name: string
    age_category_string: string
    creaters: {
      [K in 'voice_by' | 'illust_by' | 'scenario_by' | 'created_by']: {
        name: string
      }
    }
    image_main: {
      url: string
    }
  }>((resolve, reject) => {
    const cache = GM_getValue(`${rj} product`)
    if (cache) resolve(cache)
    GM_xmlhttpRequest({
      url: `https://www.dlsite.com/maniax/api/=/product.json?workno=${rj}`,
      responseType: 'json',
      onload: function (resp) {
        if (resp.readyState === 4 && resp.status === 200) {
          GM_setValue(`${rj} product`, resp.response[0])
          resolve(resp.response[0])
        } else reject(resp)
      }
    })
  })
}

export function productRatingInfo(rj: string) {
  return new Promise<{
    [K in typeof rj]: {
      dl_count: string
      rate_average_2dp: string
    }
  }>((resolve, reject) => {
    const cache = GM_getValue(`${rj} rating`)
    if (cache) resolve(cache)
    GM_xmlhttpRequest({
      url: `https://www.dlsite.com/maniax/product/info/ajax?product_id=${rj}`,
      responseType: 'json',
      onload: function (resp) {
        if (resp.readyState === 4 && resp.status === 200) {
          GM_setValue(`${rj} rating`, resp.response[rj])
          resolve(resp.response[rj])
        }
        else reject(resp)
      }
    })
  })
}
