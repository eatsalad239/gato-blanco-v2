#!/bin/bash

# PWA Icon Generator Script for Gato Blanco Café
# This script creates placeholder PNG files for PWA icons

echo "🎨 Creating PWA Icons for Gato Blanco Café..."

# Create public directory if it doesn't exist
mkdir -p public

# Icon sizes required for PWA
sizes=(72 96 128 144 152 192 384 512)

# Create SVG template function
create_icon_svg() {
    local size=$1
    cat > "public/icon-${size}.svg" << EOF
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4469ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size}/2" cy="${size}/2" r="$((size/2 - 2))" fill="url(#bg)" stroke="#60a5fa" stroke-width="2"/>
  
  <!-- Coffee cup -->
  <rect x="$((size/4))" y="$((size*2/5))" width="$((size/2))" height="$((size/3))" rx="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
  
  <!-- Lightning bolt -->
  <text x="${size}/2" y="$((size/4))" text-anchor="middle" font-size="$((size/6))" fill="#60a5fa">⚡</text>
  
  <!-- Coffee text -->
  <text x="${size}/2" y="$((size*3/4))" text-anchor="middle" font-size="$((size/10))" fill="#f8fafc" font-weight="bold">GB</text>
</svg>
EOF
}

# Generate SVG icons for each size
for size in "${sizes[@]}"; do
    create_icon_svg $size
    echo "✅ Created public/icon-${size}.svg"
done

# Create a favicon.ico placeholder
cat > "public/favicon.svg" << 'EOF'
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="15" fill="#4469ff" stroke="#60a5fa" stroke-width="1"/>
  <text x="16" y="20" text-anchor="middle" font-size="12" fill="white" font-weight="bold">⚡</text>
</svg>
EOF

echo "✅ Created favicon.svg"

echo ""
echo "🚀 PWA Icons Generated!"
echo ""
echo "📝 Next Steps:"
echo "   1. Convert SVG to PNG using online tool: https://cloudconvert.com/svg-to-png"
echo "   2. Or install imagemagick: sudo apt install imagemagick"
echo "   3. Then run: for f in public/*.svg; do convert \$f \${f%.svg}.png; done"
echo ""
echo "🎯 Alternative: Use https://favicon.io/favicon-generator/ for quick PNG generation"
echo ""
echo "✨ Once PNG files are created, your PWA will be fully functional!"