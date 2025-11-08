'use strict';

const Credential = require('@alicloud/credentials');
const fs = require('fs');
const path = require('path');

/**
 * 凭据辅助工具类
 */
class CredentialHelper {
  /**
   * 获取凭据配置
   * 优先级：环境变量 > 本地配置文件 > 默认配置
   * @param {Object} options 配置选项
   * @returns {Object} 凭据对象
   */
  static getCredential(options = {}) {
    // 方式1: 从环境变量获取（优先级最高）
    const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || 
                       process.env.ALICLOUD_ACCESS_KEY_ID ||
                       options.accessKeyId;
    const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET || 
                           process.env.ALICLOUD_ACCESS_KEY_SECRET ||
                           options.accessKeySecret;

    // 如果提供了 accessKeyId 和 accessKeySecret，直接使用
    if (accessKeyId && accessKeySecret) {
      return new Credential.default({
        type: 'access_key',
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
      });
    }

    // 方式2: 尝试从本地配置文件读取
    try {
      const configPath = path.join(process.cwd(), 'credentials.json');
      if (fs.existsSync(configPath)) {
        const credentials = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (credentials.accessKeyId && credentials.accessKeySecret) {
          return new Credential.default({
            type: 'access_key',
            accessKeyId: credentials.accessKeyId,
            accessKeySecret: credentials.accessKeySecret,
          });
        }
      }
    } catch (error) {
      console.warn('读取本地凭据配置文件失败:', error.message);
    }

    // 方式3: 使用默认凭据提供者链（包括环境变量、CLI配置、ECS元数据等）
    try {
      return new Credential.default();
    } catch (error) {
      throw new Error(
        '无法获取阿里云凭据。请通过以下方式之一配置凭据：\n' +
        '1. 设置环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID 和 ALIBABA_CLOUD_ACCESS_KEY_SECRET\n' +
        '2. 在项目根目录创建 credentials.json 文件\n' +
        '3. 配置阿里云 CLI\n' +
        '错误详情: ' + error.message
      );
    }
  }

  /**
   * 检查凭据是否已配置
   * @returns {Boolean} 是否已配置凭据
   */
  static hasCredentials() {
    return !!(process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || 
              process.env.ALICLOUD_ACCESS_KEY_ID ||
              (() => {
                try {
                  const configPath = path.join(process.cwd(), 'credentials.json');
                  return fs.existsSync(configPath);
                } catch {
                  return false;
                }
              })());
  }
}

module.exports = CredentialHelper;

