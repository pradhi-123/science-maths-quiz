const fs = require('fs');

let c = fs.readFileSync('src/lib/questions.js', 'utf8');

const bgs = [
  // 14 from Untitled Design
  '/images/untitled_design/ppt/media/image1.jpeg',
  '/images/untitled_design/ppt/media/image2.jpeg',
  '/images/untitled_design/ppt/media/image3.jpeg',
  '/images/untitled_design/ppt/media/image4.jpeg',
  '/images/untitled_design/ppt/media/image5.jpeg',
  '/images/untitled_design/ppt/media/image6.jpeg',
  '/images/untitled_design/ppt/media/image7.jpeg',
  '/images/untitled_design/ppt/media/image8.jpeg',
  '/images/untitled_design/ppt/media/image9.jpeg',
  '/images/untitled_design/ppt/media/image10.jpeg',
  '/images/untitled_design/ppt/media/image11.jpeg',
  '/images/untitled_design/ppt/media/image12.jpeg',
  '/images/untitled_design/ppt/media/image13.jpeg',
  '/images/untitled_design/ppt/media/image14.jpeg',
  // 14 from Scientofabio
  '/images/scientofabio_extract/ppt/media/image4.jpeg',
  '/images/scientofabio_extract/ppt/media/image5.jpeg',
  '/images/scientofabio_extract/ppt/media/image6.jpeg',
  '/images/scientofabio_extract/ppt/media/image7.jpeg',
  '/images/scientofabio_extract/ppt/media/image8.jpeg',
  '/images/scientofabio_extract/ppt/media/image9.jpeg',
  '/images/scientofabio_extract/ppt/media/image10.jpeg',
  '/images/scientofabio_extract/ppt/media/image11.jpeg',
  '/images/scientofabio_extract/ppt/media/image12.jpeg',
  '/images/scientofabio_extract/ppt/media/image13.jpeg',
  '/images/scientofabio_extract/ppt/media/image14.jpeg',
  '/images/scientofabio_extract/ppt/media/image15.jpeg',
  '/images/scientofabio_extract/ppt/media/image16.jpeg',
  '/images/scientofabio_extract/ppt/media/image17.jpeg'
];

let i = 0;
// Strip out existing bg fields
c = c.replace(/\s*bg: "url[^"]+",/g, "");

// Re-inject the perfectly unique images
c = c.replace(/id: "(r\d-q\d)",/g, (match) => {
  if (i >= bgs.length) return match;
  return match + '\n    bg: "url(\'' + bgs[i++] + '\') no-repeat center center / 100% 100%",';
});

// Bump cache to v13
c = c.replace(/v12/g, 'v13');

fs.writeFileSync('src/lib/questions.js', c);
console.log('Successfully remapped ' + i + ' unique slides!');
