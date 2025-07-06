export const nodes = [
  { id: 1, label: 'Scratch', link: 'index.html', main: true, img: 'assets/images/Scratchlogo.svg', description: 'Scratch는 MIT 미디어랩에서 개발한 블록 기반 프로그래밍 언어 및 커뮤니티입니다.' },
  { id: 11, label: 'People', link: 'html/People/People.html', parent: 1, description: 'Scratch 프로젝트에 기여한 주요 인물들.' },
  { id: 12, label: 'Statistics', link: 'html/Statistics.html', parent: 1, description: 'Scratch의 통계 및 데이터.' },
  { id: 13, label: 'Bibliography', link: 'html/Bibliography.html', parent: 1, description: 'Scratch 관련 참고문헌 및 자료.' },

  { id: 111, label: 'Mitchel Resnick', link: '#', parent: 11, description: 'MIT 교수, Scratch 창시자.' },
  { id: 112, label: 'Natalie Rusk', link: '#', parent: 11, description: 'Scratch 개발팀 핵심 멤버.' },
  { id: 113, label: 'Eric Schilling', link:'', parent: 11, description: 'Scratch 개발자.' },

  { id: 121, label: 'Age Distribution of New Scratch Users', link: 'html/Statistics/AgeDistribution.html', parent: 12, description: '신규 Scratch 사용자의 연령 분포.' },
  { id: 122, label: 'Monthly Active Users', link: 'html/Statistics/MonthlyActiveUsers.html', parent: 12, description: '월간 활성 사용자 수.' }
];