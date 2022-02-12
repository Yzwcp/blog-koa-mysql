const Router = require('koa-router')
const commonRouter = new Router()
const DB = require("../../config.js")
const {util,client,formatResult} = require('../../util')
const jwt = require('koa-jwt')({secret:'umep_app_secret'});
const multer  = require("@koa/multer");
const co = require("co");
const fs = require("fs");
const path =require('path')

let routesModel = {
  commonQuery:(value,dbName,where="",orderBy,limit) => {
    const sql = `select * from ${dbName} ${where} order by ${orderBy} limit ${limit}`;
    return  DB.query(sql,value);
  },
  /**
   * 点赞 喜欢
   * @param value
   * @param dbName
   * @param userLikeMd5 用户的md5  浏览器类型+id
   * @param where
   * @returns {Promise<unknown>}
   */
  guestList:(value,dbName,userLikeMd5,where)=>{
    let _sql = 'update '+dbName+' set likeList = concat(likeList,'+'"'+userLikeMd5+',"'+') '+where+''
    return DB.query( _sql, value)
  },
  countQuery:(value,dbName,where)=>{
    const sql = `select   count(*)   as   total   from   ${dbName}  ${where}`;
    return  DB.query(sql,value);
  },
}
/***
 * 评论喜欢
 */
commonRouter.post('/saveCommonLike', async (ctx) => {
  const {where,userLikeMd5,dbName} = ctx.request.body
  if(where) wo="where "+ where
  let result = await routesModel.guestList([],dbName,userLikeMd5,wo)

  ctx.body = result;
});
/**
 * 通用查询接口
 */
commonRouter.get('/query',util.auth, async (ctx) => {
  const {query} = ctx.request
  const {dbName,where="",orderBy="Id",limit="0,10"} = query
  let wo = ''
  if(where) wo="where "+ where
  const count  = await routesModel.countQuery([],dbName,wo)
  const result = await routesModel.commonQuery([],dbName,wo,orderBy,limit)
  if(count.success) result.total = count.result[0].total//总记录数
  ctx.body = result
});
/**
 * 查询图片接口
 */
commonRouter.get('/imageList',async (ctx)=>{
  console.log(__dirname)
  console.log(ctx.req)
  ctx.body={
    name:ctx
  }
  return
  try {
    const {path='article_cover'}=ctx.request.query
    let result = await client.listV2({
      'prefix':'blog/'+path,
    })
    ctx.body={
      ...util.formatResult(result.objects,true)
    }
  } catch (err) {
    console.log (err)
  }
})

let storage = multer.diskStorage({
  //文件保存路径 这个路由是以项目文件夹 也就是和入口文件（如app.js同一个层级的）
  destination: function (req, file, cb) {
    cb(null, "./public/images");        // 储存到 public/images文件夹里
  },
  //修改文件名称
  filename: function (req, file, cb) {
    let fileFormat = file.originalname.split("."); //以点分割成数组，数组的最后一项就是后缀名
    let name = "joe" + Date.now() + "." + fileFormat[fileFormat.length - 1]
    req.name= name
    cb(null,name );
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: (1024 * 1024) / 2, // 限制512KB
  },
});

commonRouter.post("/upload",async (ctx, next) => {

  try {
    await upload.single('file')(ctx, next)
  }catch (e) {
    //文件过大捕获
    console.log(e)
    ctx.status = 500;
    return  ctx.body=util.formatResult({},false,JSON.parse(JSON.stringify(e)).message)
  }
  let key  =  ctx.req.name
  console.log(key)
  //上传到阿里云oss
  const localFile = "./public/images/" + key;
  await co(function* () {
    // client.useBucket(ali_oss.bucket);
    try {
      const result = yield client.put('blog/article_cover/'+key, localFile);
      if(result.res.status==200){
        return  ctx.body = util.formatResult(result.url,true)
      }
      throw ({result})
    }catch (e) {
      ctx.body = util.formatResult(e.result,false)
    }
    // fs.unlinkSync(localFile);
  });

});

module.exports = commonRouter.routes()
