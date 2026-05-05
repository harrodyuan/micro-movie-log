const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

function svgIcon(size) {
  const bar = Math.round(size * 0.06);
  const fontSize = Math.round(size * 0.28);
  const subSize = Math.round(size * 0.1);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#000"/>
  <rect width="${size}" height="${bar}" fill="#EAB308"/>
  <text x="${size/2}" y="${size*0.52}" font-family="Arial,sans-serif" font-weight="bold"
    font-size="${fontSize}" fill="white" text-anchor="middle" dominant-baseline="middle">MIDB</text>
  <text x="${size/2}" y="${size*0.72}" font-family="Arial,sans-serif"
    font-size="${subSize}" fill="#71717a" text-anchor="middle">Movie Rankings</text>
</svg>`);
}

async function main() {
  for (const size of [192, 512]) {
    await sharp(svgIcon(size)).png().toFile(path.join(publicDir, `icon-${size}.png`));
    console.log(`✅ icon-${size}.png`);
  }
}
main();
