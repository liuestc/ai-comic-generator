/**
 * 数据库初始化脚本
 * 用于首次运行或重置数据库
 */

import { databaseService } from '../services/databaseService';

console.log('🔧 Initializing database...\n');

try {
  const db = databaseService;
  console.log('✅ Database initialized successfully!');
  console.log('📊 Tables created:');
  console.log('   - comics');
  console.log('   - panels');
  console.log('\n💡 You can now start the server with: pnpm dev');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}
