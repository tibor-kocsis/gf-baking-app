const fs = require('fs');
const { createCanvas } = require('canvas');

// Icon sizes needed for Expo app
const sizes = {
  'icon.png': 1024,
  'adaptive-icon.png': 1024,
  'favicon.png': 48,
  'splash-icon.png': 1024,
};

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - Orange gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#FF6B35');
  gradient.addColorStop(1, '#FF8C42');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Pizza circle - beige/yellow
  const pizzaRadius = size * 0.35;
  const centerX = size / 2;
  const centerY = size / 2;

  ctx.fillStyle = '#F4D03F';
  ctx.beginPath();
  ctx.arc(centerX, centerY, pizzaRadius, 0, Math.PI * 2);
  ctx.fill();

  // Crust edge - darker
  ctx.strokeStyle = '#D4A017';
  ctx.lineWidth = size * 0.02;
  ctx.stroke();

  // Pepperoni slices (red circles)
  const pepperoniRadius = size * 0.08;
  const pepperoniPositions = [
    { x: 0.35, y: 0.35 },
    { x: 0.65, y: 0.35 },
    { x: 0.35, y: 0.65 },
    { x: 0.65, y: 0.65 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.35 },
    { x: 0.5, y: 0.65 },
  ];

  ctx.fillStyle = '#C0392B';
  pepperoniPositions.forEach(pos => {
    ctx.beginPath();
    ctx.arc(size * pos.x, size * pos.y, pepperoniRadius, 0, Math.PI * 2);
    ctx.fill();

    // Pepperoni highlight
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath();
    ctx.arc(size * pos.x - pepperoniRadius * 0.2, size * pos.y - pepperoniRadius * 0.2, pepperoniRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C0392B';
  });

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`assets/${filename}`, buffer);
  console.log(`✅ Generated ${filename} (${size}x${size})`);
}

function generateEmojiIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - White or transparent for adaptive icon
  if (filename.includes('adaptive')) {
    ctx.fillStyle = 'transparent';
  } else {
    ctx.fillStyle = '#FFFFFF';
  }
  ctx.fillRect(0, 0, size, size);

  // Draw pizza emoji (using text)
  const fontSize = size * 0.7;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Pizza emoji
  ctx.fillText('🍕', size / 2, size / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`assets/${filename}`, buffer);
  console.log(`✅ Generated ${filename} (${size}x${size})`);
}

console.log('🍕 Generating Pizza Calc icons...\n');

// Check if canvas is available
try {
  require('canvas');
  console.log('📦 Using node-canvas for icon generation\n');

  // Generate all icons
  Object.entries(sizes).forEach(([filename, size]) => {
    generateIcon(size, filename);
  });

  console.log('\n✅ All icons generated successfully!');
  console.log('📁 Icons saved in: assets/');
} catch (error) {
  console.log('⚠️  node-canvas not found. Installing it now...\n');
  console.log('Run: npm install canvas');
  console.log('\nOr use the emoji-based fallback:');
  console.log('Run: node generate-icons.js --emoji');

  // Fallback: Use emoji if --emoji flag is present
  if (process.argv.includes('--emoji')) {
    console.log('\n🎨 Using emoji-based icons...\n');
    Object.entries(sizes).forEach(([filename, size]) => {
      generateEmojiIcon(size, filename);
    });
    console.log('\n✅ All emoji icons generated successfully!');
  }
}
