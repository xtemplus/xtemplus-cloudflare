// server.js - Cloudflare Worker 版本
import EmailService from './src/services/EmailService.js';

// 创建邮件服务实例
const emailService = new EmailService();

/**
 * 发送响应
 * @param {Object} data 响应数据
 * @param {Number} statusCode 状态码
 */
function createResponse(data, statusCode = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

/**
 * 处理邮件发送
 * @param {URL} url URL 对象
 */
async function handleMailRequest(url) {
  try {
    // 获取查询参数
    const params = url.searchParams;
    
    const emailData = {
      toAddress: params.get('to') || 'ishupei@qq.com',
      subject: params.get('subject') || '系统通知',
      htmlBody: params.get('htmlBody') || params.get('body') || '<h1>这是一封自动发送的邮件</h1><p>您访问了 /mail 接口</p>',
      textBody: params.get('textBody') || params.get('body') || '这是一封自动发送的邮件\n您访问了 /mail 接口',
      fromAlias: params.get('fromAlias') || null,
    };

    // 发送邮件
    const resp = await emailService.sendEmail(emailData);

    console.log(`邮件发送成功: ${emailData.toAddress} - ${emailData.subject}`);

    return createResponse({
      success: true,
      message: '邮件发送成功',
      data: resp
    });

  } catch (error) {
    console.error('邮件发送失败:', error);
    
    return createResponse({
      success: false,
      message: '邮件发送失败',
      error: error.message || error.toString()
    }, 500);
  }
}

/**
 * 处理 OPTIONS 请求（CORS 预检）
 */
function handleOptionsRequest() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Cloudflare Worker 入口点
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleOptionsRequest();
    }

    // 处理 /mail 路径
    if (pathname === '/mail') {
      return handleMailRequest(url);
    }

    // 其他路径返回 hello
    return new Response('hello', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};