'use strict';

/**
 * 配置文件
 */
module.exports = {
  // 阿里云邮件服务配置
  aliyun: {
    // Endpoint 请参考 https://api.aliyun.com/product/Dm
    endpoint: 'dm.aliyuncs.com',
    // 接口版本
    apiVersion: '2015-11-23',
  },
  // 邮件服务配置
  email: {
    // 默认发件人邮箱
    defaultAccountName: 'system@email.hupei.fun',
    // 默认地址类型
    defaultAddressType: 1,
    // 默认标签名
    defaultTagName: 'system-login',
    // 默认回复地址
    defaultReplyToAddress: true,
  },
};

