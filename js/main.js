import { nodes } from './data.js';
import { randomPosition, randomVelocity } from './utils.js';
import { drawNodes, handleMouseMove } from './draw.js';

const mindmap = document.getElementById('mindmap');
const width = window.innerWidth;
const height = window.innerHeight * 0.9;

// 노드 위치 및 속도 초기화
nodes.forEach(node => {
  const pos = randomPosition(250, width / 2, height / 2);
  node.x = pos.x;
  node.y = pos.y;
  const vel = randomVelocity();
  node.vx = vel.vx;
  node.vy = vel.vy;
});

// 애니메이션 루프
function animate() {
  nodes.forEach(node => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > width - 120) node.vx *= -1;
    if (node.y < 0 || node.y > height - 64) node.vy *= -1;
  });
  drawNodes(nodes, mindmap, width, height);
  requestAnimationFrame(animate);
}

// 실행
document.addEventListener('DOMContentLoaded', () => {
  drawNodes(nodes, mindmap, width, height);
  animate();
  document.addEventListener('mousemove', e => handleMouseMove(e, nodes));
});
