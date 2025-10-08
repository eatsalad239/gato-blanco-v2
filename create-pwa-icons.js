#!/usr/bin/env node

/**
 * PWA Icon Generator for Gato Blanco Café
 * Creates all required PWA icons from a base design
 */

import fs from 'fs';
import path from 'path';

// Simple SVG icon template with coffee/lightning theme
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4469ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
    </radialGradient>
    <linearGradient id="lightning" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e0e7ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bg)" stroke="#60a5fa" stroke-width="2"/>
  
  <!-- Coffee cup -->
  <path d="M${size*0.25} ${size*0.4} Q${size*0.25} ${size*0.35} ${size*0.3} ${size*0.35} L${size*0.65} ${size*0.35} Q${size*0.7} ${size*0.35} ${size*0.7} ${size*0.4} L${size*0.7} ${size*0.65} Q${size*0.7} ${size*0.75} ${size*0.65} ${size*0.75} L${size*0.3} ${size*0.75} Q${size*0.25} ${size*0.75} ${size*0.25} ${size*0.65} Z" 
        fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
  
  <!-- Coffee cup handle -->
  <path d="M${size*0.7} ${size*0.45} Q${size*0.8} ${size*0.45} ${size*0.8} ${size*0.55} Q${size*0.8} ${size*0.65} ${size*0.7} ${size*0.65}" 
        fill="none" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Lightning bolt -->
  <path d="M${size*0.42} ${size*0.2} L${size*0.38} ${size*0.3} L${size*0.45} ${size*0.3} L${size*0.4} ${size*0.45} L${size*0.55} ${size*0.25} L${size*0.48} ${size*0.25} L${size*0.52} ${size*0.15} Z" 
        fill="url(#lightning)" stroke="#1e40af" stroke-width="0.5"/>
  
  <!-- Steam lines -->
  <path d="M${size*0.35} ${size*0.25} Q${size*0.35} ${size*0.2} ${size*0.37} ${size*0.2} Q${size*0.37} ${size*0.25} ${size*0.37} ${size*0.2}" 
        fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.6"/>
  <path d="M${size*0.47} ${size*0.25} Q${size*0.47} ${size*0.2} ${size*0.49} ${size*0.2} Q${size*0.49} ${size*0.25} ${size*0.49} ${size*0.2}" 
        fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.6"/>
  <path d="M${size*0.59} ${size*0.25} Q${size*0.59} ${size*0.2} ${size*0.61} ${size*0.2} Q${size*0.61} ${size*0.25} ${size*0.61} ${size*0.2}" 
        fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.6"/>
</svg>
`;

// Icon sizes required for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Creating PWA Icons for Gato Blanco Café...');

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Generate SVG icons for each size
iconSizes.forEach(size => {
    const svgContent = createIconSVG(size);
    const filename = `public/icon-${size}.png`;
    
    // For this demo, we'll create SVG files that can be converted to PNG
    // In production, you'd use a proper image conversion library
    const svgFilename = `public/icon-${size}.svg`;
    fs.writeFileSync(svgFilename, svgContent);
    
    console.log(`✅ Created ${svgFilename}`);
});

// Create a simple placeholder for screenshots
const createScreenshotHTML = (width, height, label) => `
<!DOCTYPE html>
<html>
<head>
    <title>${label}</title>
    <style>
        body {
            margin: 0;
            background: linear-gradient(135deg, #1e3a8a, #4469ff);
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }
        .container {
            max-width: 80%;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.5rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ GATO BLANCO ⚡</h1>
        <p>Premium Coffee Experience</p>
        <p>Zona Rosa, Medellín</p>
    </div>
</body>
</html>
`;

// Create screenshot placeholders
fs.writeFileSync('public/screenshot-mobile.html', createScreenshotHTML(390, 844, 'Mobile Screenshot'));
fs.writeFileSync('public/screenshot-desktop.html', createScreenshotHTML(1920, 1080, 'Desktop Screenshot'));

console.log('✅ Created screenshot placeholders');

// Create simple PNG placeholders (base64 encoded small images)
const createSimplePNG = (size) => {
    // This is a simple 1x1 pixel PNG in base64, scaled up
    // In production, you'd use proper image generation
    const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#4469ff"/>
        <text x="${size/2}" y="${size/2}" text-anchor="middle" dy=".3em" fill="white" font-size="${size/8}">⚡GB⚡</text>
    </svg>`;
    
    return canvas;
};

// Create basic PNG files using SVG (for demo purposes)
iconSizes.forEach(size => {
    const pngContent = createSimplePNG(size);
    fs.writeFileSync(`public/icon-${size}-temp.svg`, pngContent);
});

console.log('🚀 PWA icons created! To convert SVG to PNG:');
console.log('   1. Use online converter: https://cloudconvert.com/svg-to-png');
console.log('   2. Or install ImageMagick: convert icon-*.svg icon-*.png');
console.log('   3. Or use Node.js sharp library for automated conversion');

console.log('\n📱 PWA Setup Complete!');