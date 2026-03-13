import { useState, useEffect, useRef, useCallback } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
  category?: string;
  coverImage?: string;
  visible?: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => Promise<void>;
  onCancel: () => void;
}

// ── 输入框通用样式 ──
const inputCls = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [content, setContent] = useState(article?.content || '');
  const [author, setAuthor] = useState(article?.author || '技术博主');
  const [tags, setTags] = useState(article?.tags?.join(', ') || '');
  const [readTime, setReadTime] = useState<number>(parseInt(String(article?.readTime)) || 5);
  const [category, setCategory] = useState(article?.category || '');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [categories, setCategories] = useState<Category[]>([]);

  // 上传/提交状态
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);

  // 链接插入弹窗
  const [linkDialog, setLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // 字体颜色弹窗
  const [colorDialog, setColorDialog] = useState(false);
  const [pickedColor, setPickedColor] = useState('#e53e3e');

  // 表格插入弹窗
  const [tableDialog, setTableDialog] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // 加载分类
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // 自动计算阅读时间
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    setReadTime(Math.max(1, Math.round(words / 200)));
  }, [content]);

  // ── 上传图片到编辑器 ──
  const uploadImageToEditor = useCallback(async (file: File): Promise<string | null> => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('image', file);
    try {
      setUploading(true);
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
      const data = await res.json();
      if (data.url) return data.url;
      setUploadError('上传失败');
      return null;
    } catch {
      setUploadError('网络错误');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  // ── 上传封面图 ──
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageToEditor(file);
    if (url) setCoverImage(url);
    e.target.value = '';
  };

  // ── 自定义工具栏命令 ──

  // 上传图片命令
  const uploadImageCmd = {
    name: 'upload-image',
    keyCommand: 'uploadImage',
    buttonProps: { 'aria-label': '上传图片', title: '上传图片' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    execute: () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const url = await uploadImageToEditor(file);
        if (url) {
          const mdImage = `\n![${file.name}](${url})\n`;
          setContent(prev => prev + mdImage);
        }
      };
      input.click();
    }
  };

  // 插入链接命令
  const insertLinkCmd = {
    name: 'insert-link',
    keyCommand: 'insertLink',
    buttonProps: { 'aria-label': '插入链接', title: '插入链接' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    execute: () => {
      setLinkText('');
      setLinkUrl('https://');
      setLinkDialog(true);
    }
  };

  // 字体颜色命令
  const colorCmd = {
    name: 'font-color',
    keyCommand: 'fontColor',
    buttonProps: { 'aria-label': '字体颜色', title: '字体颜色' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 7 4 4 20 4 20 7"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
    execute: () => setColorDialog(true)
  };

  // 插入表格命令
  const tableCmd = {
    name: 'insert-table',
    keyCommand: 'insertTable',
    buttonProps: { 'aria-label': '插入表格', title: '插入表格' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
      </svg>
    ),
    execute: () => {
      setTableRows(3);
      setTableCols(3);
      setTableDialog(true);
    }
  };

  // 插入提示块命令
  const calloutCmd = {
    name: 'callout',
    keyCommand: 'callout',
    buttonProps: { 'aria-label': '插入提示块', title: '插入提示块' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    execute: (_state: unknown, api: { replaceSelection: (text: string) => void }) => {
      api.replaceSelection('\n> 💡 **提示**：在这里写提示内容\n');
    }
  };

  // 插入代码块命令（带语言选择）
  const codeBlockCmd = {
    name: 'code-block',
    keyCommand: 'codeBlock',
    buttonProps: { 'aria-label': '插入代码块', title: '插入代码块' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    execute: (_state: unknown, api: { replaceSelection: (text: string) => void }) => {
      api.replaceSelection('\n```javascript\n// 代码内容\n```\n');
    }
  };

  // ── 确认插入链接 ──
  const confirmLink = () => {
    if (linkUrl) {
      const md = `[${linkText || linkUrl}](${linkUrl})`;
      setContent(prev => prev + md);
    }
    setLinkDialog(false);
  };

  // ── 确认插入颜色文字 ──
  const confirmColor = () => {
    const md = `<span style="color:${pickedColor}">彩色文字</span>`;
    setContent(prev => prev + md);
    setColorDialog(false);
  };

  // ── 确认插入表格 ──
  const confirmTable = () => {
    const header = '| ' + Array(tableCols).fill('列标题').join(' | ') + ' |';
    const divider = '| ' + Array(tableCols).fill('---').join(' | ') + ' |';
    const rows = Array(tableRows).fill('| ' + Array(tableCols).fill('单元格').join(' | ') + ' |');
    const md = '\n' + [header, divider, ...rows].join('\n') + '\n';
    setContent(prev => prev + md);
    setTableDialog(false);
  };

  // ── 提交 ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setUploadError('');
    try {
      await onSave({
        _id: article?._id || '',
        title,
        excerpt,
        content,
        author,
        date: article?.date || new Date().toISOString().split('T')[0],
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        readTime: readTime.toString(),
        category,
        coverImage,
        visible: article?.visible !== false
      });
    } catch {
      setUploadError('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const PRESET_COLORS = ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#3182ce', '#805ad5', '#d53f8c', '#1a202c'];

  return (
    <div className="max-w-5xl" data-color-mode="auto">
      {/* 链接插入弹窗 */}
      {linkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold">插入链接</h3>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">链接文字</label>
              <input className={inputCls} value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="显示文字（可留空）" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">链接地址</label>
              <input className={inputCls} value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={confirmLink} className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">插入</button>
              <button onClick={() => setLinkDialog(false)} className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 字体颜色弹窗 */}
      {colorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold">字体颜色</h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setPickedColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${pickedColor === c ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input type="color" value={pickedColor} onChange={e => setPickedColor(e.target.value)} className="h-10 w-16 cursor-pointer rounded border border-gray-200 dark:border-gray-700" />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{pickedColor}</span>
              <span className="ml-auto text-sm font-semibold" style={{ color: pickedColor }}>预览文字</span>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={confirmColor} className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">插入</button>
              <button onClick={() => setColorDialog(false)} className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* 表格插入弹窗 */}
      {tableDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-72 rounded-xl bg-white dark:bg-gray-900 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-semibold">插入表格</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">行数</label>
                <input type="number" min={1} max={20} value={tableRows} onChange={e => setTableRows(+e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">列数</label>
                <input type="number" min={1} max={10} value={tableCols} onChange={e => setTableCols(+e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={confirmTable} className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">插入</button>
              <button onClick={() => setTableDialog(false)} className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">取消</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="mb-2 block text-sm font-semibold">文章标题 <span className="text-red-500">*</span></label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="请输入文章标题" required />
        </div>

        {/* 封面图 */}
        <div>
          <label className="mb-2 block text-sm font-semibold">封面图片</label>
          <div className="flex gap-3 items-start">
            <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} className={inputCls} placeholder="输入图片链接，或点击右侧上传" />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {uploading ? '上传中...' : '上传图片'}
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>
          {coverImage && (
            <div className="mt-3 relative inline-block">
              <img src={coverImage} alt="封面预览" className="h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
              <button type="button" onClick={() => setCoverImage('')} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600">×</button>
            </div>
          )}
          {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
        </div>

        {/* 摘要 */}
        <div>
          <label className="mb-2 block text-sm font-semibold">文章摘要 <span className="text-red-500">*</span></label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className={inputCls} placeholder="简短描述文章内容，显示在文章卡片上" required />
        </div>

        {/* 富文本编辑器 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold">文章内容 <span className="text-red-500">*</span></label>
            <span className="text-xs text-gray-400">支持 Markdown · 约 {readTime} 分钟阅读</span>
          </div>
          {uploading && (
            <div className="mb-2 flex items-center gap-2 text-xs text-blue-600">
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              图片上传中...
            </div>
          )}
          <MDEditor
            value={content}
            onChange={v => setContent(v || '')}
            height={500}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.hr,
              commands.divider,
              commands.title1,
              commands.title2,
              commands.title3,
              commands.divider,
              uploadImageCmd,
              insertLinkCmd,
              commands.quote,
              codeBlockCmd,
              tableCmd,
              commands.divider,
              colorCmd,
              calloutCmd,
              commands.divider,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.checkedListCommand,
            ]}
            extraCommands={[
              commands.codeEdit,
              commands.codeLive,
              commands.codePreview,
              commands.divider,
              commands.fullscreen
            ]}
            preview="live"
            style={{ borderRadius: '8px', overflow: 'hidden' }}
          />
        </div>

        {/* 分类、作者、阅读时间 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">文章分类</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
              <option value="">— 不选分类 —</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">作者</label>
            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">阅读时间（分钟）</label>
            <input type="number" min={1} value={readTime} onChange={e => setReadTime(+e.target.value || 1)} className={inputCls} />
          </div>
        </div>

        {/* 标签 */}
        <div>
          <label className="mb-2 block text-sm font-semibold">标签（逗号分隔）</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={inputCls} placeholder="JavaScript, React, 前端开发" />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? '保存中...' : '保存文章'}
          </button>
          <button type="button" onClick={onCancel} disabled={submitting} className="rounded-lg border border-gray-200 dark:border-gray-700 px-8 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
