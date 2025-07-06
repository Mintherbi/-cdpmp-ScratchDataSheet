import { nodes } from './data.js';
import { randomPosition, randomVelocity } from './utils.js';
import { drawNodes, handleMouseMove } from './draw.js';

// 현재 선택된 노드 id를 저장
window.selectedNodeId = null;

const mindmap = document.getElementById('mindmap');
let width = 0;
let height = 0;


function initNodePositions() {
  width = mindmap.clientWidth;
  height = mindmap.clientHeight;
  nodes.forEach(node => {
    const pos = randomPosition(250, width / 2, height / 2);
    node.x = pos.x;
    node.y = pos.y;
    const vel = randomVelocity();
    node.vx = vel.vx;
    node.vy = vel.vy;
  });
}

// 애니메이션 루프

function animate() {
  width = mindmap.clientWidth;
  height = mindmap.clientHeight;
  nodes.forEach(node => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > width - 120) node.vx *= -1;
    if (node.y < 0 || node.y > height - 64) node.vy *= -1;
  });
  drawNodes(nodes, mindmap, width, height, window.selectedNodeId);
  requestAnimationFrame(animate);
}

// 실행
document.addEventListener('DOMContentLoaded', () => {
  initNodePositions();
  drawNodes(nodes, mindmap, width, height, window.selectedNodeId);
  animate();
  document.addEventListener('mousemove', e => handleMouseMove(e, nodes));
  window.addEventListener('resize', () => {
    initNodePositions();
  });
});
