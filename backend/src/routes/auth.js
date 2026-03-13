const router = require('express').Router();

// 模拟用户数据库
const users = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际应用中应该使用加密密码
    name: '管理员'
  }
];

// 登录接口
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证用户名和密码
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成简单的 token（实际应用中应该使用 JWT）
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

// 验证 token 中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供认证令牌'
    });
  }

  // 简单的 token 验证（实际应用中应该验证 JWT）
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');

    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: '无效的认证令牌'
    });
  }
}

module.exports = router;
module.exports.authenticateToken = authenticateToken;
