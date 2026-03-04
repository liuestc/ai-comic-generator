import rateLimit from 'express-rate-limit';

/**
 * 通用限流器 - 每分钟 100 次请求
 * 适用于大多数 API 端点
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  limit: 100, // 每分钟 100 次
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: '请求过于频繁，请稍后再试',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 60,
  },
  skip: (req) => {
    // 健康检查端点不限流
    return req.path === '/health' || req.path === '/';
  },
});

/**
 * 严格限流器 - 每分钟 20 次请求
 * 适用于 /generate 相关的高资源消耗端点
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  limit: 20, // 每分钟 20 次
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: '生成操作请求过于频繁，请稍后再试',
    code: 'GENERATE_LIMIT_EXCEEDED',
    retryAfter: 60,
    hint: '建议减少生成频率或等待一分钟后重试',
  },
  skip: (req) => {
    // 健康检查端点不限流
    return req.path === '/health' || req.path === '/';
  },
});

/**
 * 脚本生成限流器 - 每分钟 15 次
 * 仅用于脚本生成端点
 */
export const scriptLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: '脚本生成请求过于频繁，请稍后再试',
    code: 'SCRIPT_LIMIT_EXCEEDED',
    retryAfter: 60,
  },
});

/**
 * 图片生成限流器 - 每分钟 10 次
 * 仅用于图片生成端点（最耗费资源）
 */
export const imageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: '图片生成请求过于频繁，请稍后再试',
    code: 'IMAGE_LIMIT_EXCEEDED',
    retryAfter: 60,
    hint: '图片生成是资源密集型操作，建议降低请求频率',
  },
});
