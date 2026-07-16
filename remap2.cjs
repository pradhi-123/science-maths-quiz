const fs = require('fs');
let c = fs.readFileSync('src/lib/questions.js', 'utf8');

const bgs = [
  'image25.jpeg', 'image26.jpeg', 'image27.jpeg', 'image28.jpeg', 'image29.jpeg',
  'image31.jpeg', 'image34.jpeg', 'image35.jpeg', 'image37.jpeg', 'image41.jpeg',
  'image42.jpeg', 'image45.jpeg', 'image46.jpeg', 'image47.jpeg', 'image48.jpeg',
  'image50.jpeg', 'image51.jpeg', 'image52.jpeg', 'image53.jpeg', 'image55.jpeg',
  'image56.jpeg', 'image57.jpeg', 'image59.jpeg', 'image60.jpeg', 'image61.jpeg',
  'image63.jpeg', 'image65.jpeg', 'image68.jpeg', 'image69.jpeg', 'image75.jpeg'
];

let i = 0;
// Strip out existing bg fields
c = c.replace(/\s*bg: "url[^"]+",/g, "");

// Re-inject completely unique JPEGs
c = c.replace(/id: "(r\d-q\d)",/g, (match) => {
  if (i >= bgs.length) return match;
  return match + '\n    bg: "url(\'/images/ppt2022/' + bgs[i++] + '\') no-repeat center center / cover",';
});

// Bump cache to v11
c = c.replace(/v10/g, 'v11');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Rebuilt ' + i + ' slides with unique JPEGs!');
