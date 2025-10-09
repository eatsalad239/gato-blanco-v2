#!/usr/bin/env node

/**
 * PWA Icon Generator for Gato Blanco Café
 * Generates all required icons for PWA and Android app
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA and Android
const ICON_SIZES = [
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png' }
];

// Create SVG icon template for Gato Blanco
const createGatoBlancSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4469ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#bf9c4b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="coffee" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#bf9c4b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b4513;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="url(#bg)" stroke="#ffffff" stroke-width="2"/>
  
  <!-- Coffee cup -->
  <g transform="translate(${size*0.2}, ${size*0.25})">
    <!-- Cup body -->
    <path d="M${size*0.1} ${size*0.3} L${size*0.5} ${size*0.3} L${size*0.45} ${size*0.6} L${size*0.15} ${size*0.6} Z" 
          fill="url(#coffee)" stroke="#ffffff" stroke-width="2"/>
    
    <!-- Coffee surface -->
    <ellipse cx="${size*0.3}" cy="${size*0.3}" rx="${size*0.2}" ry="${size*0.03}" fill="#8b4513"/>
    
    <!-- Handle -->
    <path d="M${size*0.5} ${size*0.35} Q${size*0.6} ${size*0.35} ${size*0.6} ${size*0.45} Q${size*0.6} ${size*0.55} ${size*0.5} ${size*0.55}" 
          fill="none" stroke="#ffffff" stroke-width="3"/>
    
    <!-- Steam lines -->
    <path d="M${size*0.25} ${size*0.2} Q${size*0.23} ${size*0.15} ${size*0.25} ${size*0.1}" 
          fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <path d="M${size*0.3} ${size*0.2} Q${size*0.32} ${size*0.15} ${size*0.3} ${size*0.1}" 
          fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
    <path d="M${size*0.35} ${size*0.2} Q${size*0.37} ${size*0.15} ${size*0.35} ${size*0.1}" 
          fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  </g>
  
  <!-- Colombian flag elements -->
  <rect x="${size*0.1}" y="${size*0.8}" width="${size*0.8}" height="${size*0.05}" fill="#bf9c4b"/>
  <rect x="${size*0.1}" y="${size*0.85}" width="${size*0.4}" height="${size*0.05}" fill="#4469ff"/>
  <rect x="${size*0.5}" y="${size*0.85}" width="${size*0.4}" height="${size*0.05}" fill="#8b4513"/>
</svg>
`;

// Create splash screen SVG
const createSplashSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="splash-bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1e1e1e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#splash-bg)"/>
  
  <!-- Large coffee cup icon -->
  <g transform="translate(${size*0.3}, ${size*0.35}) scale(1.5)">
    ${createGatoBlancSVG(size * 0.3).match(/<g transform.*?<\/g>/s)[0]}
  </g>
  
  <!-- Text -->
  <text x="${size/2}" y="${size*0.75}" font-family="Arial, sans-serif" font-size="${size*0.08}" 
        font-weight="bold" text-anchor="middle" fill="#bf9c4b">GATO BLANCO</text>
  <text x="${size/2}" y="${size*0.85}" font-family="Arial, sans-serif" font-size="${size*0.04}" 
        text-anchor="middle" fill="#4469ff">CAFÉ COLOMBIANO</text>
</svg>
`;

// Ensure directories exist
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Generate icons
const generateIcons = () => {
  console.log('🎨 Generating PWA and Android icons for Gato Blanco Café...');
  
  // Ensure directories exist
  ensureDirectoryExists('public');
  ensureDirectoryExists('android-app/app/src/main/res/drawable');
  ensureDirectoryExists('android-app/app/src/main/res/mipmap-hdpi');
  ensureDirectoryExists('android-app/app/src/main/res/mipmap-mdpi');
  ensureDirectoryExists('android-app/app/src/main/res/mipmap-xhdpi');
  ensureDirectoryExists('android-app/app/src/main/res/mipmap-xxhdpi');
  ensureDirectoryExists('android-app/app/src/main/res/mipmap-xxxhdpi');
  
  // Generate PWA icons
  ICON_SIZES.forEach(({ size, name }) => {
    const svg = createGatoBlancSVG(size);
    fs.writeFileSync(path.join('public', name.replace('.png', '.svg')), svg);
    console.log(`✅ Generated ${name}`);
  });
  
  // Generate splash screen
  const splashSVG = createSplashSVG(512);
  fs.writeFileSync('public/splash-screen.svg', splashSVG);
  fs.writeFileSync('android-app/app/src/main/res/drawable/splash_screen.xml', `
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="512dp"
    android:height="512dp"
    android:viewportWidth="512"
    android:viewportHeight="512">
    <!-- Colombian coffee cup icon -->
    <path android:fillColor="#4469ff"
          android:pathData="M256,256m-250,0a250,250 0,1 1,500 0a250,250 0,1 1,-500 0"/>
    <path android:fillColor="#bf9c4b"
          android:pathData="M150,200 L350,200 L330,350 L170,350 Z"/>
    <ellipse android:fillColor="#8b4513"
             android:cx="250" android:cy="200"
             android:rx="100" android:ry="15"/>
</vector>
  `);
  
  // Generate Android launcher icons
  const androidIconSizes = [
    { folder: 'mipmap-mdpi', size: 48 },
    { folder: 'mipmap-hdpi', size: 72 },
    { folder: 'mipmap-xhdpi', size: 96 },
    { folder: 'mipmap-xxhdpi', size: 144 },
    { folder: 'mipmap-xxxhdpi', size: 192 }
  ];
  
  androidIconSizes.forEach(({ folder, size }) => {
    const svg = createGatoBlancSVG(size);
    fs.writeFileSync(`android-app/app/src/main/res/${folder}/ic_launcher.xml`, `
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="${size}dp"
    android:height="${size}dp"
    android:viewportWidth="${size}"
    android:viewportHeight="${size}">
    ${svg.match(/<defs>.*?<\/defs>/s)?.[0] || ''}
    ${svg.match(/<circle.*?\/>/g)?.[0] || ''}
    ${svg.match(/<g transform.*?<\/g>/s)?.[0] || ''}
    ${svg.match(/<rect.*?\/>/g)?.join('') || ''}
</vector>
    `);
    console.log(`✅ Generated Android icon for ${folder}`);
  });
  
  // Generate adaptive icon (Android 8.0+)
  fs.writeFileSync('android-app/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml', `
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/colorPrimary"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
  `);
  
  fs.writeFileSync('android-app/app/src/main/res/drawable/ic_launcher_foreground.xml', `
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <!-- Coffee cup centered for adaptive icon -->
    <group android:scaleX="0.7" android:scaleY="0.7" 
           android:translateX="16.2" android:translateY="16.2">
        <path android:fillColor="#ffffff"
              android:pathData="M20,30 L56,30 L52,55 L24,55 Z"/>
        <ellipse android:fillColor="#f0f0f0"
                 android:cx="40" android:cy="30"
                 android:rx="18" android:ry="3"/>
        <path android:strokeColor="#ffffff" android:strokeWidth="2"
              android:pathData="M56,35 Q65,35 65,45 Q65,55 56,55"
              android:fillColor="none"/>
    </group>
</vector>
  `);
  
  console.log('🎉 All icons generated successfully!');
  console.log('📱 Icons are ready for PWA and Android deployment');
  console.log('');
  console.log('Next steps:');
  console.log('1. Convert SVG icons to PNG using online tools or ImageMagick');
  console.log('2. Replace the generated XML icons with proper PNG files');
  console.log('3. Update manifest.json icon paths if needed');
};

// Run the generator
generateIcons();