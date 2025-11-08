'use strict';

const OpenApi = require('@alicloud/openapi-client');
const CredentialHelper = require('./CredentialHelper');
const config = require('../config/config');

/**
 * 阿里云客户端工具类
 */
class AliyunClient {
  /**
   * 创建阿里云 OpenAPI 客户端
   * @param {Object} options 配置选项
   * @param {String} options.endpoint 服务端点
   * @param {String} options.accessKeyId 访问密钥ID（可选，优先使用环境变量）
   * @param {String} options.accessKeySecret 访问密钥Secret（可选，优先使用环境变量）
   * @returns {Object} OpenAPI 客户端实例
   */
  static createClient(options = {}) {
    // 获取凭据（支持环境变量、配置文件等多种方式）
    const credential = CredentialHelper.getCredential({
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
    });

    const clientConfig = new OpenApi.Config({
      credential: credential,
    });
    
    // 设置端点
    clientConfig.endpoint = options.endpoint || config.aliyun.endpoint;
    
    return new OpenApi.default(clientConfig);
  }

  /**
   * 创建 API 请求参数
   * @param {Object} options API 配置选项
   * @param {String} options.action 接口名称
   * @param {String} options.version 接口版本
   * @param {String} options.protocol 接口协议 (默认: HTTPS)
   * @param {String} options.method 接口 HTTP 方法 (默认: POST)
   * @param {String} options.authType 认证类型 (默认: AK)
   * @param {String} options.style 接口风格 (默认: RPC)
   * @param {String} options.pathname 接口 PATH (默认: /)
   * @param {String} options.reqBodyType 请求体内容格式 (默认: formData)
   * @param {String} options.bodyType 响应体内容格式 (默认: json)
   * @returns {Object} API 参数对象
   */
  static createApiParams(options = {}) {
    const params = new OpenApi.Params({
      // 接口名称
      action: options.action || 'SingleSendMail',
      // 接口版本
      version: options.version || config.aliyun.apiVersion,
      // 接口协议
      protocol: options.protocol || 'HTTPS',
      // 接口 HTTP 方法
      method: options.method || 'POST',
      authType: options.authType || 'AK',
      style: options.style || 'RPC',
      // 接口 PATH
      pathname: options.pathname || '/',
      // 接口请求体内容格式
      reqBodyType: options.reqBodyType || 'formData',
      // 接口响应体内容格式
      bodyType: options.bodyType || 'json',
    });
    
    return params;
  }

  /**
   * 创建运行时选项
   * @param {Object} options 运行时配置选项
   * @returns {Object} 运行时选项对象
   */
  static createRuntimeOptions(options = {}) {
    const Util = require('@alicloud/tea-util');
    return new Util.RuntimeOptions(options);
  }
}

module.exports = AliyunClient;

