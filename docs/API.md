# 对外 API 使用文档

用 API Key 免登录拉取指定邮箱的邮件，适合脚本自动获取验证码、集成到其他系统。

## 1. 启用 / 获取 API Key

登录后台 → **系统设置** → **对外 API** → 点「生成 API Key」。

- 生成后会显示完整 Key 和调用示例，点「复制」即可。
- 「重新生成」会让旧 Key **立即失效**；「停用」会关闭整个对外 API。
- Key 是明文存放在你自己的 D1 里，只有后台登录后能看到。

## 2. 接口

### 获取邮件列表

```
GET /api/external/emails
```

**鉴权**（二选一）：

- 请求头：`X-API-Key: <你的Key>`
- 或查询参数：`?key=<你的Key>`

**参数**：

| 参数 | 必填 | 说明 |
|------|:----:|------|
| `email` | ✅ | 要查询的邮箱地址（必须是后台已添加的账号） |
| `folder` | ❌ | `inbox`(默认) / `junkemail` / `deleteditems` / `all`（收件箱+垃圾箱合并） |
| `top` | ❌ | 返回条数，默认 10，最大 50 |
| `keyword` | ❌ | 搜索关键词 |

## 3. 调用示例

**浏览器 / curl（查询参数方式）**

```bash
curl "https://你的域名/api/external/emails?email=abc@outlook.com&key=你的Key&folder=all&top=5"
```

**请求头方式（更安全，Key 不出现在 URL / 日志里）**

```bash
curl "https://你的域名/api/external/emails?email=abc@outlook.com" \
  -H "X-API-Key: 你的Key"
```

**Python（取最新验证码的典型用法）**

```python
import re, requests

resp = requests.get(
    "https://你的域名/api/external/emails",
    params={"email": "abc@outlook.com", "folder": "all", "top": 5},
    headers={"X-API-Key": "你的Key"},
)
data = resp.json()
for mail in data["data"]["items"]:
    # 从主题或正文预览里提取 6 位数字验证码
    m = re.search(r"\b(\d{6})\b", mail["subject"] + " " + mail["bodyPreview"])
    if m:
        print("验证码:", m.group(1))
        break
```

## 4. 返回格式

成功（HTTP 200）：

```json
{
  "success": true,
  "data": {
    "email": "abc@outlook.com",
    "folder": "all",
    "count": 2,
    "items": [
      {
        "id": "AAQ...",
        "subject": "Your verification code is 123456",
        "from": { "name": "Microsoft", "address": "account@microsoft.com" },
        "receivedDateTime": "2026-06-08T08:00:00Z",
        "bodyPreview": "Use code 123456 to sign in...",
        "isRead": false
      }
    ]
  }
}
```

失败：

```json
{ "success": false, "error": { "code": "UNAUTHORIZED", "message": "API Key 无效" } }
```

## 5. 错误码

| HTTP | code | 含义 |
|:----:|------|------|
| 403 | `API_DISABLED` | 还没生成 API Key（去系统设置生成） |
| 401 | `UNAUTHORIZED` | Key 缺失或不正确 |
| 400 | `BAD_REQUEST` | 缺少 `email` 参数 |
| 404 | `NOT_FOUND` | 该邮箱不在后台账号列表里 |
| 400 | `DISABLED` | 该账号已被停用 |
| 502 | `TOKEN_FAILED` | 该账号 Token 失效，需在后台「重新授权」 |
| 502 | `GRAPH_ERROR` | 调用 Microsoft Graph 失败 |

## 6. 安全建议

- Key 等同于这些邮箱的读取权限，**不要写进前端代码或公开仓库**；优先用 `X-API-Key` 请求头而非 URL 参数（URL 会进日志/历史记录）。
- 怀疑泄露时，到系统设置点「重新生成」即可让旧 Key 立即作废。
- 接口只能读取**后台已添加**的邮箱，无法访问任意邮箱。
