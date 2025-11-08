'use strict';

const EmailService = require('./services/EmailService');
const Console = require('@alicloud/tea-console');
const Util = require('@alicloud/tea-util');

/**
 * 主函数
 * @param {Array} args 命令行参数
 */
async function main(args) {
  try {
    // 创建邮件服务实例
    const emailService = new EmailService({
      // 可以在这里覆盖默认配置
      // accountName: 'custom@email.hupei.fun',
      // tagName: 'custom-tag',
    });

    // 发送邮件示例
    const emailData = {
      toAddress: 'ishupei@qq.com',
      subject: '11',
      htmlBody: '1112',
      textBody: '1212',
      fromAlias: null,
    };

    // 调用发送邮件方法
    const resp = await emailService.sendEmail(emailData);
    
    // 打印响应结果
    Console.default.log('邮件发送成功:');
    Console.default.log(Util.default.toJSONString(resp));
    
    return resp;
  } catch (error) {
    Console.default.error('执行失败:', error);
    throw error;
  }
}

// 如果直接运行此文件，则执行主函数
if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };

