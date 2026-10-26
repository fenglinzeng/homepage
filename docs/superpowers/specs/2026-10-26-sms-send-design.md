# 短信发送接口设计

## 目标

新增 `POST /sms/send`，接收 `msg` 和 `telephone`，通过阿里云 Dysmsapi 发送短信。接口必须使用 `x-sms-token` 鉴权，阿里云凭据只从运行时环境变量读取。

## 接口约定

- 请求头：`x-sms-token`，服务端与 `SMS_SEND_TOKEN` 比较。
- 请求体：`{ "msg": "123456", "telephone": "17600119277" }`。
- `msg` 映射到短信模板参数 `code`；`SMS_TEMPLATE_PARAM` 中的其他静态参数保留。
- 成功响应只返回发送状态和必要的请求标识，不返回 AccessKey、完整 SDK 响应或模板凭据。
- 缺少/错误鉴权返回 `401`；输入错误返回 `400`；阿里云配置或调用失败返回 `502`。

## 方案选择

- 公开接口：实现少，但任何人都能消耗短信额度，排除。
- 复用 BWH token：减少环境变量，但会耦合无关业务，排除。
- 独立 `SMS_SEND_TOKEN`：调用方增加一个请求头，但边界清晰、改动最小，采用。

## 非目标

- 不在本次工作中增加验证码存储、发送频率限制、短信模板管理或多手机号批量发送。
- 不把用户提供的 AccessKey、SecretKey 或真实 token 写入源码、`.env.example` 或 Git。

## 涉及文件

- `server/utils/aliyun-sms.ts`：阿里云客户端、环境变量读取和发送逻辑。
- `server/routes/sms/send.post.ts`：鉴权、请求体校验和 HTTP 响应。
- `package.json`、`pnpm-lock.yaml`：阿里云 SMS SDK 依赖。
- `.env.example`、`README.md`：配置和调用说明。
