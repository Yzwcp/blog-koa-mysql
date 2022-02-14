const Router = require('koa-router')
const router = new Router()

const articleRouter = require('./article/index')
const commentRouter = require('./comment/index')
const classifyRouter = require('./classify/index')
const tagsRouter = require('./tags/index')
const commonRouter = require('./common/index')
const userRouter = require('./user/index')
const thirdPartyRouter = require('./thirdpartyPost/index.js')

router.use(articleRouter)
.use(classifyRouter)
.use(tagsRouter)
.use(commonRouter)
.use(commentRouter)
.use(userRouter)
.use(thirdPartyRouter)
module.exports = router
