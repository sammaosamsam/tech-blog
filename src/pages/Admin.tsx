import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleListManager from '../components/ArticleListManager';
import ArticleEditor from '../components/ArticleEditor';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
  visible?: boolean;
  category?: string;
  coverImage?: string;
}

interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  siteUrl: string;
  footerText: string;
}

type AdminTab = 'articles' | 'new' | 'edit' | 'settings' | 'account' | 'api' | 'categories';

// ── 消息提示组件 ────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-5 py-3 shadow-lg text-sm font-medium text-white transition-all ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {type === 'success' ? (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  );
}

// ── 站点设置面板 ────────────────────────────────────────────
function SettingsPanel() {
  const [form, setForm] = useState<SiteSettings>({ siteTitle: '', siteSubtitle: '', siteUrl: '', footerText: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: '站点设置已保存', type: 'success' });
      } else {
        setToast({ message: data.error || '保存失败', type: 'error' });
      }
    } catch {
      setToast({ message: '网络错误，请重试', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">加载中...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h2 className="mb-1 text-lg font-semibold">站点基本信息</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">设置博客的标题、副标题和访问地址</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">站点标题</label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={e => setForm(f => ({ ...f, siteTitle: e.target.value }))}
              placeholder="例如：技术博客"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">显示在导航栏和浏览器标签页中</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">站点副标题</label>
            <input
              type="text"
              value={form.siteSubtitle}
              onChange={e => setForm(f => ({ ...f, siteSubtitle: e.target.value }))}
              placeholder="例如：分享编程知识，探索技术前沿"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">显示在首页标题下方</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">站点地址（URL）</label>
            <input
              type="url"
              value={form.siteUrl}
              onChange={e => setForm(f => ({ ...f, siteUrl: e.target.value }))}
              placeholder="例如：http://192.168.1.60:5000"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">用于生成文章分享链接等场景</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">页脚版权文字</label>
            <input
              type="text"
              value={form.footerText}
              onChange={e => setForm(f => ({ ...f, footerText: e.target.value }))}
              placeholder="例如：© 2024 电脑技术博客. All rights reserved."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">显示在网站底部，可自定义版权年份和名称</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
}

// ── 账号安全面板 ────────────────────────────────────────────
function AccountPanel() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', newUsername: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    setForm(f => ({ ...f, name: user.name || '', newUsername: user.username || '' }));
  }, []);

  const handleSave = async () => {
    if (!form.currentPassword) {
      setToast({ message: '请输入当前密码', type: 'error' });
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setToast({ message: '两次新密码不一致', type: 'error' });
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setToast({ message: '新密码至少需要 6 位', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload: Record<string, string> = { currentPassword: form.currentPassword };
      if (form.name) payload.name = form.name;
      if (form.newUsername) payload.newUsername = form.newUsername;
      if (form.newPassword) payload.newPassword = form.newPassword;

      const res = await fetch('/api/auth/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: '账号信息已更新，请重新登录', type: 'success' });
        // 更新后重新登录
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }, 1500);
      } else {
        setToast({ message: data.message || data.error || '保存失败', type: 'error' });
      }
    } catch {
      setToast({ message: '网络错误，请重试', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h2 className="mb-1 text-lg font-semibold">账号安全设置</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">修改管理员用户名、显示名称和登录密码</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">显示名称</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="管理员"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">登录用户名</label>
            <input
              type="text"
              value={form.newUsername}
              onChange={e => setForm(f => ({ ...f, newUsername: e.target.value }))}
              placeholder="admin"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">修改密码（不修改则留空）</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  当前密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="输入当前密码以验证身份"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">新密码</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  placeholder="留空则不修改密码"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">确认新密码</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="再次输入新密码"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {saving ? '保存中...' : '保存账号设置'}
        </button>
      </div>
    </div>
  );
}

// ── 分类管理面板 ────────────────────────────────────────────
function CategoryPanel() {
  interface Category { id: string; name: string; description: string; color: string; createdAt: string; }
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', color: '#3b82f6' });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const PRESET = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#6b7280'];

  const load = async () => {
    try {
      const r = await fetch('/api/categories');
      setCats(await r.json());
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) { setToast({ message: '分类名称不能为空', type: 'error' }); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = editId ? `/api/categories/${editId}` : '/api/categories';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      if (res.ok) {
        setToast({ message: editId ? '分类已更新' : '分类已创建', type: 'success' });
        setForm({ name: '', description: '', color: '#3b82f6' });
        setEditId(null);
        load();
      } else { setToast({ message: '操作失败', type: 'error' }); }
    } catch { setToast({ message: '网络错误', type: 'error' }); }
    finally { setSaving(false); }
  };

  const handleEdit = (c: Category) => {
    setEditId(c.id);
    setForm({ name: c.name, description: c.description || '', color: c.color });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除此分类？')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { setToast({ message: '分类已删除', type: 'success' }); load(); }
    else setToast({ message: '删除失败', type: 'error' });
  };

  if (loading) return <div className="py-12 text-center text-gray-500">加载中...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 新建 / 编辑表单 */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
        <h3 className="mb-4 text-sm font-semibold">{editId ? '编辑分类' : '新建分类'}</h3>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">分类名称 *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="例如：前端开发"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">分类描述</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="简短描述"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">分类颜色</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                className="h-7 w-10 cursor-pointer rounded border border-gray-200 dark:border-gray-700" title="自定义颜色" />
              <span className="text-xs font-mono text-gray-500">{form.color}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? '保存中...' : editId ? '更新分类' : '创建分类'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ name: '', description: '', color: '#3b82f6' }); }}
                className="rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                取消编辑
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 分类列表 */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">已有分类（{cats.length}）</h3>
        {cats.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 py-8 text-center text-sm text-gray-400">
            暂无分类，请先创建
          </div>
        ) : (
          <div className="space-y-2">
            {cats.map(c => (
              <div key={c.id} className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{c.name}</span>
                  {c.description && <span className="ml-2 text-xs text-gray-400 truncate">{c.description}</span>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(c)}
                    className="rounded-md px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="rounded-md px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── API 接口文档面板 ─────────────────────────────────────────
function ApiPanel() {
  const [siteUrl, setSiteUrl] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setSiteUrl(data.siteUrl || window.location.origin))
      .catch(() => setSiteUrl(window.location.origin));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const apis = [
    {
      group: '公开接口（无需认证）',
      items: [
        {
          method: 'GET',
          path: '/api/settings',
          desc: '获取站点基本设置（标题、副标题、站点地址）',
          example: `curl ${siteUrl}/api/settings`
        },
        {
          method: 'GET',
          path: '/api/articles',
          desc: '获取文章列表（仅返回已显示的文章）',
          example: `curl ${siteUrl}/api/articles`
        },
        {
          method: 'GET',
          path: '/api/articles/:id',
          desc: '获取单篇文章详情',
          example: `curl ${siteUrl}/api/articles/文章ID`
        },
        {
          method: 'GET',
          path: '/health',
          desc: '健康检查，返回服务运行状态',
          example: `curl ${siteUrl}/health`
        }
      ]
    },
    {
      group: '认证接口',
      items: [
        {
          method: 'POST',
          path: '/api/auth/login',
          desc: '管理员登录，返回 token',
          example: `curl -X POST ${siteUrl}/api/auth/login \\\n  -H "Content-Type: application/json" \\\n  -d '{"username":"admin","password":"admin123"}'`
        }
      ]
    },
    {
      group: '管理接口（需要 Authorization: Bearer <token>）',
      items: [
        {
          method: 'GET',
          path: '/api/articles',
          desc: '获取全部文章（含隐藏文章），需携带有效 token',
          example: `curl ${siteUrl}/api/articles \\\n  -H "Authorization: Bearer <token>"`
        },
        {
          method: 'POST',
          path: '/api/articles',
          desc: '创建新文章',
          example: `curl -X POST ${siteUrl}/api/articles \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '{"title":"文章标题","content":"内容","author":"作者","tags":["标签"]}'`
        },
        {
          method: 'PUT',
          path: '/api/articles/:id',
          desc: '更新文章内容',
          example: `curl -X PUT ${siteUrl}/api/articles/文章ID \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '{"title":"新标题"}'`
        },
        {
          method: 'PATCH',
          path: '/api/articles/:id/visibility',
          desc: '切换文章显示/隐藏状态',
          example: `curl -X PATCH ${siteUrl}/api/articles/文章ID/visibility \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '{"visible":false}'`
        },
        {
          method: 'DELETE',
          path: '/api/articles/:id',
          desc: '删除文章',
          example: `curl -X DELETE ${siteUrl}/api/articles/文章ID \\\n  -H "Authorization: Bearer <token>"`
        },
        {
          method: 'PUT',
          path: '/api/settings',
          desc: '更新站点设置',
          example: `curl -X PUT ${siteUrl}/api/settings \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '{"siteTitle":"我的博客","siteSubtitle":"副标题"}'`
        },
        {
          method: 'PUT',
          path: '/api/auth/account',
          desc: '修改管理员账号信息',
          example: `curl -X PUT ${siteUrl}/api/auth/account \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '{"currentPassword":"admin123","newPassword":"newpass123"}'`
        },
        {
          method: 'POST',
          path: '/api/generate',
          desc: 'AI 生成文章内容',
          example: `curl -X POST ${siteUrl}/api/generate \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '{"topic":"Docker部署","length":"medium"}'`
        }
      ]
    }
  ];

  const methodColor = (method: string) => {
    const map: Record<string, string> = {
      GET: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      POST: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
      PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
      PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    };
    return map[method] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="mb-1 text-lg font-semibold">API 接口文档</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          基础地址：<code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs font-mono">{siteUrl}</code>
        </p>
      </div>

      {apis.map(group => (
        <div key={group.group}>
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
            {group.group}
          </h3>
          <div className="space-y-3">
            {group.items.map((api, i) => {
              const key = `${group.group}-${i}`;
              return (
                <div key={key} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900">
                    <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold font-mono ${methodColor(api.method)}`}>
                      {api.method}
                    </span>
                    <code className="flex-1 text-sm font-mono text-gray-800 dark:text-gray-200">{api.path}</code>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{api.desc}</p>
                    <div className="relative">
                      <pre className="rounded bg-gray-900 dark:bg-gray-950 text-gray-100 p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {api.example}
                      </pre>
                      <button
                        onClick={() => handleCopy(api.example, key)}
                        className="absolute top-2 right-2 rounded bg-gray-700 hover:bg-gray-600 px-2 py-1 text-xs text-gray-300 transition-colors"
                      >
                        {copied === key ? '已复制' : '复制'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 主组件 ──────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/articles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('获取文章失败');
      setAllArticles(await response.json());
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSave = async (article: Article) => {
    try {
      const token = localStorage.getItem('token');
      const isEdit = Boolean(article._id);
      const url = isEdit ? `/api/articles/${article._id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(article)
      });
      if (!res.ok) throw new Error();
      showToast(isEdit ? '文章更新成功' : '文章创建成功');
      setActiveTab('articles');
      setEditingArticle(undefined);
      fetchArticles();
    } catch {
      showToast('保存失败，请重试', 'error');
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('edit');
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('文章已删除');
      fetchArticles();
    } catch {
      showToast('删除失败，请重试', 'error');
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/articles/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visible })
      });
      const data = await res.json();
      if (data.success) {
        showToast(visible ? '文章已设为显示' : '文章已设为隐藏');
        fetchArticles();
      } else {
        showToast('操作失败', 'error');
      }
    } catch {
      showToast('操作失败，请重试', 'error');
    }
  };

  const handleCancel = () => {
    setEditingArticle(undefined);
    setActiveTab('articles');
  };

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'articles',
      label: `文章管理 (${allArticles.length})`,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      key: 'new',
      label: '新建文章',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      key: 'categories',
      label: '分类管理',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      key: 'settings',
      label: '站点设置',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      key: 'account',
      label: '账号安全',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      key: 'api',
      label: 'API 接口',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-gray-500">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 顶部标题栏 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">后台管理</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            欢迎回来，{user.name || '管理员'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            前台首页
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>
      </div>

      {/* 侧边栏 + 内容区 */}
      <div className="flex gap-6">
        {/* 侧边导航 */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.filter(t => t.key !== 'edit').map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key !== 'edit') setEditingArticle(undefined);
                }}
                className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                  activeTab === tab.key || (activeTab === 'edit' && tab.key === 'articles')
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          {activeTab === 'articles' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">文章管理</h2>
                <button
                  onClick={() => { setActiveTab('new'); setEditingArticle(undefined); }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  新建文章
                </button>
              </div>
              <ArticleListManager
                articles={allArticles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            </div>
          )}

          {(activeTab === 'new' || activeTab === 'edit') && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {activeTab === 'new' ? '新建文章' : '编辑文章'}
              </h2>
              <ArticleEditor
                article={editingArticle}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}

          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'account' && <AccountPanel />}
          {activeTab === 'categories' && <CategoryPanel />}
          {activeTab === 'api' && <ApiPanel />}
        </main>
      </div>
    </div>
  );
}
