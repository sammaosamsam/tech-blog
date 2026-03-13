const router = require('express').Router();
const { getAccount } = require('../utils/settingsStorage');

// 登录接口（router 版本，供将来路由拆分使用）
router.post('/login', async (req, res) => {
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

// 验证 token 中间件
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }

  try {
    const account = await getAccount();
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    if (userId !== account.id) {
      return res.status(403).json({ success: false, message: '无效的认证令牌' });
    }

    req.user = account;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: '无效的认证令牌' });
  }
}

module.exports = router;
module.exports.authenticateToken = authenticateToken;
