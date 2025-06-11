/**
 * Simple script to generate placeholder PWA icons
 * In production, you'd want to use proper icon generation tools
 */

const fs = require('node:fs');
const path = require('node:path');

// Create SVG content for the Pickr icon
const createIconSVG = size => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="${size * 0.1}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" 
        fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">P</text>
</svg>
`;

// Icon sizes needed for PWA
const iconSizes = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

const publicDir = path.join(__dirname, '..', 'public');

// Generate SVG icons for each size
iconSizes.forEach(size => {
	const svgContent = createIconSVG(size);
	const filename = `icon-${size}.svg`;
	const filepath = path.join(publicDir, filename);

	fs.writeFileSync(filepath, svgContent.trim());
	console.log(`Generated ${filename}`);
});

// Create a simple favicon.ico placeholder
const faviconSVG = createIconSVG(32);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG.trim());
console.log('Generated favicon.svg');

console.log('\nIcon generation complete!');
console.log(
	'Note: These are placeholder SVG icons. For production, convert to PNG and create proper app icons.'
);
