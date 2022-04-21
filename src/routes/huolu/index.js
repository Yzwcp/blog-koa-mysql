const Router = require('koa-router')
const HuoL = new Router()
const {util} = require('../../util/util.js')
const koa2Req = require('koa2-request')
const {auth,formatResult,Tips} = require('../../util/util.js')

var request = require('request');
const qs = require('qs')
const fiexdParams = {
  platform : 2,
  gkey : '000000',
  app_version : '4.1.0.8',
  versioncode : '20141459',
  market_id : 'floor_xiaomi',
  _key : 'A91C774919A75441BA88F001C990C0BC1D4F0972542810803F733F7B729CA135609F49D5BE031554C74F5ACE4922CFB199B60F40AF8A73F6',
  device_code : '%5Bd%5Dcd4ec618-1646-4b76-894c-6b1ae580feb0',
  phone_brand_type : 'VO',
}
const postsListParams = {
  start:0,
  count:5,
  cat_id:43,//分类id
  tag_id:0,//标签
  sort_by:1,//0：按回复,1按发布时间
}
// categoryID:43实用软件
// tagid  0 全部 4301 绿色软件4302原创工具 4304 影音播放 4303集合贴 4305通告活动
const postDetail = {
  post_id:49896707,
  page_no:1,
  page_size:20, 
  doc:1
}
const searchParams = {
  start:0,
  count:5,
  cat_id:43,
  
}
HuoL.prefix('/wx/hulu')
HuoL.post('/category', async (ctx) => {
  const HuoLResult =await koa2Req({url:'http://floor.huluxia.com/category/list/ANDROID/2.0',params:{...fiexdParams,is_hidden:1}})
  if(HuoLResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(HuoLResult.body)))
    ctx.body=formatResult(result,true)
  }else{
    ctx.body=formatResult(result,false)
  }

 
}); 
HuoL.get('/posts', async (ctx) => {
  const params = ctx.query
  params.start =0
  console.log(params);
  const HuoLResult =await koa2Req({url:'http://floor.huluxia.com/post/list/ANDROID/2.0',qs:{...postsListParams,...fiexdParams,...params}
  })
  if(HuoLResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(HuoLResult.body)))
    ctx.body= formatResult(result,true)
  }else{
    ctx.body=formatResult(result,false)
  }
});
HuoL.get('/posts/search', async (ctx) => {
  const params = ctx.query
  // params.start =new Date().getTime()
  console.log({...searchParams,...fiexdParams,...params});
  const HuoLResult =await koa2Req({url:'http://floor.huluxia.com/post/search/ANDROID/2.1',qs:{...searchParams,...fiexdParams,...params}
  })
  if(HuoLResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(HuoLResult.body)))
    ctx.body= formatResult(result,true)
  }else{
    ctx.body=formatResult(result,false)
  }
});
HuoL.get('/post/detail', async (ctx) => {
  const params = ctx.query
  const HuoLResult =await koa2Req({url:'http://floor.huluxia.com/post/detail/ANDROID/4.1.7',qs:{...postDetail,...fiexdParams,...params}
  })

  if(HuoLResult.statusCode===200){
    const result = JSON.parse(JSON.parse(JSON.stringify(HuoLResult.body)))
    ctx.body= formatResult(result,true)
  }else{
    ctx.body=formatResult(result,false)
  }
});
module.exports = HuoL.routes()
