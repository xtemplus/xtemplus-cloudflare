// src/services/WorkerEmailService.js - 简化版本
import WorkerAliyunClient from '../utils/WorkerAliyunClient.js';

export default class WorkerEmailService {
    constructor(env = {}) {
        this.client = new WorkerAliyunClient();
        this.env = env;
    }

    async sendEmail(emailData) {
        // 验证凭据
        if (!this.env.ALIYUN_ACCESS_KEY_ID || !this.env.ALIYUN_ACCESS_KEY_SECRET) {
            throw new Error('阿里云凭据未配置，请检查环境变量');
        }

        const credentials = {
            accessKeyId: this.env.ALIYUN_ACCESS_KEY_ID,
            accessKeySecret: this.env.ALIYUN_ACCESS_KEY_SECRET,
            accountName: this.env.ALIYUN_ACCOUNT_NAME || 'system@email.hupei.fun'
        };

        // 参照官方示例设置默认值
        const mailParams = {
            toAddress: emailData.toAddress,
            subject: emailData.subject || '系统通知',
            htmlBody: emailData.htmlBody || '<h1>这是一封自动发送的邮件</h1>',
            textBody: emailData.textBody || '这是一封自动发送的邮件',
            fromAlias: emailData.fromAlias || null,
            accountName: credentials.accountName,
            tagName: 'system-login'
        };

        console.log('发送邮件参数:', mailParams);

        try {
            const result = await this.client.sendEmail(credentials, mailParams);

            return {
                success: true,
                messageId: result.RequestId,
                data: result
            };

        } catch (error) {
            console.error('邮件发送详细错误:', error);
            throw new Error(`邮件发送失败: ${error.message}`);
        }
    }
}