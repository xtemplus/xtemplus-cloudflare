// src/utils/WorkerAliyunClient.js - 修复签名问题
export default class WorkerAliyunClient {
    constructor() {
        this.endpoint = 'https://dm.aliyuncs.com';
        this.version = '2015-11-23';
    }

    async sendEmail(credentials, emailData) {
        try {
            // 基础参数
            const params = {
                Action: 'SingleSendMail',
                Version: this.version,
                Format: 'JSON',
                AccessKeyId: credentials.accessKeyId,
                SignatureMethod: 'HMAC-SHA1',
                SignatureVersion: '1.0',
                SignatureNonce: Date.now() + Math.random().toString(36).substring(2, 10),
                Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
            };

            // 邮件参数
            const mailParams = {
                AccountName: credentials.accountName || emailData.accountName || 'system@email.hupei.fun',
                AddressType: '1',
                ReplyToAddress: 'false',
                ToAddress: emailData.toAddress,
                Subject: emailData.subject,
                HtmlBody: emailData.htmlBody || '',
                TextBody: emailData.textBody || '',
            };

            // 可选参数
            if (emailData.fromAlias) mailParams.FromAlias = emailData.fromAlias;
            if (emailData.tagName) mailParams.TagName = emailData.tagName;

            // 合并参数
            const allParams = { ...params, ...mailParams };

            // 生成签名查询字符串
            const queryString = await this.buildQueryString(allParams, credentials.accessKeySecret);
            const url = `${this.endpoint}/?${queryString}`;

            console.log('请求URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const result = await response.json();

            if (result.Code) {
                throw new Error(`${result.Code}: ${result.Message}`);
            }

            return result;

        } catch (error) {
            console.error('邮件发送失败:', error);
            throw error;
        }
    }

    async buildQueryString(params, accessKeySecret) {
        // 1. 参数排序（按字典序）
        const sortedKeys = Object.keys(params).sort();

        // 2. 构建规范化查询字符串（对参数名和值分别进行 URL 编码）
        const canonicalizedQueryString = sortedKeys
            .map(key => {
                const value = params[key];
                if (value === null || value === undefined || value === '') {
                    return null;
                }
                // 对参数名和值分别进行 URL 编码
                return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
            })
            .filter(Boolean)
            .join('&');

        console.log('规范化查询字符串:', canonicalizedQueryString);

        // 3. 构建待签名字符串
        // 格式: HTTPMethod + "&" + percentEncode("/") + "&" + percentEncode(CanonicalizedQueryString)
        // 注意：需要对规范化查询字符串再次进行编码
        const stringToSign = `POST&%2F&${encodeURIComponent(canonicalizedQueryString)}`;
        console.log('待签名字符串:', stringToSign);

        // 4. 生成签名
        const signature = await this.generateSignature(stringToSign, accessKeySecret);
        console.log('生成签名:', signature);

        // 5. 返回完整查询字符串（包含签名）
        // 注意：规范化查询字符串已经编码，直接使用即可
        return `${canonicalizedQueryString}&Signature=${encodeURIComponent(signature)}`;
    }

    async generateSignature(stringToSign, accessKeySecret) {
        try {
            // 使用正确的签名密钥格式
            const secret = accessKeySecret + '&';

            const key = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(secret),
                { name: 'HMAC', hash: 'SHA-1' },
                false,
                ['sign']
            );

            const signatureBuffer = await crypto.subtle.sign(
                'HMAC',
                key,
                new TextEncoder().encode(stringToSign)
            );

            // 转换为 base64
            const signatureArray = new Uint8Array(signatureBuffer);
            let binary = '';
            for (let i = 0; i < signatureArray.length; i++) {
                binary += String.fromCharCode(signatureArray[i]);
            }

            return btoa(binary);

        } catch (error) {
            throw new Error('签名生成失败: ' + error.message);
        }
    }
}