const Router = require('koa-router')
const router = new Router()

const articleRouter = require('./routes/article')
const commentRouter = require('./routes/comment')
const classifyRouter = require('./routes/classify')
const tagsRouter = require('./routes/tags')
const commonRouter = require('./routes/common')
const userRouter = require('./routes/user')
const thirdPartyRouter = require('./routes/thirdpartyPost')

router.use(articleRouter)
.use(classifyRouter)
.use(tagsRouter)
.use(commonRouter)
.use(commentRouter)
.use(userRouter)
.use(thirdPartyRouter)
module.exports = router
