const Router = require('koa-router')
const router = new Router()

const articleRouter = require('./routes/article')
const commentRouter = require('./routes/comment')
const classifyRouter = require('./routes/classify')
const tagsRouter = require('./routes/tags')
const commonRouter = require('./routes/common')
const userRouter = require('./routes/user')
const thirdPartyRouter = require('./routes/thirdpartyPost')
const bulkRouter = require('./routes/bulk')
const orderRouter = require('./routes/order')
const groupAddRouter = require('./routes/groupAdd')
const HuoL = require('./routes/huolu')

router.use(articleRouter)
.use(classifyRouter)
.use(tagsRouter)
.use(commonRouter)
.use(commentRouter)
.use(userRouter)
.use(thirdPartyRouter)
.use(bulkRouter)
.use(orderRouter)
.use(HuoL)
.use(groupAddRouter)
module.exports = router


