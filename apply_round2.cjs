const fs = require('fs');

const mappings = {
  'r4-q1': '/images/untitled_design/ppt/media/VAGvTJXmSnQ.mp4',
  'r4-q2': '/images/untitled_design/ppt/media/VAGiJZDHYVk.mp4',
  'r4-q3': '/images/untitled_design/ppt/media/VAG-98XlJp8.mp4',
  'r4-q4': '/images/untitled_design/ppt/media/VAG-3NkZtuQ.mp4',
  'r4-q5': '/images/untitled_design/ppt/media/VAF_cYsWN1Y.mp4',
  'r4-q6': '/images/untitled_design/ppt/media/VAD-V13dHbY.mp4',
};

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

for (const [id, video] of Object.entries(mappings)) {
  c = c.replace(`id: "${id}",`, `id: "${id}",\n    video: "${video}",`);
}

// Bump cache to v18
c = c.replace(/v17/g, 'v18');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Round 2 completely mapped!');
