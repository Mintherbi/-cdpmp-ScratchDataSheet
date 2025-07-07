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

// Boid 알고리즘 파라미터
const BOID_RADIUS = 120;
const SEPARATION_DIST = 180; // 더 멀리 떨어지도록 증가
const ALIGNMENT_DIST = 180;
const COHESION_DIST = 180;
const SEPARATION_FORCE = 0.18; // 분리력도 약간 증가
const ALIGNMENT_FORCE = 0.08;
const COHESION_FORCE = 0.06;
const MAX_SPEED = 2.2;

function animate() {
  width = mindmap.clientWidth;
  height = mindmap.clientHeight;

  nodes.forEach((node, i) => {
    let sepX = 0, sepY = 0, sepCount = 0;
    let aliX = 0, aliY = 0, aliCount = 0;
    let cohX = 0, cohY = 0, cohCount = 0;

    nodes.forEach((other, j) => {
      if (i === j) return;
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Separation
      if (dist < SEPARATION_DIST && dist > 0.01) {
        sepX -= (other.x - node.x) / dist;
        sepY -= (other.y - node.y) / dist;
        sepCount++;
      }
      // Alignment
      if (dist < ALIGNMENT_DIST) {
        aliX += other.vx;
        aliY += other.vy;
        aliCount++;
      }
      // Cohesion
      if (dist < COHESION_DIST) {
        cohX += other.x;
        cohY += other.y;
        cohCount++;
      }
    });

    // Separation
    if (sepCount > 0) {
      sepX /= sepCount;
      sepY /= sepCount;
      node.vx += sepX * SEPARATION_FORCE;
      node.vy += sepY * SEPARATION_FORCE;
    }
    // Alignment
    if (aliCount > 0) {
      aliX /= aliCount;
      aliY /= aliCount;
      node.vx += (aliX - node.vx) * ALIGNMENT_FORCE;
      node.vy += (aliY - node.vy) * ALIGNMENT_FORCE;
    }
    // Cohesion
    if (cohCount > 0) {
      cohX /= cohCount;
      cohY /= cohCount;
      node.vx += (cohX - node.x) * COHESION_FORCE * 0.01;
      node.vy += (cohY - node.y) * COHESION_FORCE * 0.01;
    }

    // 속도 제한
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > MAX_SPEED) {
      node.vx = (node.vx / speed) * MAX_SPEED;
      node.vy = (node.vy / speed) * MAX_SPEED;
    }

    node.x += node.vx;
    node.y += node.vy;

    // 벽 충돌
    if (node.x < 0) { node.x = 0; node.vx *= -1; }
    if (node.x > width - 120) { node.x = width - 120; node.vx *= -1; }
    if (node.y < 0) { node.y = 0; node.vy *= -1; }
    if (node.y > height - 64) { node.y = height - 64; node.vy *= -1; }
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
