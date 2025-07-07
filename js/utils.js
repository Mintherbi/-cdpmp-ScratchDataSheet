// 📁 utils.js
export function randomPosition(radius = 250, centerX, centerY) {
  const angle = Math.random() * 2 * Math.PI;
  const r = radius * (0.5 + Math.random() * 0.5);
  return {
    x: centerX + r * Math.cos(angle) - 60,
    y: centerY + r * Math.sin(angle) - 32
  };
}

export function randomVelocity() {
  return {
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7
  };
}

export function getColorByDepth(depth, maxDepth = 3) {
  const hue = 200 + depth * 40;
  return `hsl(${hue}, 70%, 60%)`;
}
