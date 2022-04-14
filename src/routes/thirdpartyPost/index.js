const Router = require('koa-router')
const thirdparty = new Router()
const {util} = require('../../util/util.js')
const koa2Req = require('koa2-request')
var request = require('request');
const qs = require('qs')
const baseUrl  ='http://39.104.62.121:8080/skillcenterwx'
const token = "?token=1729873020190720200"
const fs =require('fs')

// thirdparty.prefix('/rest/wechatapplettrain')
const p = (url,form)=>{
	return new Promise((resolve,rejeck)=>{
		request.post({url, form}, (error, response, body) =>{
		    if (!error && response.statusCode == 200) {
		      resolve(response.body)
		    }else{
		      rejeck(error)
		    }
		})
	})
}

thirdparty.post('/proxy', async (ctx) => {
	let body = ctx.request.body
	// console.log(ctx.query.url);
	const url =baseUrl+ctx.query.url +token
	//删除代理标记url
	//测试死数据
	if(body.hasOwnProperty('personid')){
    body['personid'] = 128587
  }
  if(body.hasOwnProperty('phoneno')){
    body['phoneno'] =  17395715159
  }
	// console.log(url);
	// console.log(body);
	try{
		let result = await p(url,body)
		// console.log(result);
		let a =JSON.parse(result)
		console.log(a);
		ctx.body=JSON.stringify(result)
		fs.writeFile('user.json', result, (err) => {
		    if (err) {
		        throw err;
		    }
		    console.log("JSON data is saved.");
		});
	}catch(err){ctx.body=JSON.stringify(err)}
}); 





























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



thirdparty.post('/savedetail', async (ctx) => {

  console.log(ctx.request.body)
  let body = ctx.request.body
  body.personid = 111447
  console.log(body);
  var url = 'http://39.104.62.121:8080/skillcenterwx//rest/wechatapplettrain/addfacilitiessheet.action?token=1729873020190720200'
    let a = new Promise((r,c)=>{
      request.post({url:url, form:ctx.request.body}, (error, response, body) =>{
        if (!error && response.statusCode == 200) {
          // console.log(response.body);
          // console.log(body);
          r(response.body)
        }else{
          c(error)
        }
    })
    })
    
    try{
      const d = await a 
		ctx.body=JSON.stringify(d)
    }catch{
		ctx.body=JSON.stringify(d)
    }

 
}); 
thirdparty.post('/category', async (ctx) => {
  // const thirdpartyResult =await koa2Req({url:'http://floor.huluxia.com/category/list/ANDROID/2.0',params:{...fiexdParams,is_hidden:1}})
  // if(thirdpartyResult.statusCode===200){
  //   const result = JSON.parse(JSON.parse(JSON.stringify(thirdpartyResult.body)))
  //   ctx.body=util.formatResult(result,true)
  // }else{
  //   ctx.body=util.formatResult(result,false)
  // }


 
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
