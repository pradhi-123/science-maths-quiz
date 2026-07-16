const fs = require('fs');
let c = fs.readFileSync('src/lib/questions.js', 'utf8');

// Strip out existing bg fields completely
c = c.replace(/\s*bg: "url[^"]+",/g, "");
// Strip out video fields completely
c = c.replace(/\s*video: "[^"]+",/g, "");

// Bump cache to v16 to flush the browser instantly
c = c.replace(/v15/g, 'v16');

fs.writeFileSync('src/lib/questions.js', c);
console.log('Successfully stripped all unique backgrounds and videos! Back to default!');
