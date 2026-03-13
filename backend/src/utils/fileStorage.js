const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../../data/articles.json');

// 确保数据目录存在
async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// 读取文章数据
async function getArticles() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回默认的示例文章
    const defaultArticles = [
      {
        _id: '1',
        title: 'React Hooks 最佳实践指南',
        excerpt: '深入探讨React Hooks的使用技巧和最佳实践，帮助你写出更优雅的React代码。',
        content: '# React Hooks 最佳实践指南\n\nReact Hooks是React 16.8引入的新特性，它让你在不编写class的情况下使用state以及其他的React特性。\n\n## useState Hook\n\nuseState是最常用的Hook，用于在函数组件中添加state。\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n## useEffect Hook\n\neffect Hook可以让你在函数组件中执行副作用操作。\n\n```jsx\nuseEffect(() => {\n  document.title = `You clicked ${count} times`;\n}, [count]);\n```',
        author: '张三',
        date: '2024-01-15',
        tags: ['React', '前端', 'Hooks'],
        readTime: '8 分钟',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
      },
      {
        _id: '2',
        title: 'TypeScript 高级类型系统解析',
        excerpt: '全面解析TypeScript的高级类型特性，包括泛型、条件类型、映射类型等。',
        content: '# TypeScript 高级类型系统解析\n\nTypeScript提供了强大的类型系统，让我们可以编写更安全、更易维护的代码。\n\n## 泛型\n\n泛型允许我们创建可重用的组件。\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```\n\n## 条件类型\n\n条件类型让我们可以根据条件选择类型。\n\n```typescript\ntype NonNullable<T> = T extends null | undefined ? never : T;\n```',
        author: '李四',
        date: '2024-01-20',
        tags: ['TypeScript', '前端', '类型系统'],
        readTime: '12 分钟',
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString()
      },
      {
        _id: '3',
        title: 'Node.js 性能优化实战',
        excerpt: '分享Node.js应用性能优化的实战经验和技巧。',
        content: '# Node.js 性能优化实战\n\nNode.js应用的性能优化是每个开发者都需要关注的问题。\n\n## 1. 使用异步操作\n\n避免阻塞事件循环。\n\n```javascript\n// 好的做法\nfs.readFile(\'file.txt\', (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});\n```\n\n## 2. 使用缓存\n\n合理使用缓存可以大大提升性能。\n\n```javascript\nconst cache = new Map();\n\nfunction getData(key) {\n  if (cache.has(key)) {\n    return cache.get(key);\n  }\n  const data = fetchDataFromDB(key);\n  cache.set(key, data);\n  return data;\n}\n```',
        author: '王五',
        date: '2024-01-25',
        tags: ['Node.js', '后端', '性能优化'],
        readTime: '10 分钟',
        createdAt: new Date('2024-01-25').toISOString(),
        updatedAt: new Date('2024-01-25').toISOString()
      },
      {
        _id: '4',
        title: 'Docker 容器化部署指南',
        excerpt: '从零开始学习Docker容器化技术，掌握现代化的部署方案。',
        content: '# Docker 容器化部署指南\n\nDocker已经成为现代软件开发中不可或缺的工具。\n\n## Dockerfile 基础\n\n```dockerfile\nFROM node:16\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```\n\n## 常用命令\n\n```bash\n# 构建镜像\ndocker build -t myapp .\n\n# 运行容器\ndocker run -p 3000:3000 myapp\n\n# 查看日志\ndocker logs <container-id>\n```',
        author: '赵六',
        date: '2024-02-01',
        tags: ['Docker', 'DevOps', '容器化'],
        readTime: '15 分钟',
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-02-01').toISOString()
      },
      {
        _id: '5',
        title: '微服务架构设计模式',
        excerpt: '深入探讨微服务架构的设计原则和常见模式。',
        content: '# 微服务架构设计模式\n\n微服务架构是一种将单一应用程序开发为一套小型服务的方法。\n\n## 微服务的优势\n\n- **独立部署**：每个服务可以独立部署和扩展\n- **技术多样性**：不同服务可以使用不同的技术栈\n- **容错性**：单个服务的故障不会影响整个系统\n- **团队自治**：小团队可以独立负责某个服务\n\n## 常见模式\n\n1. **API网关模式**：统一入口点\n2. **服务发现模式**：动态服务注册与发现\n3. **断路器模式**：防止级联失败\n4. **CQRS模式**：读写分离',
        author: '孙七',
        date: '2024-02-10',
        tags: ['微服务', '架构', '分布式'],
        readTime: '18 分钟',
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-02-10').toISOString()
      }
    ];

    // 保存默认数据
    await saveArticles(defaultArticles);
    return defaultArticles;
  }
}

// 保存文章数据
async function saveArticles(articles) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2), 'utf8');
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  getArticles,
  saveArticles,
  generateId
};
