// ✅ draw.js
import { getColorByDepth } from './utils.js';

export function drawNodes(nodes, container, width, height, selectedNodeId) {
  container.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.assign(svg.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '0'
  });
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);
  container.appendChild(svg);

  function getRadiusByDepth(depth) {
    return 80 - depth * 20;
  }

  function createBlobbyPath(x1, y1, x2, y2, width1, width2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const w1 = width1 / 2;
    const w2 = width2 / 2;
    const wm = Math.min(w1, w2) * 0.01;
    const x1a = x1 + -sin * w1;
    const y1a = y1 +  cos * w1;
    const x1b = x1 +  sin * w1;
    const y1b = y1 -  cos * w1;
    const x2a = x2 + -sin * w2;
    const y2a = y2 +  cos * w2;
    const x2b = x2 +  sin * w2;
    const y2b = y2 -  cos * w2;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const mxa = mx + -sin * wm;
    const mya = my +  cos * wm;
    const mxb = mx +  sin * wm;
    const myb = my -  cos * wm;
    return `
      M ${x1a},${y1a}
      Q ${mxa},${mya} ${x2a},${y2a}
      L ${x2b},${y2b}
      Q ${mxb},${myb} ${x1b},${y1b}
      Z
    `;
  }

  const pathsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  pathsGroup.setAttribute('style', 'z-index: 0');
  svg.appendChild(pathsGroup);

  const circlesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  circlesGroup.setAttribute('style', 'z-index: 1');
  svg.appendChild(circlesGroup);

  const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  labelsGroup.setAttribute('style', 'z-index: 2');
  svg.appendChild(labelsGroup);

  nodes.forEach(node => {
    const radius = getRadiusByDepth(node.depth);
    const cx = node.x + (node.main && node.img ? 45 : 0);
    const cy = node.y + (node.main && node.img ? 45 : 0);
    node._centerX = cx;
    node._centerY = cy;
    node._radius = radius;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = node.label;
    text.setAttribute('x', cx);
    text.setAttribute('y', cy + 4);
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('text-anchor', 'middle');
    const idLength = String(node.id).length;
    const fontSize = Math.max(1.5 - (idLength - 1) * 0.2, 0.7);
    text.setAttribute('font-size', fontSize + 'rem');
    node._fontSize = fontSize;

    text.setAttribute('font-weight', 'bold');
    text.style.cursor = 'pointer';
    text.style.pointerEvents = 'auto';  // ✅ 여기에 추가!
    text.onclick = (e) => {
      e.stopPropagation();
      window.selectedNodeId = node.id;
      window.showNodeDescription?.(node);
};


    labelsGroup.appendChild(text);
    node._element = text;
  });

  // sort by depth descending so children are drawn below
  const sortedNodes = [...nodes].sort((a, b) => b.depth - a.depth);

  // Step 1: draw parent node circles
  const parentNodes = [...nodes].filter(n => nodes.some(c => c.parent === n.id));
  parentNodes.forEach(node => {
    const radius = getRadiusByDepth(node.depth);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node._centerX);
    circle.setAttribute('cy', node._centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', getColorByDepth(node.depth));
    circlesGroup.appendChild(circle);
  });

  // Step 2: draw connections between parent and child
  sortedNodes.forEach(node => {
    if (node.parent) {
      const parentNode = nodes.find(n => n.id === node.parent);
      if (parentNode && node._centerX && node._centerY && parentNode._centerX && parentNode._centerY) {
        const x1 = node._centerX;
        const y1 = node._centerY;
        const x2 = parentNode._centerX;
        const y2 = parentNode._centerY;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;
        const id = `grad-${node.depth}-${parentNode.depth}-${node.id}-${parentNode.id}`;
        if (!document.getElementById(id)) {
          const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
          grad.id = id;
          grad.setAttribute('x1', `${50 - ux * 50}%`);
          grad.setAttribute('y1', `${50 - uy * 50}%`);
          grad.setAttribute('x2', `${50 + ux * 50}%`);
          grad.setAttribute('y2', `${50 + uy * 50}%`);
          const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          stop1.setAttribute('offset', '0%');
          stop1.setAttribute('stop-color', getColorByDepth(node.depth));
          const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
          stop2.setAttribute('offset', '100%');
          stop2.setAttribute('stop-color', getColorByDepth(parentNode.depth));
          grad.appendChild(stop1);
          grad.appendChild(stop2);
          svg.querySelector('defs').appendChild(grad);
        }
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', createBlobbyPath(x1, y1, x2, y2, node._radius * 2, parentNode._radius * 2));
        path.setAttribute('fill', `url(#${id})`);
        pathsGroup.appendChild(path);
      }
    }
  });

  // Step 3: draw child node circles on top
  const childNodes = [...nodes].filter(n => n.parent);
  childNodes.forEach(node => {
    const radius = getRadiusByDepth(node.depth);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node._centerX);
    circle.setAttribute('cy', node._centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', getColorByDepth(node.depth));
    circlesGroup.appendChild(circle);
  });
}

export function handleMouseMove(e, nodes) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  nodes.forEach(node => {
    if (node._element) {
      let centerX = node._centerX ?? node.x;
      let centerY = node._centerY ?? node.y;
      const bbox = node._element.getBBox ? node._element.getBBox() : { width: 0, height: 0 };
      if (!(node.main && node.img)) {
        centerX = node.x + bbox.width / 2;
        centerY = node.y + bbox.height / 2;
      }
      const dx = centerX - mouseX;
      const dy = centerY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        node._element.setAttribute('font-size', (node._fontSize * 1.5) + 'rem');
      } else {
        node._element.setAttribute('font-size', node._fontSize + 'rem');
      }
    }
  });
}
