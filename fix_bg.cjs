const fs = require('fs');

const files = [
  'src/lib/questions.js',
  'src/pages/LandingPage.jsx',
  'src/pages/PresenterPage.jsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the shorthand CSS background size
  content = content.replace(/center center \/ cover/g, 'center center / 100% 100%');
  
  // Replace direct React style objects
  content = content.replace(/backgroundSize:\s*'cover'/g, "backgroundSize: '100% 100%'");
  
  // Bump version cache in questions.js to flush to the client
  if (file === 'src/lib/questions.js') {
    content = content.replace(/v11/g, 'v12');
  }
  
  fs.writeFileSync(file, content);
  console.log('Patched ' + file);
}
