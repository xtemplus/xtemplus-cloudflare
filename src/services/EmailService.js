'use strict';

const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Console = require('@alicloud/tea-console');
const AliyunClient = require('../utils/AliyunClient');
const config = require('../config/config');

/**
 * 邮件服务类
 */
class EmailService {
  constructor(options = {}) {
    // 创建阿里云客户端
    this.client = AliyunClient.createClient({
      endpoint: options.endpoint || config.aliyun.endpoint,
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
    });
    
    // 邮件服务配置
    this.emailConfig = {
      accountName: options.accountName || config.email.defaultAccountName,
      addressType: options.addressType || config.email.defaultAddressType,
      tagName: options.tagName || config.email.defaultTagName,
      replyToAddress: options.replyToAddress !== undefined 
        ? options.replyToAddress 
        : config.email.defaultReplyToAddress,
    };
  }

  /**
   * 发送邮件
   * @param {Object} emailData 邮件数据
   * @param {String} emailData.toAddress 收件人地址
   * @param {String} emailData.subject 邮件主题
   * @param {String} emailData.htmlBody HTML 邮件内容
   * @param {String} emailData.textBody 纯文本邮件内容
   * @param {String} emailData.fromAlias 发件人别名
   * @param {String} emailData.accountName 发件人邮箱账号（可选，默认使用配置）
   * @param {Number} emailData.addressType 地址类型（可选，默认使用配置）
   * @param {String} emailData.tagName 标签名（可选，默认使用配置）
   * @param {Boolean} emailData.replyToAddress 是否回复地址（可选，默认使用配置）
   * @returns {Promise<Object>} API 响应结果
   */
  async sendEmail(emailData) {
    try {
      // 创建 API 参数
      const params = AliyunClient.createApiParams({
        action: 'SingleSendMail',
      });

      // 构建请求体
      const body = {
        AccountName: emailData.accountName || this.emailConfig.accountName,
        AddressType: emailData.addressType !== undefined 
          ? emailData.addressType 
          : this.emailConfig.addressType,
        TagName: emailData.tagName || this.emailConfig.tagName,
        ReplyToAddress: emailData.replyToAddress !== undefined 
          ? emailData.replyToAddress 
          : this.emailConfig.replyToAddress,
        ToAddress: emailData.toAddress,
        Subject: emailData.subject,
        HtmlBody: emailData.htmlBody || '',
        TextBody: emailData.textBody || '',
        FromAlias: emailData.fromAlias || null,
      };

      // 创建运行时选项
      const runtime = AliyunClient.createRuntimeOptions();

      // 创建请求对象
      const request = new OpenApi.OpenApiRequest({
        body: body,
      });

      // 调用 API
      const resp = await this.client.callApi(params, request, runtime);
      
      return resp;
    } catch (error) {
      Console.default.error('发送邮件失败:', error);
      throw error;
    }
  }

  /**
   * 发送简单文本邮件
   * @param {String} toAddress 收件人地址
   * @param {String} subject 邮件主题
   * @param {String} content 邮件内容
   * @returns {Promise<Object>} API 响应结果
   */
  async sendTextEmail(toAddress, subject, content) {
    return this.sendEmail({
      toAddress,
      subject,
      textBody: content,
    });
  }

  /**
   * 发送 HTML 邮件
   * @param {String} toAddress 收件人地址
   * @param {String} subject 邮件主题
   * @param {String} htmlContent HTML 内容
   * @param {String} textContent 纯文本内容（可选，作为备选）
   * @returns {Promise<Object>} API 响应结果
   */
  async sendHtmlEmail(toAddress, subject, htmlContent, textContent = '') {
    return this.sendEmail({
      toAddress,
      subject,
      htmlBody: htmlContent,
      textBody: textContent,
    });
  }
}

module.exports = EmailService;

