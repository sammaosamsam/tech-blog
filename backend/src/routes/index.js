const router = require('express').Router();

// 导入文章路由
const articlesRouter = require('./articles');
const generateRouter = require('./generate');

// 使用路由
router.use('/articles', articlesRouter);
router.use('/generate', generateRouter);

module.exports = router;
