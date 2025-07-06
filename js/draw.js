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
  container.appendChild(svg);

  nodes.forEach(node => {
    let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    let yOffset = 0;
    if (node.main && node.img) {
      // 이미지 노드
      const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      img.setAttribute('href', node.img);
      img.setAttribute('x', node.x);
      img.setAttribute('y', node.y);
      img.setAttribute('width', 90);
      img.setAttribute('height', 90);
      group.appendChild(img);
      yOffset = 50; // 이미지와 텍스트 간격을 더 가깝게
    }
    // 텍스트 노드
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = node.label;
    text.setAttribute('x', node.x + (node.main && node.img ? 45 : 0));
    text.setAttribute('y', node.y + yOffset);
    text.setAttribute('text-anchor', node.main && node.img ? 'middle' : 'start');
    // id 자리수에 따라 글자 크기 조정 (최대 1.5rem, 최소 0.7rem)
    const idLength = String(node.id).length;
    const fontSize = Math.max(1.5 - (idLength - 1) * 0.2, 0.7);
    text.setAttribute('font-size', fontSize + 'rem');
    node._fontSize = fontSize; // 원래 폰트 크기 저장
    text.setAttribute('font-weight', 'bold');
    text.style.cursor = 'pointer';
    text.onclick = (e) => {
      e.stopPropagation();
      // 선택된 노드 id를 전역에 저장
      window.selectedNodeId = node.id;
      // 설명 표시
      const descDiv = document.getElementById('node-desc');
      if (descDiv) {
        descDiv.textContent = node.description || '설명이 없습니다.';
      }
      // 기존 링크 이동 기능은 Ctrl+클릭 시에만 동작
      if (node.link && e.ctrlKey) {
        window.location.assign(node.link);
      }
    };
  // 선택된 노드 설명 항상 표시
  if (selectedNodeId) {
    const selNode = nodes.find(n => n.id === selectedNodeId);
    const descDiv = document.getElementById('node-desc');
    if (selNode && descDiv) {
      descDiv.textContent = selNode.description || '설명이 없습니다.';
    }
  }
    group.appendChild(text);
    svg.appendChild(group);
    node._element = text; // 중심 좌표 계산용
  });

  nodes.forEach(node => {
    if (node.parent) {
      const parentNode = nodes.find(n => n.id === node.parent);
      if (parentNode && node._element && parentNode._element) {
        // 각 노드의 중심 좌표 계산
        const nodeRect = node._element.getBoundingClientRect();
        const parentRect = parentNode._element.getBoundingClientRect();
        // container 기준 좌표로 변환
        const containerRect = container.getBoundingClientRect();
        const x1 = nodeRect.left - containerRect.left + nodeRect.width / 2;
        const y1 = nodeRect.top - containerRect.top + nodeRect.height / 2;
        const x2 = parentRect.left - containerRect.left + parentRect.width / 2;
        const y2 = parentRect.top - containerRect.top + parentRect.height / 2;
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
    if (node._element) {
      // 중심 좌표 계산 (이미지+텍스트 노드는 이미지 중심, 그 외는 텍스트 좌상단 기준)
      let centerX = node.x;
      let centerY = node.y;
      if (node.main && node.img) {
        centerX = node.x + 45; // 이미지 중심
        centerY = node.y + 45;
      }
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
