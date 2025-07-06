export function drawNodes(nodes, container, width, height) {
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
  container.appendChild(svg);

  nodes.forEach(node => {
    const div = document.createElement('div');
    div.className = 'mindmap-node' + (node.main ? ' main' : '');
    div.style.left = node.x + 'px';
    div.style.top = node.y + 'px';

    if (node.main && node.img) {
      const img = document.createElement('img');
      img.src = node.img;
      img.alt = node.label;
      Object.assign(img.style, {
        width: '90px',
        height: '90px',
        display: 'block',
        margin: '0 auto'
      });
      div.appendChild(img);

      const label = document.createElement('div');
      label.textContent = node.label;
      Object.assign(label.style, {
        marginTop: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold'
      });
      div.appendChild(label);
    } else {
      const label = document.createElement('div');
      label.textContent = node.label;
      Object.assign(label.style, {
        fontSize: '1.1rem',
        fontWeight: 'bold'
      });
      div.appendChild(label);
    }

    div.onclick = (e) => {
      e.stopPropagation();
      if (node.link) window.location.assign(node.link);
    };
    container.appendChild(div);
    node._element = div;
  });

  nodes.forEach(node => {
    if (node.parent) {
      const parentNode = nodes.find(n => n.id === node.parent);
      if (parentNode && node._element && parentNode._element) {
        const parentRect = parentNode._element.getBoundingClientRect();
        const nodeRect = node._element.getBoundingClientRect();
        const x1 = node.x + parentRect.width / 2;
        const y1 = node.y + parentRect.height / 2;
        const x2 = parentNode.x + nodeRect.width / 2;
        const y2 = parentNode.y + nodeRect.height / 2;
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        let opacity = 1 - Math.min(1, Math.max(0.2, dist / 400)) + 0.2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#222');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', opacity.toString());
        if (node.parent !== 1) {
          line.setAttribute('stroke-dasharray', '6,6');
        }
        svg.appendChild(line);
      }
    }
  });
}

export function handleMouseMove(e, nodes) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  nodes.forEach(node => {
    if (node.main && node._element) {
      const dx = node.x + 60 - mouseX;
      const dy = node.y + 32 - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        node._element.classList.add('highlight');
      } else {
        node._element.classList.remove('highlight');
      }
    }
  });
}
