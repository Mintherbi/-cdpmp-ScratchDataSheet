import { nodes } from './data.js';
import { randomPosition, randomVelocity } from './utils.js';
import { drawNodes, handleMouseMove } from './draw.js';

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

function assignNodeDepths() {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  function getDepth(node) {
    if (!node.parent) return 0;
    const parent = nodeMap[node.parent];
    return parent ? getDepth(parent) + 1 : 0;
  }
  nodes.forEach(node => node.depth = getDepth(node));
}

const SEPARATION_DIST = 180;
const ALIGNMENT_DIST = 180;
const COHESION_DIST = 180;
const SEPARATION_FORCE = 0.18;
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
      if (dist < SEPARATION_DIST && dist > 0.01) {
        sepX -= dx / dist;
        sepY -= dy / dist;
        sepCount++;
      }
      if (dist < ALIGNMENT_DIST) {
        aliX += other.vx;
        aliY += other.vy;
        aliCount++;
      }
      if (dist < COHESION_DIST) {
        cohX += other.x;
        cohY += other.y;
        cohCount++;
      }
    });

    if (sepCount > 0) {
      sepX /= sepCount;
      sepY /= sepCount;
      node.vx += sepX * SEPARATION_FORCE;
      node.vy += sepY * SEPARATION_FORCE;
    }
    if (aliCount > 0) {
      aliX /= aliCount;
      aliY /= aliCount;
      node.vx += (aliX - node.vx) * ALIGNMENT_FORCE;
      node.vy += (aliY - node.vy) * ALIGNMENT_FORCE;
    }
    if (cohCount > 0) {
      cohX /= cohCount;
      cohY /= cohCount;
      node.vx += (cohX - node.x) * COHESION_FORCE * 0.01;
      node.vy += (cohY - node.y) * COHESION_FORCE * 0.01;
    }

    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > MAX_SPEED) {
      node.vx = (node.vx / speed) * MAX_SPEED;
      node.vy = (node.vy / speed) * MAX_SPEED;
    }

    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0) { node.x = 0; node.vx *= -1; }
    if (node.x > width - 120) { node.x = width - 120; node.vx *= -1; }
    if (node.y < 0) { node.y = 0; node.vy *= -1; }
    if (node.y > height - 64) { node.y = height - 64; node.vy *= -1; }
  });

  drawNodes(nodes, mindmap, width, height, window.selectedNodeId);
  requestAnimationFrame(animate);
}

function showNodeDescription(node) {
  const oldPopup = document.getElementById('node-description-popup');
  if (oldPopup) oldPopup.remove();

  const rect = mindmap.getBoundingClientRect();

  const popup = document.createElement('div');
  popup.id = 'node-description-popup';
  popup.textContent = node.description || '설명이 없습니다.';
  Object.assign(popup.style, {
    position: 'absolute',
    top: `${rect.top + node._centerY + 40}px`,
    left: `${rect.left + node._centerX}px`,
    transform: 'translateX(-50%)',
    background: 'white',
    padding: '0.8rem 1.2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 10000,
    maxWidth: '280px',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: '1.4',
    fontFamily: 'inherit'
  });

  document.body.appendChild(popup);
}

// 전역 함수 등록
window.showNodeDescription = showNodeDescription;

// 바깥 클릭 시 팝업 제거
document.addEventListener('click', () => {
  const popup = document.getElementById('node-description-popup');
  if (popup) popup.remove();
});

document.addEventListener('DOMContentLoaded', () => {
  assignNodeDepths();
  initNodePositions();
  drawNodes(nodes, mindmap, width, height, window.selectedNodeId);
  animate();
  document.addEventListener('mousemove', e => handleMouseMove(e, nodes));
  window.addEventListener('resize', () => {
    initNodePositions();
  });
});

window.showNodeDescription = function(node) {
  const popup = document.getElementById('node-description-popup');
  if (!popup) return;
  popup.innerHTML = `
    <strong>${node.label}</strong><br>
    <div style="margin-top:0.5em;">${node.description || '설명이 없습니다.'}</div>
    <button id="close-desc-popup" style="margin-top:1em;">닫기</button>
  `;
  // 중앙에 위치시키기
  popup.style.display = 'block';
  popup.style.left = '50%';
  popup.style.top = '20%';

  // 닫기 버튼
  document.getElementById('close-desc-popup').onclick = () => {
    popup.style.display = 'none';
  };

  // 바깥 클릭 시 닫기
  setTimeout(() => {
    document.body.addEventListener('mousedown', function handler(e) {
      if (!popup.contains(e.target)) {
        popup.style.display = 'none';
        document.body.removeEventListener('mousedown', handler);
      }
    });
  }, 0);
};