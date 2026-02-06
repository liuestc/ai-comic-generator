/**
 * 清理孤立数据脚本
 * 检查数据库中没有对应图片的记录
 * 检查文件系统中没有对应记录的图片
 */

import { databaseService } from '../services/databaseService';
import * as fs from 'fs';
import * as path from 'path';

console.log('🧹 Cleaning orphaned data...\n');

const db = databaseService;
const imagesDir = path.join(process.cwd(), 'public', 'images');

// 1. 检查数据库中的记录
const result = db.getComics({ page: 1, limit: 1000 });
const comics = result.comics;
let orphanedRecords = 0;
let orphanedImages = 0;

console.log(`📊 Found ${comics.length} comics in database`);

for (const comic of comics) {
  // 检查角色图
  if (comic.characterImageUrl) {
    const relativePath = comic.characterImageUrl.startsWith('/') ? comic.characterImageUrl.slice(1) : comic.characterImageUrl;
    const imagePath = path.join(process.cwd(), 'public', relativePath);
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Missing character image: ${comic.characterImageUrl} (Comic: ${comic.id})`);
      orphanedRecords++;
    }
  }
}

// 2. 检查文件系统中的图片
if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg)$/.test(f));
  console.log(`\n📁 Found ${imageFiles.length} image files`);

  for (const filename of imageFiles) {
    const imageUrl = `/images/${filename}`;
    
    // 检查是否在数据库中
    let found = false;
    for (const comic of comics) {
      if (comic.characterImageUrl === imageUrl) {
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`❌ Orphaned image file: ${filename}`);
      orphanedImages++;
    }
  }
}

console.log('\n📊 Summary:');
console.log(`   - Orphaned records (missing images): ${orphanedRecords}`);
console.log(`   - Orphaned images (not in database): ${orphanedImages}`);

if (orphanedRecords === 0 && orphanedImages === 0) {
  console.log('\n✅ No orphaned data found!');
} else {
  console.log('\n💡 Manual cleanup may be required.');
}
