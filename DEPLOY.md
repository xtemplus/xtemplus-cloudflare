# Cloudflare Workers 部署指南

## 前置要求

1. 安装 Wrangler CLI（如果还没有安装）：
```bash
npm install -g wrangler
# 或使用最新版本
npm install --save-dev wrangler@4
```

2. 登录 Cloudflare：
```bash
npx wrangler login
```

## 配置凭据

### 方式1: 使用 Wrangler Secrets（推荐，更安全）

```bash
# 设置阿里云访问密钥ID
npx wrangler secret put ALIYUN_ACCESS_KEY_ID

# 设置阿里云访问密钥Secret
npx wrangler secret put ALIYUN_ACCESS_KEY_SECRET

# 设置发件人邮箱账号（可选）
npx wrangler secret put ALIYUN_ACCOUNT_NAME
```

### 方式2: 使用 wrangler.toml 中的 vars（不推荐用于敏感信息）

编辑 `wrangler.toml` 文件，在 `[vars]` 部分添加配置：

```toml
[vars]
ALIYUN_ACCOUNT_NAME = "system@email.hupei.fun"
```

**注意**: 敏感信息（如 AccessKey）应该使用 `wrangler secret` 命令设置，而不是直接写在配置文件中。

## 部署

### 部署到生产环境

```bash
npx wrangler deploy
```

### 部署到预览环境

```bash
npx wrangler deploy --env preview
```

### 本地测试

```bash
npx wrangler dev
```

## 使用

部署成功后，你的 Worker 将有一个类似这样的 URL：
```
https://xtemplus-cloudflare.your-subdomain.workers.dev
```

### 发送邮件

访问以下 URL 即可发送邮件：
```
https://xtemplus-cloudflare.your-subdomain.workers.dev/mail
```

### 自定义邮件内容

通过查询参数自定义：
```
https://xtemplus-cloudflare.your-subdomain.workers.dev/mail?to=recipient@example.com&subject=测试邮件&body=邮件内容
```

**支持的参数：**
- `to` - 收件人地址（默认：ishupei@qq.com）
- `subject` - 邮件主题（默认：系统通知）
- `body` - 邮件内容
- `htmlBody` - HTML 邮件内容
- `textBody` - 纯文本邮件内容
- `fromAlias` - 发件人别名

## 故障排除

### 错误：无法导入 Node.js 模块

确保 `wrangler.toml` 中的 `main` 字段指向 `worker.js` 而不是 `server.js`。

### 错误：凭据未配置

确保已使用 `wrangler secret put` 命令设置了必要的环境变量。

### 更新 Wrangler

如果遇到版本警告，更新到最新版本：
```bash
npm install --save-dev wrangler@latest
```

