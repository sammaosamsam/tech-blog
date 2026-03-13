const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// POST - AI 生成文章并保存
router.post('/', async (req, res) => {
  try {
    const { topic, tags, author } = req.body;

    if (!topic) {
      return res.status(400).json({ message: '请提供文章主题' });
    }

    const generatedArticle = {
      title: `深度解析：${topic}`,
      excerpt: `本文将深入探讨 ${topic} 的核心概念、实际应用和最佳实践。`,
      content: `# 深度解析：${topic}

## 简介
${topic} 是现代技术领域的重要概念。

## 核心特性
### 特点 1
- 高效性能
- 易于使用

### 特点 2
\`\`\`javascript
function example() {
  console.log('${topic}');
}
\`\`\`

## 实际应用
1. 应用场景 1
2. 应用场景 2

## 最佳实践
- ✓ 确保正确配置
- ✓ 进行充分测试

## 总结
${topic} 是强大的工具，掌握它将提升开发效率。`,
      author: author || 'AI 助手',
      date: new Date().toISOString().split('T')[0],
      tags: tags || [topic, '技术分享'],
      readTime: Math.floor(Math.random() * 10) + 5
    };

    const article = await Article.create(generatedArticle);
    
    res.status(201).json({
      success: true,
      message: '文章生成成功',
      article
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
