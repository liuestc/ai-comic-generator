# API 文档

本文档详细介绍 AI Comic Generator 的后端 API 接口。

## 基础信息

- **基础 URL**: `http://localhost:3000/api`
- **认证方式**: API Key (通过 `GEMINI_API_KEY` 环境变量配置)
- **默认端口**: 3000

---

## 接口列表

### 1. 生成漫画脚本

**端点**: `POST /generate-script`

生成一个新的漫画脚本，包括角色设定和四格分镜。

**请求体**:
```json
{
  "topic": "一只会说话的猫"  // 创意主题
}
```

**响应**:
```json
{
  "success": true,
  "script": {
    "id": "script_xxx",
    "topic": "一只会说话的猫",
    "characterDesign": "一只橘色的胖猫...",
    "characterImageUrl": "https://...",
    "panels": [
      {
        "id": 1,
        "scene": "场景描述",
        "dialogue": "对话内容",
        "shotType": "medium_shot",
        "cameraAngle": "eye_level"
      }
      // ... 4个分镜
    ],
    "status": "completed"
  }
}
```

---

### 2. 获取脚本详情

**端点**: `GET /script/:scriptId`

根据 ID 获取脚本详情。

**路径参数**:
- `scriptId`: 脚本 ID

**响应**:
```json
{
  "success": true,
  "script": { ... }
}
```

---

### 3. 更新脚本

**端点**: `PUT /script/:scriptId`

更新脚本的分镜内容（场景描述、对话等）。

**请求体**:
```json
{
  "panels": [
    {
      "id": 1,
      "scene": "新的场景描述",
      "dialogue": "新的对话"
    }
  ]
}
```

---

### 4. 生成图像

**端点**: `POST /generate-images`

根据脚本生成四格漫画图像。

**请求体**:
```json
{
  "script": {
    "id": "script_xxx",
    "characterDesign": "...",
    "characterImageUrl": "https://...",
    "panels": [...]
  }
}
```

**响应**:
```json
{
  "success": true,
  "script": {
    // 更新后的脚本，包含 imageUrl
    "panels": [
      {
        "id": 1,
        "imageUrl": "https://...",
        "bubbleImageUrl": "https://..."
      }
    ]
  }
}
```

---

### 5. 重新生成单个分镜

**端点**: `POST /regenerate-panel/:panelId`

重新生成指定分镜的图像。

**路径参数**:
- `panelId`: 分镜 ID (1-4)

**请求体**:
```json
{
  "scriptId": "script_xxx"
}
```

---

### 6. 获取历史记录

**端点**: `GET /history`

获取用户的历史脚本列表。

**查询参数**:
- `limit`: 返回数量限制 (默认 20)
- `offset`: 偏移量 (默认 0)

---

### 7. 删除脚本

**端点**: `DELETE /script/:scriptId`

删除指定脚本。

---

### 8. 搜索脚本

**端点**: `GET /search`

根据关键词搜索脚本。

**查询参数**:
- `keyword`: 搜索关键词

---

## Agent 模式 API

### 9. 启动 Agent 优化

**端点**: `POST /agent/optimize`

使用 Multi-Agent 系统优化脚本。

**请求体**:
```json
{
  "topic": "创意主题",
  "maxIterations": 5,
  "targetScore": 8.0
}
```

**响应**:
```json
{
  "success": true,
  "result": {
    "success": true,
    "script": { ... },
    "critique": {
      "overallScore": 8.5,
      "dimensions": {
        "characterConsistency": 9.0,
        "shotLanguage": 8.0,
        "emotionalImpact": 8.5,
        "dialogueQuality": 8.0,
        "visualImpact": 8.5
      }
    },
    "iterations": 3,
    "history": [...]
  }
}
```

---

### 10. 获取 Agent 状态

**端点**: `GET /agent/status`

获取当前 Agent 运行状态。

---

### 11. 获取思维过程

**端点**: `GET /agent/thoughts/:sessionId`

获取 Agent 的思维过程详情。

---

## 响应状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

---

## 错误响应格式

```json
{
  "success": false,
  "error": "错误信息描述"
}
```