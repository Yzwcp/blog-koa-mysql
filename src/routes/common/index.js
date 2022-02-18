const Router = require('koa-router')
const commonRouter = new Router()
const {Op} = require("../../connect/mysql.js")
const multer  = require("@koa/multer");
const co = require("co");
const fs = require("fs");
const {formatResult,Tips,client} = require('../../util/util.js')

const {Comment} = require('../comment/static.js')
const {Article} = require('../article/static.js')




commonRouter.prefix('/common')
/***
 * 喜欢
 * @type 1:文章喜欢,2评论喜欢,3博客喜欢
 * @nickName 用户自定义昵称
 * @email:用户邮箱 推荐qq邮箱
 * @commentId:评论id
 */
commonRouter.post('/like/save', async (ctx) => {
  const {type,commentId,articleId,agentMd5} = ctx.request.body

  if(type==2){
    // 点赞评论
    try {
      const queryRe = await Comment.findOne({where:{id:commentId}})
      let listStr = queryRe.likeList
      if (listStr===null) listStr=''
      if( listStr.indexOf(agentMd5)>-1) throw '你已经点赞该评论了'
      const result = await Comment.update({
        likeList:listStr+","+agentMd5
      },{where:{id:commentId}})
      if(result.includes(1))return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    }catch (e) {
      ctx.body = formatResult(e,false,Tips.HANDLE_ERR);
    }
  }else if(type==1){
    //点赞文章
    try {
      const queryRe = await Article.findOne({where:{id:articleId}})
      let listStr = queryRe.likeList
      if (listStr===null) listStr=''
      if( listStr.indexOf(agentMd5)>-1) throw '你已经点赞该文章了'
      const result = await Article.update({
        likeList:listStr+","+agentMd5
      },{where:{id:articleId}})
      if(result.includes(1))return  ctx.body = formatResult(result,true,Tips.HANDLE_SUCCESS);
    }catch (e) {
      ctx.body = formatResult(e,false,Tips.HANDLE_ERR);
    }
  }

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
