const fs = require('fs');
const { execSync } = require('child_process');

const qjs = fs.readFileSync('src/lib/questions.js', 'utf8');
const usedVideos = [...qjs.matchAll(/video:\s*"(.*?)"/g)].map(m => m[1]);
const uniqueVideos = [...new Set(usedVideos)];

console.log('Found used videos:', uniqueVideos.length);

try {
  // Use powershell syntax to remove all mp4 files from cache
  execSync('powershell -Command "Get-ChildItem -Path public/images -Filter *.mp4 -Recurse | ForEach-Object { git rm --cached $_.FullName }"', { stdio: 'inherit' });
} catch (e) {
  console.log('Git rm soft failed');
}

for (const vid of uniqueVideos) {
  const localPath = 'public' + vid;
  try {
    execSync(`git add "${localPath}"`, { stdio: 'inherit' });
  } catch (e) {
    console.log('Failed to add:', localPath);
  }
}

console.log('Amending commit and pushing...');
try {
  execSync('git commit --amend --no-edit', { stdio: 'inherit' });
  execSync('git push -f', { stdio: 'inherit' });
  console.log('PUSH COMPLETELY FINISHED!');
} catch (e) {
  console.error('Push failed!');
}
