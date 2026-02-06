# Agent可视化系统使用指南

## 概述

AI漫画生成器现已集成完整的Agent可视化系统，让用户能够实时感知AI的思考、决策和优化过程。系统包含**Director Agent（导演智能体）**和**Critic Agent（评论家智能体）**的双智能体协作机制。

## 功能特性

### 1. 🧠 AI导演的思考过程（ThinkingProcess组件）

展示AI导演在创作前的完整思维链推理过程，包括：

#### 1.1 核心冲突分析
- **主角**：故事的主要角色
- **目标**：主角想要达成的目标
- **障碍**：阻碍主角实现目标的因素
- **赌注**：失败的后果或成功的意义

#### 1.2 故事结构选择
- **结构类型**：起承转合、三幕式、问题-解决等
- **分格数量**：4格、6格、8格等
- **选择理由**：为什么选择这种结构

#### 1.3 角色设计
- **名字**：角色的名称
- **性格**：多个性格标签（如：勇敢、好奇、幽默）
- **外貌**：详细的外貌描述
- **动机**：角色的内在驱动力
- **恐惧**：角色害怕的事物

#### 1.4 镜头语言规划
每一格的镜头设计：
- **景别**：特写、近景、中景、远景、全景
- **机位**：平视、俯视、仰视、侧面等
- **选择理由**：为什么使用这种镜头
- **视觉重点**：这一格要突出什么

#### 1.5 色彩基调
- **整体色调**：暖色调、冷色调、中性色调
- **情绪表达**：色彩传达的情感
- **选择理由**：为什么选择这种色彩

### 2. ⭐ AI评论家的多维度评分（ScoreRadar组件）

展示AI评论家对生成漫画的专业评价，包含5个维度：

#### 评分维度
1. **角色一致性**（Character Consistency）
   - 角色外貌、性格、行为是否前后一致
   - 评分范围：0-10分

2. **镜头语言**（Shot Language）
   - 景别和机位的选择是否专业
   - 镜头切换是否流畅
   - 评分范围：0-10分

3. **情感冲击**（Emotional Impact）
   - 故事是否能打动人心
   - 情感表达是否到位
   - 评分范围：0-10分

4. **对话质量**（Dialogue Quality）
   - 对话是否自然、有趣
   - 是否符合角色性格
   - 评分范围：0-10分

5. **视觉冲击**（Visual Impact）
   - 画面构图是否吸引人
   - 视觉效果是否震撼
   - 评分范围：0-10分

#### 评分等级
- **9.0-10.0分**：优秀（绿色）
- **8.0-8.9分**：良好（蓝色）
- **7.0-7.9分**：中等（黄色）
- **<7.0分**：需改进（红色）

#### 总分计算
- 5个维度的平均分
- 目标分数：8.0分（可配置）

### 3. 📈 迭代优化历史（IterationTimeline组件）

展示AI导演和评论家的协作迭代过程：

#### 迭代流程
1. **第1次迭代**
   - 导演生成初始脚本
   - 评论家评分和提出建议
   - 记录分数和改进点

2. **第2次迭代**
   - 导演根据反馈优化脚本
   - 评论家再次评分
   - 对比分数变化

3. **第N次迭代**
   - 持续优化直到达到目标分数
   - 或达到最大迭代次数

#### 显示内容
- **迭代编号**：第几次迭代
- **分数**：本次迭代的总分
- **达标状态**：是否达到目标分数（✓ 达标）
- **改进点**：本次迭代相比上次的改进
- **分数趋势**：上升/下降的箭头和数值

### 4. 🔄 实时进度推送（SSE）

使用Server-Sent Events技术实时推送Agent状态：

#### 推送事件类型
- `stateChange`：Agent状态变化
- `directorThought`：导演开始思考
- `directorScriptGenerated`：脚本生成完成
- `directorReviewed`：自我审查完成
- `directorOptimized`：脚本优化完成
- `criticAnalyzed`：评论家分析完成
- `criticScored`：评分完成
- `criticCritiqued`：评论完成
- `iterationStart`：新迭代开始
- `iterationComplete`：迭代完成
- `targetReached`：达到目标分数

#### 进度显示
- **当前步骤**：正在执行的操作
- **进度百分比**：0-100%
- **进度条**：可视化进度

## 使用方法

### 前端界面

#### 1. 访问Agent模式
```
打开应用 → 点击顶部"AI智能体"标签页
```

#### 2. 输入创意
```
在输入框中输入你的创意，例如：
"一只猫咪学会了使用手机，开始给主人发消息"
```

#### 3. 配置参数（可选）
- **最大迭代次数**：默认3次
- **目标分数**：默认8.0分

#### 4. 开始创作
```
点击"开始AI创作"按钮
```

#### 5. 观察过程
- 实时查看AI导演的思考过程
- 查看每次迭代的评分
- 追踪改进历史

#### 6. 获取结果
- 创作完成后显示最终结果
- 可以查看完整漫画
- 可以下载或分享

### API调用

#### 1. 创建Agent任务
```bash
curl -X POST http://localhost:3001/api/agent/create-comic \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "一只猫咪学会了使用手机",
    "maxIterations": 3,
    "targetScore": 8.0
  }'
```

响应：
```json
{
  "success": true,
  "taskId": "task_1770350000000_abc123",
  "message": "Agent开始创作，请使用taskId查询进度"
}
```

#### 2. 查询任务状态
```bash
curl http://localhost:3001/api/agent/status/{taskId}
```

响应：
```json
{
  "success": true,
  "taskId": "task_1770350000000_abc123",
  "status": "running",
  "agentState": {
    "status": "generating",
    "currentStep": "第1次迭代：生成脚本...",
    "progress": 20
  }
}
```

#### 3. 监听实时事件（SSE）
```javascript
const eventSource = new EventSource(`/api/agent/events/${taskId}`);

eventSource.addEventListener('message', (e) => {
  const event = JSON.parse(e.data);
  
  switch (event.type) {
    case 'directorThought':
      console.log('导演思考:', event.data);
      break;
    case 'criticScored':
      console.log('评分:', event.data);
      break;
    case 'iterationComplete':
      console.log('迭代完成:', event.data);
      break;
  }
});
```

## 技术架构

### 前端组件

```
AgentMode.tsx (主界面)
├── ThinkingProcess.tsx (思考过程)
├── ScoreRadar.tsx (评分雷达)
└── IterationTimeline.tsx (迭代历史)
```

### 后端架构

```
AgentOrchestrator (协调器)
├── DirectorAgent (导演)
│   ├── think() - 思维链推理
│   ├── generateScript() - 生成脚本
│   ├── selfReview() - 自我审查
│   └── optimize() - 优化脚本
└── CriticAgent (评论家)
    ├── analyzeComic() - 多模态分析
    ├── scoreComic() - 多维度评分
    └── provideFeedback() - 提供建议
```

### 事件流

```
用户输入创意
    ↓
AgentOrchestrator.createComic()
    ↓
┌─────────────────────────┐
│  第1次迭代              │
├─────────────────────────┤
│ 1. Director.think()     │ → directorThought
│ 2. Director.generate()  │ → directorScriptGenerated
│ 3. Director.review()    │ → directorReviewed
│ 4. Critic.analyze()     │ → criticAnalyzed
│ 5. Critic.score()       │ → criticScored
│ 6. Critic.critique()    │ → criticCritiqued
└─────────────────────────┘
    ↓
评分 < 目标分数？
    ↓ 是
┌─────────────────────────┐
│  第2次迭代              │
├─────────────────────────┤
│ 1. 整合反馈             │
│ 2. Director.optimize()  │ → directorOptimized
│ 3. Critic重新评分       │
└─────────────────────────┘
    ↓
达到目标分数或最大迭代次数
    ↓
返回最终结果
```

## 配置说明

### 环境变量

```bash
# .env文件
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key  # 备用

# Agent配置
AGENT_MAX_ITERATIONS=3    # 最大迭代次数
AGENT_TARGET_SCORE=8.0    # 目标分数
```

### 模型配置

```typescript
// DirectorAgent
model: 'gemini-2.0-flash'  // 文本生成

// CriticAgent
model: 'gemini-2.0-flash'  // 多模态分析
```

## 性能指标

### 时间消耗
- **思考过程**：约5-10秒
- **脚本生成**：约10-15秒
- **图片生成**：约60-90秒
- **评分分析**：约10-15秒
- **单次迭代总计**：约85-130秒
- **完整流程（3次迭代）**：约4-7分钟

### API调用
- **Director.think()**：1次API调用
- **Director.generateScript()**：1次API调用
- **Director.selfReview()**：1次API调用
- **Director.optimize()**：1次API调用（如需）
- **Critic.analyzeComic()**：1次API调用（包含图片）
- **Critic.scoreComic()**：1次API调用
- **单次迭代总计**：4-5次API调用
- **完整流程（3次迭代）**：12-15次API调用

### 成本估算（基于Gemini 2.0 Flash）
- **文本生成**：$0.075 / 1M tokens (输入), $0.30 / 1M tokens (输出)
- **图片分析**：$0.00025 / image
- **单次迭代成本**：约$0.01-0.02
- **完整流程成本**：约$0.03-0.06

## 最佳实践

### 1. 创意输入
- **具体明确**：描述清楚主角、目标、冲突
- **适度简洁**：不要过于复杂，4格漫画适合简单故事
- **情感明确**：说明想要表达的情感（搞笑、感动、惊悚等）

**好的示例**：
```
一只猫咪学会了使用手机，开始给主人发各种搞笑的消息，
最后主人发现猫咪是在求救——它被困在洗衣机里了。
```

**不好的示例**：
```
猫
```

### 2. 参数调优
- **快速测试**：maxIterations=1, targetScore=7.0
- **标准质量**：maxIterations=3, targetScore=8.0
- **高质量**：maxIterations=5, targetScore=9.0

### 3. 监控优化
- 实时查看思考过程，了解AI的创作思路
- 关注评分的5个维度，识别薄弱环节
- 追踪迭代历史，观察改进效果

### 4. 结果处理
- 达到目标分数后，可以直接使用
- 未达到目标但接近时（如7.8分），也可以接受
- 如果分数持续低于7.0，考虑调整创意输入

## 故障排查

### 问题1：页面看不到"AI智能体"标签页
**原因**：浏览器缓存
**解决**：
```bash
# 清除浏览器缓存
Ctrl+Shift+Delete (Chrome/Edge)
Cmd+Shift+Delete (Mac)

# 或者硬刷新
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### 问题2：SSE连接失败
**原因**：代理或防火墙阻止
**解决**：
```bash
# 检查后端日志
tail -f backend/logs/app.log

# 测试SSE端点
curl -N http://localhost:3001/api/agent/events/{taskId}
```

### 问题3：Agent创作超时
**原因**：API调用失败或网络问题
**解决**：
```bash
# 检查API密钥
echo $GOOGLE_API_KEY

# 测试API连接
curl -X POST http://localhost:3001/api/agent/test \
  -H "Content-Type: application/json" \
  -d '{"idea": "测试"}'
```

### 问题4：评分异常低
**原因**：创意输入不清晰或模型理解偏差
**解决**：
- 重新描述创意，更加具体
- 增加情感和冲突的描述
- 查看思考过程，了解AI的理解

## 未来优化

### 短期（1-2周）
1. ✅ 完善可视化组件的动画效果
2. ✅ 添加评分详情的悬浮提示
3. ✅ 支持导出迭代历史报告
4. ✅ 优化SSE重连机制

### 中期（1-2月）
1. 🔄 支持更多Agent类型（艺术指导、编辑等）
2. 🔄 实现Agent并行工作
3. 🔄 添加用户反馈机制
4. 🔄 支持自定义评分权重

### 长期（3-6月）
1. 📋 Agent学习和进化机制
2. 📋 多语言支持
3. 📋 Agent协作可视化
4. 📋 社区Agent市场

## 总结

Agent可视化系统让AI创作过程变得透明和可控，用户可以：

1. **理解AI的思考**：看到AI如何分析创意、设计角色、规划镜头
2. **监控创作质量**：实时查看多维度评分，确保输出质量
3. **追踪优化过程**：观察每次迭代的改进，了解AI如何自我优化
4. **参与创作决策**：根据可视化信息，调整输入或参数

这个系统不仅提升了用户体验，也为AI创作的可解释性和可控性提供了范例。

---

**文档版本**：v1.0  
**最后更新**：2026-02-06  
**维护者**：AI Comic Generator Team
