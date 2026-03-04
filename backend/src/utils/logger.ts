import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 日志目录
const logDir = path.join(process.cwd(), 'logs');

// 请求追踪 ID 存储
const requestIds = new Map<string, number>();

/**
 * 创建自定义格式化器
 * 包含颜色支持、请求追踪 ID
 */
const customFormat = winston.format.printf(({ level, message, timestamp, requestId, ...meta }) => {
  const reqId = requestId ? `[${requestId}] ` : '';
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level.toUpperCase()}] ${reqId}${message}${metaStr}`;
});

/**
 * 控制台格式化（带颜色）
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  customFormat
);

/**
 * 文件格式化（无颜色）
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  customFormat
);

/**
 * 自定义 logger 类型，添加 success 方法
 */
type LoggerType = winston.Logger & {
  success: (message: string, ...meta: any[]) => void;
};

/**
 * 创建 Winston Logger 实例
 */
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-comic-generator' },
  transports: [
    // 错误日志单独文件
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
    // 所有日志
    new DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    }),
  ],
});

// 开发环境添加控制台输出
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug',
  }));
}

// 添加 success 方法
const logger: LoggerType = Object.assign(winstonLogger, {
  success: (message: string, ...meta: any[]) => {
    winstonLogger.info(`✅ ${message}`, ...meta);
  },
});

/**
 * 为请求生成唯一的追踪 ID
 */
export function generateRequestId(): string {
  const id = uuidv4().substring(0, 8);
  requestIds.set(id, Date.now());
  
  // 清理过期的请求 ID（超过 5 分钟）
  const now = Date.now();
  for (const [key, timestamp] of requestIds.entries()) {
    if (now - timestamp > 5 * 60 * 1000) {
      requestIds.delete(key);
    }
  }
  
  return id;
}

/**
 * 获取当前请求的追踪 ID（如果存在）
 */
export function getRequestId(reqId?: string): string | undefined {
  return reqId;
}

/**
 * 创建带有请求 ID 的子日志记录器
 */
export function createRequestLogger(requestId: string) {
  return {
    error: (message: string, meta?: any) => logger.error(message, { requestId, ...meta }),
    warn: (message: string, meta?: any) => logger.warn(message, { requestId, ...meta }),
    info: (message: string, meta?: any) => logger.info(message, { requestId, ...meta }),
    debug: (message: string, meta?: any) => logger.debug(message, { requestId, ...meta }),
    http: (message: string, meta?: any) => logger.http(message, { requestId, ...meta }),
    success: (message: string, meta?: any) => logger.success(message, { requestId, ...meta }),
  };
}

/**
 * Express 中间件：自动为每个请求添加追踪 ID
 */
export function requestLogger(req: any, res: any, next: any) {
  const requestId = generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  // 记录请求开始
  logger.http(`→ ${req.method} ${req.url}`, { 
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  
  // 记录响应完成
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - (req._startTime || Date.now());
    logger.http(`← ${req.method} ${req.url} ${res.statusCode} ${duration}ms`, {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
    return originalSend.call(this, data);
  };
  
  req._startTime = Date.now();
  next();
}

// 便捷方法（保持原有 API 兼容）
export const log = {
  success: (message: string, ...args: any[]) => {
    logger.success(message, args);
  },
};

// 使用 named export 导出 logger（兼容原有导入方式）
export { logger };
export default logger;
