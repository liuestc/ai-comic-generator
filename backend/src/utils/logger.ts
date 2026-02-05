/**
 * 简单的日志工具
 */

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`\n[INFO] ${new Date().toLocaleTimeString()} | ${message}`, ...args);
  },

  error: (message: string, error?: any) => {
    console.error(`\n[ERROR] ${new Date().toLocaleTimeString()} | ${message}`);
    if (error) {
      console.error('  └─', error);
    }
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`\n[WARN] ${new Date().toLocaleTimeString()} | ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`\n[DEBUG] ${new Date().toLocaleTimeString()} | ${message}`, ...args);
    }
  },

  success: (message: string, ...args: any[]) => {
    console.log(`\n✅ ${new Date().toLocaleTimeString()} | ${message}`, ...args);
  },
};
