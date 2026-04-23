const { execSync } = require('child_process');
const path = require('path');

// Get ffmpeg-static binary path
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (e) {
  console.log('Installing ffmpeg-static...');
  execSync('npm install ffmpeg-static', { stdio: 'inherit' });
  ffmpegPath = require('ffmpeg-static');
}

const inputFile = path.join(__dirname, 'media/Comp 1_3.mp4');
const outputPattern = path.join(__dirname, 'media/frame-%04d.webp');

console.log(`Converting video to WebP sequence at 30fps...`);
console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputPattern}`);

try {
  const command = `"${ffmpegPath}" -i "${inputFile}" -vf "fps=30" "${outputPattern}" -y`;
  console.log(`\nRunning: ${command}\n`);
  execSync(command, { stdio: 'inherit' });
  console.log('\n✓ Conversion complete!');
} catch (error) {
  console.error('Error converting video:', error.message);
  process.exit(1);
}
