const fs = require('fs').promises;
const path = require('path');

const CATEGORY_FILE = path.join(__dirname, '../../../data/categories.json');

async function ensureDataDir() {
  const dir = path.dirname(CATEGORY_FILE);
  try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); }
}

const DEFAULT_CATEGORIES = [
  { id: 'tech', name: '技术分享', description: '编程技术相关文章', color: '#3b82f6', createdAt: new Date().toISOString() },
  { id: 'tutorial', name: '教程指南', description: '入门和进阶教程', color: '#10b981', createdAt: new Date().toISOString() },
  { id: 'devops', name: 'DevOps', description: '运维部署相关', color: '#f59e0b', createdAt: new Date().toISOString() },
  { id: 'other', name: '其他', description: '其他类型文章', color: '#6b7280', createdAt: new Date().toISOString() }
];

async function getCategories() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CATEGORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    await saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
}

async function saveCategories(categories) {
  await ensureDataDir();
  await fs.writeFile(CATEGORY_FILE, JSON.stringify(categories, null, 2), 'utf8');
  return categories;
}

function generateCategoryId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

module.exports = { getCategories, saveCategories, generateCategoryId };
