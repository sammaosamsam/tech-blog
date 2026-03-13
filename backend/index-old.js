require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 导入文章数据管理（使用文件存储）
const { getArticles, saveArticles, generateId } = require('./src/utils/fileStorage');
const { authenticateToken } = require('./src/routes/auth');

// 初始化Express应用
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 认证路由（不需要认证）
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // 模拟用户数据库
    const users = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: '管理员'
      }
    ];

    // 验证用户名和密码
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成简单的 token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token: token
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

// API路由 - 文章CRUD（公开访问）
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticles();
    const article = articles.find(a => a._id === req.params.id);

    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 需要认证的文章操作路由
app.post('/api/articles', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const newArticle = {
      _id: generateId(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    articles.push(newArticle);
    await saveArticles(articles);

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: '创建文章失败' });
  }
});

app.put('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const index = articles.findIndex(a => a._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' });
    }

    articles[index] = {
      ...articles[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await saveArticles(articles);
    res.json(articles[index]);
  } catch (error) {
    res.status(500).json({ error: '更新文章失败' });
  }
});

app.delete('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const index = articles.findIndex(a => a._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: '文章不存在' });
    }

    articles.splice(index, 1);
    await saveArticles(articles);

    res.json({ message: '文章删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除文章失败' });
  }
});

// AI生成文章的接口（需要认证）
app.post('/api/generate', authenticateToken, (req, res) => {
  try {
    const { topic, style = '技术分享', length = 'medium' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: '请提供文章主题' });
    }

    const generatedArticle = {
      title: `${topic} - 深度解析与实战指南`,
      excerpt: `本文将深入探讨${topic}的核心概念、实际应用场景以及最佳实践。无论您是初学者还是有经验的开发者，都能从中获得有价值的见解。`,
      content: generateContent(topic, style, length),
      author: 'AI Assistant',
      tags: generateTags(topic),
      readTime: calculateReadTime(topic, length)
    };

    res.json({
      success: true,
      data: generatedArticle
    });

  } catch (error) {
    console.error('生成文章失败:', error);
    res.status(500).json({ error: '生成文章失败' });
  }
});

// 辅助函数：生成文章内容
function generateContent(topic, style, length) {
  const introductions = [
    `在当今快速发展的技术领域，${topic}已经成为开发者必须掌握的核心技能之一。`,
    `${topic}作为现代软件开发的重要组成部分，其重要性不言而喻。`,
    `随着技术的不断进步，${topic}在各个行业中的应用越来越广泛。`
  ];

  const sections = [
    {
      title: '什么是' + topic + '？',
      content: `${topic}是一种强大的技术解决方案，它能够帮助我们更高效地完成开发任务。通过合理运用${topic}，我们可以构建出更加稳定、可扩展的应用程序。`
    },
    {
      title: topic + '的核心特性',
      content: `1. **高性能**：${topic}在性能方面表现出色，能够处理大量并发请求。\n\n2. **易用性**：提供了简洁直观的API，降低了学习曲线。\n\n3. **可扩展性**：支持模块化设计，便于功能扩展。\n\n4. **社区支持**：拥有活跃的开发者社区，问题解决方案丰富。`
    },
    {
      title: topic + '的应用场景',
      content: `${topic}在以下场景中表现尤为突出：\n\n- Web应用开发\n- 移动应用后端\n- 微服务架构\n- 实时数据处理\n- API服务开发`
    },
    {
      title: '最佳实践',
      content: `在使用${topic}时，建议遵循以下最佳实践：\n\n1. **合理规划架构**：在项目开始前，充分评估需求和规模。\n\n2. **代码规范**：保持代码的一致性和可读性。\n\n3. **测试驱动**：编写充分的单元测试和集成测试。\n\n4. **持续集成**：建立完善的CI/CD流程。`
    },
    {
      title: '总结',
      content: `${topic}是一个值得深入学习和应用的技术。通过本文的介绍，相信您对${topic}有了更全面的了解。在实际项目中，不断实践和总结，才能真正掌握这门技术。`
    }
  ];

  const intro = introductions[Math.floor(Math.random() * introductions.length)];
  let markdownContent = `# ${topic} - 深度解析与实战指南\n\n${intro}\n\n`;

  sections.forEach(section => {
    markdownContent += `## ${section.title}\n\n${section.content}\n\n`;
  });

  markdownContent += `> 💡 **提示**：本文由AI自动生成，内容仅供参考。在实际应用中，请根据具体需求进行调整。\n\n---\n\n*欢迎在评论区分享您的看法和经验！*`;

  return markdownContent;
}

// 辅助函数：生成标签
function generateTags(topic) {
  const commonTags = ['技术分享', '教程', '最佳实践'];
  const topicTags = [topic, '开发'];

  if (topic.includes('React')) topicTags.push('前端');
  if (topic.includes('Python')) topicTags.push('后端');
  if (topic.includes('数据库')) topicTags.push('数据');

  return [...new Set([...commonTags, ...topicTags])];
}

// 辅助函数：计算阅读时间
function calculateReadTime(topic, length) {
  const baseTime = 5;
  const lengthMultiplier = {
    short: 0.5,
    medium: 1,
    long: 1.5
  };

  return Math.round(baseTime * (lengthMultiplier[length] || 1));
}

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '路由不存在' });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
