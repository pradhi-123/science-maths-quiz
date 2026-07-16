const fs = require('fs');

const mappings = {
  'r2-q1': '/images/sciencequiz2022_extract/ppt/media/image13.gif',
  'r2-q2': '/images/sciencequiz2022_extract/ppt/media/image12.jpeg',
  'r2-q3': '/images/sciencequiz2022_extract/ppt/media/image11.gif',
  'r2-q4': '/images/sciencequiz2022_extract/ppt/media/image17.gif',
  'r2-q5': '/images/sciencequiz2022_extract/ppt/media/image67.gif',
  'r2-q6': '/images/sciencequiz2022_extract/ppt/media/image64.gif',
};

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

for (const [id, bgPath] of Object.entries(mappings)) {
  c = c.replace(`id: "${id}",`, `id: "${id}",\n    bg: "url('${bgPath}') no-repeat center center / 100% 100%",`);
}

// Bump cache to v20
c = c.replace(/v19/g, 'v20');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Round 3 completely mapped!');
