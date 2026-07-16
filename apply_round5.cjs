const fs = require('fs');

const mappings = {
  'r5-q1': '/images/untitled_design/ppt/media/VAD-V13dHbY.mp4',
  'r5-q2': '/images/untitled_design/ppt/media/VAElu_htxkY.mp4',
  'r5-q3': '/images/untitled_design/ppt/media/VAF_cYsWN1Y.mp4',
  'r5-q4': '/images/untitled_design/ppt/media/VAG-3NkZtuQ.mp4',
};

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

for (const [id, video] of Object.entries(mappings)) {
  c = c.replace(`id: "${id}",`, `id: "${id}",\n    video: "${video}",`);
}

// Bump cache to v21
c = c.replace(/v20/g, 'v21');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Round 5 completely mapped!');
