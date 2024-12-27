const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
  // Vytvoříme SVG s gradientem a symbolem
  const svgBuffer = Buffer.from(`
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="128" fill="url(#grad)"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
        fill="white" font-size="256" font-family="Arial">✓</text>
    </svg>
  `);

  // Velikosti ikon, které chceme generovat
  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .toFile(path.join(process.cwd(), 'public', `icon-${size}x${size}.png`));
    
    console.log(`Vygenerována ikona ${size}x${size}`);
  }
}

generateIcons().catch(console.error); 