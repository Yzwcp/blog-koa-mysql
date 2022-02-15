const Router = require('koa-router')
const commonRouter = new Router()
const DB = require("../../connect/mysql.js")
const {auth,client,formatResult} = require('../../util/util.js')
const jwt = require('koa-jwt')({secret:'umep_app_secret'});
const multer  = require("@koa/multer");
const co = require("co");
const fs = require("fs");
const path =require('path')
const {commonMoudles} = require('./static.js')
/***
 * 评论喜欢
 */
commonRouter.post('/saveCommonLike', async (ctx) => {
  const {where,userLikeMd5,dbName} = ctx.request.body
  if(where) wo="where "+ where
  let result = await commonMoudles.guestList([],dbName,userLikeMd5,wo)

  ctx.body = result;
});
/**
 * 通用查询接口
 */
commonRouter.get('/query',auth, async (ctx) => {
  const {query} = ctx.request
  const {dbName,where="",orderBy="Id",limit="0,10"} = query
  let wo = ''
  if(where) wo="where "+ where
  const count  = await commonMoudles.countQuery([],dbName,wo)
  const result = await commonMoudles.commonQuery([],dbName,wo,orderBy,limit)
  if(count.success) result.total = count.result[0].total//总记录数
  ctx.body = result
});
/**
 * 查询图片接口
 */
commonRouter.get('/imageList',async (ctx)=>{
  try {
    const {path='article_cover'}=ctx.request.query
    let result = await client.listV2({
      'prefix':'blog/'+path,
    })
    ctx.body={
      ...formatResult(result.objects,true)
    }
  } catch (err) {
    console.log (err)
  }
})

/**
 * 上传图片
 */
let storage = multer.diskStorage({
  //文件保存路径 这个路由是以项目文件夹 也就是和入口文件（如app.js同一个层级的）
  destination: function (req, file, cb) {
    cb(null, "./public/images");        // 储存到 public/images文件夹里
  },
  //修改文件名称
  filename: function (req, file, cb) {
    let fileFormat = file.originalname.split("."); //以点分割成数组，数组的最后一项就是后缀名
    let name = "img_" + Date.now() + "." + fileFormat[fileFormat.length - 1]
    req.name= name
    cb(null,name );
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: (1024 * 1024), // 限制1m
    // fileSize: (1024 * 1024) / 2, // 限制512KB
  },
});

commonRouter.post("/upload",async (ctx, next) => {

  try {
    await upload.single('file')(ctx, next)
  }catch (e) {
    //文件过大捕获
    console.log('eeee',e)
    ctx.status = 500;
    return  ctx.body=formatResult(JSON.parse(JSON.stringify(e)),false,JSON.parse(JSON.stringify(e)).message)
  }
  let key  =  ctx.req.name
  //图片路径
  const localFile = "./public/images/" + key;
  //设置返回图片的高度
  const imgWidth = "?x-oss-process=image/resize,w_150"
  await co(function* () {
    // client.useBucket(ali_oss.bucket);
    try {
      //上传到阿里云oss
      const result = yield client.put('blog/article_cover/'+key, localFile);
      if(result.res.status==200){
        return  ctx.body = formatResult({name:key,url:result.url+imgWidth},true)
      }
      throw ({result})
    }catch (e) {
      ctx.body = formatResult(e.result,false)
    }
    //删除临时图片
    fs.unlinkSync(localFile);
  });

});

module.exports = commonRouter.routes()
