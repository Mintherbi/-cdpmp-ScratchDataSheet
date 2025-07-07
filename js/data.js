// 📁 data.js
export const nodes = [
  { id: 1, label: 'Main', link: 'index.html', main: true, img: 'assets/images/Scratchlogo.svg', 
    description: 'Scratch is the world\'s most popular coding community for kids. Millions of kids around the world are using Scratch to program their own interactive stories, games, and animations—and share their creations in an active online community. In the process, they are learning to think creatively, reason systematically, and work collaboratively, while also learning important mathematical and computational ideas. In the past year, more than 20 million people created projects with Scratch. (For information on who has contributed to Scratch, see the Scratch Credits page.)' },

  { id: 11, label: 'People', link: 'html/People/People.html', parent: 1, 
    description: 'Scratch 프로젝트에 기여한 주요 인물들.' },
  { id: 12, label: 'Statistics', link: 'html/Statistics.html', parent: 1, 
    description: 'Scratch의 통계 및 데이터.' },
  { id: 13, label: 'Bibliography', link: 'html/Bibliography.html', parent: 1, 
    description: 'Scratch 관련 참고문헌 및 자료.' },


  { id: 111, label: 'Mitchel Resnick', link: '#', parent: 11, 
    description: 'Mitchel Resnick, LEGO Papert Professor of Learning Research at the MIT Media Lab, develops new technologies and activities to engage people (particularly children) in creative learning experiences.His Lifelong Kindergarten research group developed the Scratch programming software and online community , used by millions of young people around the world. The group has also collaborated with the LEGO Company on the development of new educational ideas and products, including the LEGO Mindstorms robotics kits. Resnick co-founded the Computer Clubhouse project, an international network of more than 100 after-school learning centers where youth from low-income communities learn to express themselves creatively with new technologies. Resnick earned a BA in physics at Princeton University (1978) and MS and PhD degrees in computer science at MIT (1988, 1992). He worked as a science-technology journalist from 1978 to 1983.' + 'Resnick is author of the book Lifelong Kindergarten: Cultivating Creativity through Projects, Passion, Peers, and Play, which won the PROSE award for Education Practice in 2018. He is also author of Turtles, Termites, and Traffic Jams (1994), co-editor of Constructionism in Practice (1996), and co-author of Adventures in Modeling (2001) and The Official ScratchJr Book (2015). He was awarded the McGraw Prize in Education (2011), the AACE EdMedia Pioneer Award (2013), the ISTE Making IT Happen Award (2018), the LEGO Prize (2021), and the SIGCSE Award for Outstanding Contribution to Computer Science Education (2025). ' },

  { id: 112, label: 'Natalie Rusk', link: '#', parent: 11, 
    description: 'Natalie Rusk, PhD,  is one of the creators of the  Scratch programming language and a founder of the Computer Clubhouse.  She is a research scientist in the Lifelong Kindergarten group and has collaborated for 30 years with Professor Mitchel Resnick on the development of Scratch and other international educational  initiatives.' + 'Natalie is guiding the development of OctoStudio, a new mobile phone app designed to make creating with code more accessible for children, families, and educators around the world. ' + 'Her research focuses on designing learning environments that enable young people to build on their interests and ideas.  She is lead author of the Scratch Coding Cards and editor of the book, Start Making! A Guide to Engaging Young People in Maker Activities. ' + 'She  earned a PhD in child development from Tufts University and a Master\'s in Technology in Education from Harvard Graduate School of Education. ' },

  { id: 113, label: 'Eric Schilling', link:'', parent: 11, 
    description: 'Scratch 개발자.' },


  { id: 121, label: 'Age Distribution of New Scratch Users', link: 'html/Statistics/AgeDistribution.html', parent: 12, 
    description: 'Age Distribution of New Scratch Users' },
    
  { id: 122, label: 'Monthly Active Users', 
    link: 'html/Statistics/MonthlyActiveUsers.html', parent: 12, description: 'Monthly Active Users' }
];
