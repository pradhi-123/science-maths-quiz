const fs = require('fs');

const mappings = {
  'r3-q1': '/images/scientofabio_extract/ppt/media/VAG6sBH98ZY.mp4',
  'r3-q2': '/images/scientofabio_extract/ppt/media/VAG9f9GjA-U.mp4',
  'r3-q3': '/images/scientofabio_extract/ppt/media/VAG5zwPs8_U.mp4',
  'r3-q4': '/images/scientofabio_extract/ppt/media/VAG1haZikIU.mp4',
  'r3-q5': '/images/scientofabio_extract/ppt/media/VAGZ2h7bpE8.mp4',
  'r3-q6': '/images/scientofabio_extract/ppt/media/VAHAp6EDcf4.mp4',
};

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

for (const [id, video] of Object.entries(mappings)) {
  c = c.replace(`id: "${id}",`, `id: "${id}",\n    video: "${video}",`);
}

// Bump cache to v19
c = c.replace(/v18/g, 'v19');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Round 4 completely mapped!');
