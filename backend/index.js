require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

// 导入工具模块
const { getArticles, saveArticles, generateId } = require('./src/utils/fileStorage');
const { getSettings, saveSettings, getAccount, saveAccount } = require('./src/utils/settingsStorage');
const { getCategories, saveCategories, generateCategoryId } = require('./src/utils/categoryStorage');
const { authenticateToken } = require('./src/routes/auth');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const path = require('path');
const publicPath = path.join(__dirname, 'public');

// 图片上传目录
const UPLOAD_DIR = path.join(__dirname, '../data/uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer 配置：限制 5MB，只允许图片
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 6)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// ============================================================
// 健康检查（最先注册）
// ============================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 图片静态访问
app.use('/uploads', express.static(UPLOAD_DIR));

// ============================================================
// 图片上传 API
// ============================================================
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '请选择图片文件（jpg/png/gif/webp/svg，最大 5MB）' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

// 删除已上传图片
app.delete('/api/upload/:filename', authenticateToken, (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: '删除失败' });
  }
});

// ============================================================
// 分类管理 API
// ============================================================

// 获取所有分类（公开）
app.get('/api/categories', async (req, res) => {
  try {
    res.json(await getCategories());
  } catch {
    res.status(500).json({ error: '获取分类失败' });
  }
});

// 新建分类（需认证）
app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description = '', color = '#6b7280' } = req.body;
    if (!name) return res.status(400).json({ error: '分类名称不能为空' });
    const cats = await getCategories();
    const newCat = { id: generateCategoryId(), name, description, color, createdAt: new Date().toISOString() };
    cats.push(newCat);
    await saveCategories(cats);
    res.status(201).json(newCat);
  } catch {
    res.status(500).json({ error: '创建分类失败' });
  }
});

// 更新分类（需认证）
app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const cats = await getCategories();
    const idx = cats.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: '分类不存在' });
    cats[idx] = { ...cats[idx], ...req.body, id: cats[idx].id };
    await saveCategories(cats);
    res.json(cats[idx]);
  } catch {
    res.status(500).json({ error: '更新分类失败' });
  }
});

// 删除分类（需认证）
app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const cats = await getCategories();
    const idx = cats.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: '分类不存在' });
    cats.splice(idx, 1);
    await saveCategories(cats);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: '删除分类失败' });
  }
});

// ============================================================
// 认证 API
// ============================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const account = await getAccount();

    if (account.username !== username || account.password !== password) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const token = Buffer.from(`${account.id}:${Date.now()}`).toString('base64');
    const { password: _, ...userWithoutPassword } = account;

    res.json({
      success: true,
      message: '登录成功',
      data: { user: userWithoutPassword, token }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ============================================================
// 站点设置 API
// ============================================================

// 获取站点设置（公开，前端 Navbar / Footer 需要）
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    const { siteTitle, siteSubtitle, siteUrl, footerText } = settings;
    res.json({ siteTitle, siteSubtitle, siteUrl, footerText });
  } catch (error) {
    res.status(500).json({ error: '获取设置失败' });
  }
});

// 更新站点设置（需要认证）
app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { siteTitle, siteSubtitle, siteUrl, footerText } = req.body;
    const current = await getSettings();
    const updated = await saveSettings({
      ...current,
      ...(siteTitle !== undefined && { siteTitle }),
      ...(siteSubtitle !== undefined && { siteSubtitle }),
      ...(siteUrl !== undefined && { siteUrl }),
      ...(footerText !== undefined && { footerText })
    });
    res.json({ success: true, message: '设置已保存', data: updated });
  } catch (error) {
    res.status(500).json({ error: '保存设置失败' });
  }
});

// ============================================================
// 账号管理 API
// ============================================================

// 修改账号密码（需要认证）
app.put('/api/auth/account', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword, name } = req.body;
    const account = await getAccount();

    // 验证当前密码
    if (account.password !== currentPassword) {
      return res.status(401).json({ success: false, message: '当前密码错误' });
    }

    const updated = await saveAccount({
      ...account,
      ...(newUsername && { username: newUsername }),
      ...(newPassword && { password: newPassword }),
      ...(name && { name })
    });

    const { password: _, ...safe } = updated;
    res.json({ success: true, message: '账号信息已更新', data: safe });
  } catch (error) {
    res.status(500).json({ error: '更新账号失败' });
  }
});

// ============================================================
// 文章 API
// ============================================================

// 获取文章列表
// - 公开访问：只返回 visible !== false 的文章
// - 管理员（带 token）：返回所有文章
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticles();
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // 尝试验证 token，成功则返回全部文章（含隐藏）
      try {
        const account = await getAccount();
        const decoded = Buffer.from(token, 'base64').toString();
        const [userId] = decoded.split(':');
        if (userId === account.id) {
          return res.json(articles);
        }
      } catch { /* token 无效，按公开处理 */ }
    }

    // 公开访问：只返回可见文章
    res.json(articles.filter(a => a.visible !== false));
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 获取单篇文章（公开，隐藏文章也可直接访问，如需严格可加判断）
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticles();
    const article = articles.find(a => a._id === req.params.id);
    if (!article) return res.status(404).json({ error: '文章不存在' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 创建文章（需要认证）
app.post('/api/articles', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const newArticle = {
      _id: generateId(),
      visible: true,
      category: '',
      coverImage: '',
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

// 更新文章（需要认证）
app.put('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const index = articles.findIndex(a => a._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: '文章不存在' });

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

// 切换文章显示/隐藏（需要认证）
app.patch('/api/articles/:id/visibility', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const index = articles.findIndex(a => a._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: '文章不存在' });

    const { visible } = req.body;
    articles[index] = {
      ...articles[index],
      visible: Boolean(visible),
      updatedAt: new Date().toISOString()
    };
    await saveArticles(articles);
    res.json({ success: true, message: visible ? '文章已显示' : '文章已隐藏', data: articles[index] });
  } catch (error) {
    res.status(500).json({ error: '更新失败' });
  }
});

// 删除文章（需要认证）
app.delete('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const articles = await getArticles();
    const index = articles.findIndex(a => a._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: '文章不存在' });

    articles.splice(index, 1);
    await saveArticles(articles);
    res.json({ message: '文章删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除文章失败' });
  }
});

// ============================================================
// AI 生成文章 API（需要认证）
// ============================================================
app.post('/api/generate', authenticateToken, (req, res) => {
  try {
    const { topic, style = '技术分享', length = 'medium' } = req.body;
    if (!topic) return res.status(400).json({ error: '请提供文章主题' });

    const generatedArticle = {
      title: `${topic} - 深度解析与实战指南`,
      excerpt: `本文将深入探讨${topic}的核心概念、实际应用场景以及最佳实践。`,
      content: generateContent(topic, style, length),
      author: 'AI Assistant',
      tags: generateTags(topic),
      readTime: calculateReadTime(topic, length)
    };

    res.json({ success: true, data: generatedArticle });
  } catch (error) {
    console.error('生成文章失败:', error);
    res.status(500).json({ error: '生成文章失败' });
  }
});

// ============================================================
// 静态文件 + React Router 兜底（必须在所有 API 之后）
// ============================================================
if (require('fs').existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log('Serving static files from:', publicPath);

  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// ============================================================
// 错误处理
// ============================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: '路由不存在' });
});

// ============================================================
// 辅助函数
// ============================================================
function generateContent(topic, style, length) {
  const introductions = [
    `在当今快速发展的技术领域，${topic}已经成为开发者必须掌握的核心技能之一。`,
    `${topic}作为现代软件开发的重要组成部分，其重要性不言而喻。`,
    `随着技术的不断进步，${topic}在各个行业中的应用越来越广泛。`
  ];

  const sections = [
    {
      title: '什么是' + topic + '？',
      content: `${topic}是一种强大的技术解决方案，它能够帮助我们更高效地完成开发任务。`
    },
    {
      title: topic + '的核心特性',
      content: `1. **高性能**：${topic}在性能方面表现出色。\n\n2. **易用性**：提供了简洁直观的API。\n\n3. **可扩展性**：支持模块化设计。\n\n4. **社区支持**：拥有活跃的开发者社区。`
    },
    {
      title: topic + '的应用场景',
      content: `${topic}在以下场景中表现尤为突出：\n\n- Web应用开发\n- 移动应用后端\n- 微服务架构\n- 实时数据处理`
    },
    {
      title: '最佳实践',
      content: `在使用${topic}时，建议遵循以下最佳实践：\n\n1. **合理规划架构**\n\n2. **代码规范**\n\n3. **测试驱动**\n\n4. **持续集成**`
    },
    {
      title: '总结',
      content: `${topic}是一个值得深入学习和应用的技术。通过本文的介绍，相信您对${topic}有了更全面的了解。`
    }
  ];

  const intro = introductions[Math.floor(Math.random() * introductions.length)];
  let markdownContent = `# ${topic} - 深度解析与实战指南\n\n${intro}\n\n`;
  sections.forEach(section => {
    markdownContent += `## ${section.title}\n\n${section.content}\n\n`;
  });
  markdownContent += `> 💡 **提示**：本文由AI自动生成，内容仅供参考。\n\n---\n\n*欢迎分享您的看法！*`;
  return markdownContent;
}

function generateTags(topic) {
  const commonTags = ['技术分享', '教程', '最佳实践'];
  const topicTags = [topic, '开发'];
  if (topic.includes('React')) topicTags.push('前端');
  if (topic.includes('Python')) topicTags.push('后端');
  if (topic.includes('数据库')) topicTags.push('数据');
  return [...new Set([...commonTags, ...topicTags])];
}

function calculateReadTime(topic, length) {
  const baseTime = 5;
  const multiplier = { short: 0.5, medium: 1, long: 1.5 };
  return Math.round(baseTime * (multiplier[length] || 1));
}

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
