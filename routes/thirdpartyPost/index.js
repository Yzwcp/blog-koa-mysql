const Router = require('koa-router')
const thirdparty = new Router()
const {util} = require('../../util')
const koa2Req = require('koa2-request')
const fiexdParams = {
  platform : 2,
  gkey : '000000',
  app_version : '4.1.0.8',
  versioncode : '20141459',
  market_id : 'floor_xiaomi',
  _key : 'A2D6FB7490171C28C11DA24A3DF8CD6BB26BC92CDB7505D5BF85F72053F64CE040A626C094BBA74549207D57787E4BE266FB830A4F3ECB2A',
  device_code : '%5Bd%5Dcd4ec618-1646-4b76-894c-6b1ae580feb0',
  phone_brand_type : 'VO',
}
const postsListParams = {
  start:0,
  count:20,
  cat_id:43,//分类id
  tag_id:0,//标签
  sort_by:0,//0：按回复,1按发布时间
}
const postDetail = {
  post_id:49896707,
  page_no:1,
  page_size:20,
  doc:1
}
thirdparty.prefix('/thirdparty')
thirdparty.get('/category', async (ctx) => {
  const thirdpartyResult =await koa2Req({url:'http://floor.huluxia.com/category/list/ANDROID/2.0',params:{...fiexdParams,is_hidden:1}})
  if(thirdpartyResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(thirdpartyResult.body)))
    ctx.body=util.formatResult(result,true)
  }else{
    ctx.body=util.formatResult(result,false)
  }
});
thirdparty.get('/posts', async (ctx) => {
  const thirdpartyResult =await koa2Req({url:'http://floor.huluxia.com/post/list/ANDROID/2.0',qs:{...postsListParams,...fiexdParams}
  })
  if(thirdpartyResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(thirdpartyResult.body)))
    ctx.body= util.formatResult(result,true)
  }else{
    ctx.body=util.formatResult(result,false)
  }
});
thirdparty.get('/post/detail', async (ctx) => {
  const thirdpartyResult =await koa2Req({url:'http://floor.huluxia.com/post/detail/ANDROID/4.1.7',qs:{...postDetail,...fiexdParams}
  })
  if(thirdpartyResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(thirdpartyResult.body)))
    ctx.body= util.formatResult(result,true)
  }else{
    ctx.body=util.formatResult(result,false)
  }
});
module.exports = thirdparty.routes()
