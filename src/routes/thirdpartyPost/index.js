const Router = require('koa-router')
const thirdparty = new Router()
const {util} = require('../../util/util.js')
const koa2Req = require('koa2-request')
var request = require('request');
const qs = require('qs')
const fs = require('fs')
const baseUrl  ='http://39.104.62.121:8080/skillcenterwx'
const token = "?token=1729873020190720200"
const multer  = require("@koa/multer");
const co = require("co");
const axios = require('axios');
const FormData =require('form-data')
const path = require('path')
const koaBody = require('koa-body');
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
console.log('1234'.substring(0,3));
async function delay(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(function(){
    let a = {
        "msg": "sucess",
        "code": "1",
        "data":0
    }
      resolve(a);
    }, time);
  });
};



thirdparty.post('/proxy',async (ctx,next) => {
	
//   ctx.body=JSON.stringify(a)
	let body = ctx.request.body
	const url =baseUrl+ctx.query.url +token
	if(ctx.query.img==1){
		await koaBody({
		  multipart:true, // 支持文件上传
		  encoding:'gzip',
		  formidable:{
		    uploadDir:('./public/jiuhua/'), // 设置文件上传目录
		    keepExtensions: true,    // 保持文件的后缀
		    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
		    onFileBegin:(name,file) => { // 文件上传前的设置
		      // console.log(`name: ${name}`);
		      // console.log(file);
		    },
		  }
		})(ctx,next)
		// console.log(a);
		const localFile =fs.createReadStream('./public/jiuhua/'+ctx.request.files.file.newFilename)
		// console.log('./public/jiuhua/'+ctx.request.files.file.newFilename);
		const r = {"personid":"128587","trainid":"29300","personname":"袁志文","taskid":"161720","token":"1731160516329478200"}
		let formData = new FormData()
		formData.append('file', localFile);
		formData.append('data', JSON.stringify(r));
		try{
			let result = await p(url,formData)
      console.log(result);
			ctx.body=JSON.stringify(result)
			// fs.writeFile('user.json', result, (err) => {
			//     if (err) {
			//         throw err;
			//     }
			//     console.log("JSON data is saved.");
			// });
		}catch(err){
      console.log(err);
      ctx.body=JSON.stringify(err)
    }
		return
	}
	// console.log(ctx.query.url);
	//删除代理标记url
	//测试死数据
	if(body.hasOwnProperty('personid')){
		// body['personid'] = 128587
    body['personid'] = 111447
	}
	if(body.hasOwnProperty('phoneno')){
		body['phoneno'] =  17395715159
	}
  if(body.hasOwnProperty('trainid')){
		body['trainid'] =  25212
	}
  // if(body.hasOwnProperty('begintime')){
  //   body['begintime'] =  '2022/4/19'
  // }
  // console.log(ctx.query.url.indexOf('appointmenttrain'));
  // if(ctx.query.url.indexOf('appointmenttrain')>-1){
  //   let a = await delay(1000)
	// 	ctx.body=JSON.stringify(a)

  //   return
  // }
	try{
		let result = await p(url,body)
		// const result = await delay(500)
		ctx.body=JSON.stringify(result)
		// fs.writeFile('user.json', result, (err) => {
		//     if (err) {
		//         throw err;
		//     }
		//     console.log("JSON data is saved.");
		// });
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
