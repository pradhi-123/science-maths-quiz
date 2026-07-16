const fs = require('fs');
let c = fs.readFileSync('src/lib/questions.js', 'utf8');
const bgs = [
  'image11.gif', 'image13.gif', 'image14.gif', 'image16.gif', 'image17.gif',
  'image18.gif', 'image19.gif', 'image22.gif', 'image23.gif', 'image24.gif',
  'image3.gif', 'image30.gif', 'image38.gif', 'image4.gif', 'image40.gif',
  'image44.gif', 'image49.gif', 'image5.gif', 'image54.gif', 'image83.gif',
  'image87.gif', 'image88.gif', 'image90.jpeg', 'image89.jpeg', 'image86.png',
  'image85.png', 'image84.png', 'image81.png', 'image80.jpeg', 'image79.png'
];
let i = 0;
c = c.replace(/id: "(r\d-q\d)",/g, (match) => {
  if (i >= bgs.length) return match;
  return match + '\n    bg: "url(\'/images/ppt2022/' + bgs[i++] + '\') no-repeat center center / cover",';
});
c = c.replace(/v9/g, 'v10');
fs.writeFileSync('src/lib/questions.js', c);
console.log('Injected ' + i + ' backgrounds!');
