// worker.js - Cloudflare Workers 入口文件
import WorkerEmailService from './src/services/WorkerEmailService.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 处理 /mail 路径
    if (pathname === '/mail') {
      try {
        // 创建邮件服务实例
        const emailService = new WorkerEmailService(env);

        // 解析查询参数
        const params = url.searchParams;
        const emailData = {
          toAddress: params.get('to') || 'ishupei@qq.com',
          subject: params.get('subject') || '系统通知',
          htmlBody: params.get('htmlBody') || params.get('body') || '<h1>这是一封自动发送的邮件</h1><p>您访问了 /mail 接口</p>',
          textBody: params.get('textBody') || params.get('body') || '这是一封自动发送的邮件\n您访问了 /mail 接口',
          fromAlias: params.get('fromAlias') || null,
        };

        // 发送邮件
        const result = await emailService.sendEmail(emailData);

        // 返回成功响应
        return new Response(JSON.stringify({
          success: true,
          message: '邮件发送成功',
          data: result,
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        // 返回错误响应
        return new Response(JSON.stringify({
          success: false,
          message: '邮件发送失败',
          error: error.message || error.toString(),
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // 其他路径返回 hello
    return new Response('hello', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  },
};

