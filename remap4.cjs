const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function getFiles(dir, exts) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file, exts));
    } else {
      if (exts.includes(path.extname(file).toLowerCase())) results.push(file);
    }
  });
  return results;
}

const allFiles = getFiles('public/images', ['.mp4', '.gif']);
const unique = new Map();
allFiles.forEach(f => {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  if (!unique.has(hash)) {
    // Normalise path to POSIX for the web
    let webPath = f.replace(/\\/g, '/').replace('public', '');
    unique.set(hash, webPath);
  }
});

const uniqueFiles = Array.from(unique.values());

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

// Strip out existing bg fields and video fields completely
c = c.replace(/\s*bg: "url[^"]+",/g, "");
c = c.replace(/\s*video: "[^"]+",/g, "");

let i = 0;
// Re-inject moving files
c = c.replace(/id: "(r\d-q\d)",/g, (match) => {
  if (i >= uniqueFiles.length) return match;
  
  const file = uniqueFiles[i++];
  if (file.endsWith('.gif')) {
    return match + '\n    bg: "url(\'' + file + '\') no-repeat center center / 100% 100%",';
  } else {
    // We map MP4 files to the video property, and provide a fallback bg
    return match + '\n    video: "' + file + '",';
  }
});

// Bump cache to v15
c = c.replace(/v14/g, 'v15');

fs.writeFileSync('src/lib/questions.js', c);
console.log('Successfully injected ' + i + ' unique ANIMATED backgrounds!');
