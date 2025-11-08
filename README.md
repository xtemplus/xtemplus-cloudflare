# 阿里云邮件服务项目

一个简单的 Node.js 服务器，集成阿里云邮件服务，支持通过 HTTP 接口发送邮件。

## 功能特性

- 📧 集成阿里云邮件服务
- 🌐 HTTP 接口自动发送邮件
- 🔐 支持多种凭据配置方式
- 📦 模块化设计，易于扩展

## 安装

```bash
npm install
```

## 配置凭据

### 方式1: 环境变量（推荐）

设置以下环境变量：

```bash
# Windows PowerShell
$env:ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
$env:ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"

# Windows CMD
set ALIBABA_CLOUD_ACCESS_KEY_ID=your-access-key-id
set ALIBABA_CLOUD_ACCESS_KEY_SECRET=your-access-key-secret

# Linux/Mac
export ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
```

### 方式2: 本地配置文件

1. 复制 `credentials.json.example` 为 `credentials.json`
2. 填写你的阿里云访问密钥：

```json
{
  "accessKeyId": "your-access-key-id",
  "accessKeySecret": "your-access-key-secret"
}
```

**注意：** `credentials.json` 文件已添加到 `.gitignore`，不会被提交到版本控制。

### 方式3: 阿里云 CLI 配置

如果你已经配置了阿里云 CLI，可以直接使用：

```bash
aliyun configure
```

## 使用方法

### 启动服务器

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 发送邮件

#### 基本用法

访问 `/mail` 接口即可自动发送邮件：

```
http://localhost:3000/mail
```

#### 自定义邮件内容

通过查询参数自定义邮件：

```
http://localhost:3000/mail?to=recipient@example.com&subject=测试邮件&body=邮件内容
```

**支持的参数：**
- `to` - 收件人地址（默认：ishupei@qq.com）
- `subject` - 邮件主题（默认：系统通知）
- `body` - 邮件内容
- `htmlBody` - HTML 邮件内容
- `textBody` - 纯文本邮件内容
- `fromAlias` - 发件人别名

### 运行客户端

```bash
npm run client
```

## 项目结构

```
.
├── src/
│   ├── client.js              # 主入口文件
│   ├── config/
│   │   └── config.js          # 配置文件
│   ├── services/
│   │   └── EmailService.js    # 邮件服务类
│   └── utils/
│       ├── AliyunClient.js    # 阿里云客户端工具类
│       └── CredentialHelper.js # 凭据辅助工具类
├── server.js                  # HTTP 服务器
├── credentials.json.example   # 凭据配置示例文件
└── package.json
```

## 获取阿里云访问密钥

1. 登录 [阿里云控制台](https://home.console.aliyun.com/)
2. 进入 [访问控制（RAM）](https://ram.console.aliyun.com/)
3. 创建用户并获取 AccessKey ID 和 AccessKey Secret
4. 为用户授权邮件服务相关权限

## 注意事项

- 请妥善保管你的访问密钥，不要提交到版本控制系统
- 生产环境建议使用环境变量或更安全的凭据管理方式
- 确保你的阿里云账号已开通邮件服务并完成相关配置

## License

ISC

