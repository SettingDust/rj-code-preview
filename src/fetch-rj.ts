export const productPage = (rj: string) => `https://www.dlsite.com/maniax/work/=/product_id/${rj}.html`

function productInfo(rj: string) {
  return new Promise<{
    work_name: string
    work_type_string: string
    maker_name: string
    regist_date: string
    title_name: string
    age_category_string: string
    creaters: {
      [K in 'voice_by' | 'illust_by' | 'scenario_by' | 'created_by' | 'music_by']: {
        name: string
      }[]
    }
    image_main: {
      url: string
    },
    genres: {
      name: string
    }[]
  }>((resolve, reject) => {
    const cache = GM_getValue(`${rj} product`)
    if (cache) {
      console.debug('[rj-code-preview/product/cache]')
      resolve(cache)
    }
    GM_xmlhttpRequest({
      url: `https://www.dlsite.com/maniax/api/=/product.json?workno=${rj}`,
      responseType: 'json',
      onload: function (resp) {
        if (resp.readyState === 4 && resp.status === 200) {
          GM_setValue(`${rj} product`, resp.response[0])
          console.debug('[rj-code-preview/product]', resp.response[0])
          resolve(resp.response[0])
        } else reject(resp)
      }
    })
  })
}

function productRatingInfo(rj: string) {
  return new Promise<{
    dl_count: string
    rate_average_2dp: string
  }>((resolve, reject) => {
    const cache = GM_getValue(`${rj} rating`)
    if (cache) {
      console.debug('[rj-code-preview/rating/cache]')
      resolve(cache)
    }
    GM_xmlhttpRequest({
      url: `https://www.dlsite.com/maniax/product/info/ajax?product_id=${rj}`,
      responseType: 'json',
      onload: function (resp) {
        if (resp.readyState === 4 && resp.status === 200) {
          GM_setValue(`${rj} rating`, resp.response[rj])
          console.debug('[rj-code-preview/rating]', resp.response[rj])
          resolve(resp.response[rj])
        }
        else reject(resp)
      }
    })
  })
}

export default async function(rj: string) {
  const product$ = productInfo(rj)
  const rating = await productRatingInfo(rj)
  const product = await product$

  return {
    name: product.work_name,
    image: product.image_main?.url,
    type: product.work_type_string,
    group: product.maker_name,
    date: product.regist_date,
    series: product.title_name,
    age: product.age_category_string,
    voices: product.creaters?.voice_by?.map(it => it.name),
    illusts: product.creaters?.illust_by?.map(it => it.name),
    scenarios: product.creaters?.scenario_by?.map(it => it.name),
    creators: product.creaters?.created_by?.map(it => it.name),
    musics: product.creaters?.music_by?.map(it => it.name),
    hasCreators: product.creaters?.created_by?.length,
    hasScenarios: product.creaters?.scenario_by?.length,
    hasIllusts: product.creaters?.illust_by?.length,
    hasVoices: product.creaters?.voice_by?.length,
    hasMusics: product.creaters?.music_by?.length,
    tags: product.genres?.map(it => it.name),
    hasTags: product.genres?.length,
    rating: rating.rate_average_2dp,
    sale: rating.dl_count,
  }
}