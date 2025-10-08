# Create placeholder PWA icons - these should be replaced with actual branded icons

# Create public directory if it doesn't exist
mkdir -p public

# Simple SVG icon that can be converted to different sizes
cat > icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#4469ff" rx="64"/>
  <g fill="white" transform="translate(128, 128)">
    <!-- Coffee cup -->
    <path d="M64 32h192v32H64z"/>
    <path d="M48 64h224l-16 192H64z"/>
    <path d="M48 288h192v32H48z"/>
    <!-- Lightning bolt -->
    <path d="M288 64l-32 96h48l-32 96 80-96h-48l32-96z"/>
  </g>
  <text x="256" y="440" font-family="Arial, sans-serif" font-size="64" font-weight="bold" text-anchor="middle" fill="white">⚡</text>
</svg>
EOF

# Note: In production, you would use a tool like ImageMagick to convert this SVG to different PNG sizes:
# convert icon.svg -resize 72x72 public/icon-72.png
# convert icon.svg -resize 96x96 public/icon-96.png
# etc.

echo "Icon template created. Please replace with actual branded icons in production."