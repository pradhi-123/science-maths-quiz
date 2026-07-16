const fs = require('fs');

const mappings = {
  'r1-q1': '/images/untitled_design/ppt/media/VAG5zwPs8_U.mp4',
  'r1-q2': '/images/untitled_design/ppt/media/VAGGdp__oEU.mp4',
  'r1-q3': '/images/untitled_design/ppt/media/VAGOQE_gJrE.mp4',
  'r1-q4': '/images/untitled_design/ppt/media/VAGOQJxFNJ4.mp4',
  'r1-q5': '/images/untitled_design/ppt/media/VAGY69lJt6s.mp4',
  'r1-q6': '/images/untitled_design/ppt/media/VAHBI3fvauM.mp4',
};

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

for (const [id, video] of Object.entries(mappings)) {
  c = c.replace(`id: "${id}",`, `id: "${id}",\n    video: "${video}",`);
}

// Bump cache to v17
c = c.replace(/v16/g, 'v17');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Round 1 perfectly mapped!');
