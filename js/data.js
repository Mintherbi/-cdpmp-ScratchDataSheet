export const nodes = [
  { id: 1, label: 'Main', link: 'index.html', main: true, img: 'assets/images/Scratchlogo.svg' },
  { id: 11, label: 'People', link: 'html/People/People.html', parent: 1 },
  { id: 12, label: 'Statistics', link: 'html/Statistics.html', parent: 1 },
  { id: 13, label: 'Bibliography', link: 'html/Bibliography.html', parent: 1 },

  { id: 111, label: 'Mitchel Resnick', link: '#', parent: 11 }
  { id: 112, label: 'Natalie Rusk', link: '#', parent: 11 },
  { id: 113, label: 'Eric Schilling', link:'', parent: 11 },

  { id: 121, label: 'Age Distribution of New Scratch Users', link: 'html/Statistics/AgeDistribution.html', parent: 12 },
  { id: 122, label: 'Monthly Active Users', link: 'html/Statistics/MonthlyActiveUsers.html', parent: 12 }
];