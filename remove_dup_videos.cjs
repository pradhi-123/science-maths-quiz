const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

const videoRegex = /video: "(.*?)"/g;
let matches;
const seenHashes = new Set();
let duplicatesToRemove = [];

while ((matches = videoRegex.exec(c)) !== null) {
  const videoPath = path.join('public', matches[1]);
  if (fs.existsSync(videoPath)) {
    const fileBuffer = fs.readFileSync(videoPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    if (seenHashes.has(hash)) {
      duplicatesToRemove.push(matches[0]); 
      console.log('Found duplicate video:', matches[1]);
    } else {
      seenHashes.add(hash);
    }
  }
}

// Strip out duplicate video lines
duplicatesToRemove.forEach(dup => {
  // Escape regex chars
  const escapedDup = dup.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  c = c.replace(new RegExp('\\s*' + escapedDup + ',', 'g'), '');
});

// Bump cache to v14
c = c.replace(/v13/g, 'v14');
fs.writeFileSync('src/lib/questions.js', c);

console.log(`Purged ${duplicatesToRemove.length} duplicate video overlays from the database!`);
