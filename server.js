const http = require('http');
const url = require('url');
const EmailService = require('./src/services/EmailService');

// 创建邮件服务实例
const emailService = new EmailService();

/**
 * 发送响应
 * @param {Object} res HTTP 响应对象
 * @param {Number} statusCode 状态码
 * @param {Object} data 响应数据
 */
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * 处理邮件发送
 * @param {Object} req HTTP 请求对象
 * @param {Object} res HTTP 响应对象
 */
async function handleMailRequest(req, res) {
  try {
    // 解析 URL 查询参数
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    // 从查询参数或默认配置中获取邮件信息
    const emailData = {
      toAddress: query.to || 'ishupei@qq.com',
      subject: query.subject || '系统通知',
      htmlBody: query.htmlBody || query.body || '<h1>这是一封自动发送的邮件</h1><p>您访问了 /mail 接口</p>',
      textBody: query.textBody || query.body || '这是一封自动发送的邮件\n您访问了 /mail 接口',
      fromAlias: query.fromAlias || null,
    };

    // 发送邮件
    const resp = await emailService.sendEmail(emailData);

    // 返回成功响应
    sendResponse(res, 200, {
      success: true,
      message: '邮件发送成功',
      data: resp
    });

    console.log(`邮件发送成功: ${emailData.toAddress} - ${emailData.subject}`);
  } catch (error) {
    // 返回错误响应
    sendResponse(res, 500, {
      success: false,
      message: '邮件发送失败',
      error: error.message || error.toString()
    });

    console.error('邮件发送失败:', error);
  }
}

/**
 * 处理其他请求
 * @param {Object} res HTTP 响应对象
 */
function handleOtherRequest(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('hello');
}

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  // 处理 /mail 路径
  if (pathname === '/mail') {
    await handleMailRequest(req, res);
  } else {
    // 其他路径返回 hello
    handleOtherRequest(res);
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`访问 http://localhost:${PORT}/mail 可自动发送邮件`);
});

