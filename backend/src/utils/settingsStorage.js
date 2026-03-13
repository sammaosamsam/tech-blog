const fs = require('fs').promises;
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../../../data/settings.json');
const ACCOUNT_FILE = path.join(__dirname, '../../../data/account.json');

async function ensureDataDir() {
  const dir = path.dirname(SETTINGS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// ── 站点设置 ──────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  siteTitle: '技术博客',
  siteSubtitle: '分享编程知识，探索技术前沿',
  siteUrl: 'http://localhost:5000',
  updatedAt: new Date().toISOString()
};

async function getSettings() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    await saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings) {
  await ensureDataDir();
  const data = { ...settings, updatedAt: new Date().toISOString() };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

// ── 管理员账号 ────────────────────────────────────────────
const DEFAULT_ACCOUNT = {
  id: '1',
  username: 'admin',
  password: 'admin123',
  name: '管理员',
  updatedAt: new Date().toISOString()
};

async function getAccount() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ACCOUNT_FILE, 'utf8');
    return { ...DEFAULT_ACCOUNT, ...JSON.parse(data) };
  } catch {
    await saveAccount(DEFAULT_ACCOUNT);
    return DEFAULT_ACCOUNT;
  }
}

async function saveAccount(account) {
  await ensureDataDir();
  const data = { ...account, updatedAt: new Date().toISOString() };
  await fs.writeFile(ACCOUNT_FILE, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

module.exports = {
  getSettings,
  saveSettings,
  getAccount,
  saveAccount
};
