// Periodic Sanctum - Periodic Table practice planets
// Topics: electron configuration, periodic trends, atomic/ionic radius, IE, EA, EN

export const periodicSanctumPlanets = [
  // ==================== PLANET 1: Element Trials ====================
  {
    id: 'element-trials',
    name: 'Element Trials',
    constellationId: 'periodic-sanctum',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'ps1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'What is the electronic configuration of the element with atomic number 26 (Iron)?',
        options: [
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 3d\u2078',
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 4s\u00B2 3d\u2076',
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 3d\u2076 4s\u00B2',
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 4s\u00B2 4p\u2076'
        ],
        correctIndex: 1,
        hint: 'Fill orbitals using the Aufbau principle: 1s, 2s, 2p, 3s, 3p, 4s, 3d... The 4s orbital fills before 3d.',
        steps: [
          'Z = 26: fill orbitals in order of increasing energy',
          '1s\u00B2 (2), 2s\u00B2 (4), 2p\u2076 (10), 3s\u00B2 (12), 3p\u2076 (18), 4s\u00B2 (20), 3d\u2076 (26)',
          'Configuration: [Ar] 4s\u00B2 3d\u2076',
          'Writing in order of principal quantum number: 1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 3d\u2076 4s\u00B2',
          'But the standard convention writes the filling order: ...4s\u00B2 3d\u2076'
        ],
        solution: 'Fe (Z=26): [Ar] 4s\u00B2 3d\u2076. Written in filling order: 1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 4s\u00B2 3d\u2076.',
        concepts: ['electron-configuration']
      },
      {
        id: 'ps1-2',
        type: 'mcq',
        difficulty: 2,
        text: 'Which of the following elements has an exceptional (anomalous) electron configuration?',
        options: ['Fe (Z=26)', 'Cr (Z=24)', 'Co (Z=27)', 'Mn (Z=25)'],
        correctIndex: 1,
        hint: 'Some elements prefer a half-filled or fully-filled d subshell for extra stability.',
        steps: [
          'Expected Cr: [Ar] 4s\u00B2 3d\u2074',
          'Actual Cr: [Ar] 4s\u00B9 3d\u2075 (half-filled d for extra stability)',
          'Fe, Co, and Mn follow the regular Aufbau filling order'
        ],
        solution: 'Chromium (Cr) has the anomalous configuration [Ar] 4s\u00B9 3d\u2075 instead of the expected [Ar] 4s\u00B2 3d\u2074. A half-filled d subshell (3d\u2075) provides extra stability due to exchange energy.',
        concepts: ['electron-configuration', 'anomalous-configuration']
      },
      {
        id: 'ps1-3',
        type: 'match',
        difficulty: 2,
        text: 'Match each set of quantum numbers (n, l, m_l, m_s) to the correct orbital/electron description.',
        leftColumn: [
          'n=3, l=2, m_l=0',
          'n=2, l=1, m_l=-1',
          'n=4, l=0, m_l=0',
          'n=3, l=1, m_l=+1'
        ],
        rightColumn: [
          '3p orbital',
          '4s orbital',
          '3d orbital',
          '2p orbital'
        ],
        correctMatches: { 0: 2, 1: 3, 2: 1, 3: 0 },
        hint: 'l = 0 is s, l = 1 is p, l = 2 is d, l = 3 is f. The principal quantum number n gives the shell.',
        solution: 'n=3,l=2 \u2192 3d. n=2,l=1 \u2192 2p. n=4,l=0 \u2192 4s. n=3,l=1 \u2192 3p.',
        concepts: ['quantum-numbers']
      },
      {
        id: 'ps1-4',
        type: 'numerical',
        difficulty: 2,
        text: 'What is the maximum number of electrons that can be accommodated in a shell with principal quantum number n = 3?',
        correctAnswer: 18,
        unit: 'electrons',
        hint: 'The maximum number of electrons in a shell is 2n\u00B2.',
        steps: [
          'Maximum electrons in shell n = 2n\u00B2',
          'For n = 3: 2(3)\u00B2 = 2(9) = 18',
          'These fill 3s (2), 3p (6), and 3d (10) subshells'
        ],
        solution: 'Maximum electrons = 2n\u00B2 = 2(9) = 18. Shell n=3 has s(2) + p(6) + d(10) = 18 electrons.',
        concepts: ['quantum-numbers', 'electron-configuration']
      },
      {
        id: 'ps1-5',
        type: 'mcq',
        difficulty: 3,
        text: 'An element has the electronic configuration [Ne] 3s\u00B2 3p\u00B3. What is its group and period in the periodic table?',
        options: [
          'Period 3, Group 13',
          'Period 3, Group 15',
          'Period 3, Group 5',
          'Period 2, Group 15'
        ],
        correctIndex: 1,
        hint: 'The period = highest principal quantum number. For p-block elements, group number = 12 + number of electrons in the outermost s and p orbitals.',
        steps: [
          'Highest n = 3, so Period = 3',
          'Outermost electrons: 3s\u00B2 3p\u00B3 = 5 valence electrons',
          'For p-block: group = 10 + valence electrons = 15',
          'This is Phosphorus (P), Group 15'
        ],
        solution: '[Ne] 3s\u00B2 3p\u00B3 is Phosphorus (Z=15). Period 3 (n=3), Group 15 (5 valence electrons in s+p of the outermost shell).',
        concepts: ['electron-configuration', 'periodic-table']
      },
      {
        id: 'ps1-6',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following statements about the Aufbau principle, Hund\'s rule, and Pauli exclusion principle are correct?',
        options: [
          'Aufbau: electrons fill lower energy orbitals first',
          'Hund\'s rule: electrons in degenerate orbitals prefer to pair up first',
          'Pauli exclusion: no two electrons in an atom can have the same four quantum numbers',
          'Hund\'s rule: electrons occupy degenerate orbitals singly with parallel spins before pairing',
          'Aufbau: 3d fills before 4s'
        ],
        correctIndices: [0, 2, 3],
        hint: 'Hund\'s rule says electrons prefer to be unpaired (with parallel spins) in degenerate orbitals. The Aufbau order has 4s filling before 3d.',
        solution: '(A) Correct: Aufbau means "building up" - fill from lowest energy. (B) Wrong: Hund says UNPAIR first. (C) Correct: Pauli exclusion principle. (D) Correct: this is the proper statement of Hund\'s rule. (E) Wrong: 4s fills before 3d in the Aufbau order.',
        concepts: ['electron-configuration', 'quantum-numbers']
      },
      {
        id: 'ps1-7',
        type: 'mcq',
        difficulty: 2,
        text: 'How many unpaired electrons are present in the ground state of nitrogen (Z = 7)?',
        options: ['0', '1', '2', '3'],
        correctIndex: 3,
        hint: 'Write the configuration and apply Hund\'s rule to the 2p subshell.',
        steps: [
          'N: 1s\u00B2 2s\u00B2 2p\u00B3',
          'The 2p subshell has 3 orbitals (2p_x, 2p_y, 2p_z)',
          'By Hund\'s rule, 3 electrons occupy the 3 orbitals singly with parallel spins',
          'All 3 are unpaired'
        ],
        solution: 'N: [He] 2s\u00B2 2p\u00B3. By Hund\'s rule, the three 2p electrons each occupy a separate orbital with parallel spins. So 3 unpaired electrons.',
        concepts: ['electron-configuration', 'hunds-rule']
      }
    ]
  },

  // ==================== PLANET 2: Trend Analysis ====================
  {
    id: 'trend-analysis',
    name: 'Trend Analysis',
    constellationId: 'periodic-sanctum',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'ps2-1',
        type: 'mcq',
        difficulty: 2,
        text: 'Which of the following has the largest atomic radius?',
        options: ['Li', 'Na', 'K', 'Rb'],
        correctIndex: 3,
        hint: 'Atomic radius increases as you go DOWN a group in the periodic table.',
        steps: [
          'All four are in Group 1 (alkali metals)',
          'Atomic radius increases down a group as new shells are added',
          'Order: Li < Na < K < Rb',
          'Rb is the largest'
        ],
        solution: 'Atomic radius increases down a group due to the addition of new electron shells. Rb (Period 5) > K (Period 4) > Na (Period 3) > Li (Period 2).',
        concepts: ['periodic-trends', 'atomic-radius']
      },
      {
        id: 'ps2-2',
        type: 'mcq',
        difficulty: 3,
        text: 'Arrange the following in order of increasing first ionization energy: Na, Mg, Al, Si.',
        options: [
          'Na < Al < Mg < Si',
          'Na < Mg < Al < Si',
          'Al < Na < Mg < Si',
          'Na < Al < Si < Mg'
        ],
        correctIndex: 0,
        hint: 'IE generally increases across a period, but there is an anomaly between Mg and Al. Al has a lower IE than Mg because the 3p electron is easier to remove than a 3s electron.',
        steps: [
          'General trend: IE increases across a period',
          'But Mg (3s\u00B2) has higher IE than Al (3s\u00B2 3p\u00B9)',
          'Removing a 3p electron (Al) requires less energy than a paired 3s electron (Mg)',
          'Order: Na < Al < Mg < Si'
        ],
        solution: 'Na < Al < Mg < Si. Aluminum has a lower IE than Mg because its outermost electron is in a higher-energy 3p orbital, which is easier to remove than a 3s electron.',
        concepts: ['ionization-energy', 'periodic-trends']
      },
      {
        id: 'ps2-3',
        type: 'match',
        difficulty: 3,
        text: 'Match each periodic trend with its correct behavior across a period (left to right).',
        leftColumn: [
          'Atomic radius',
          'Ionization energy',
          'Electronegativity',
          'Electron affinity (magnitude)'
        ],
        rightColumn: [
          'Generally increases',
          'Generally decreases',
          'Generally increases (with exceptions)',
          'Generally increases (with exceptions)'
        ],
        correctMatches: { 0: 1, 1: 0, 2: 2, 3: 3 },
        hint: 'Across a period, nuclear charge increases. This pulls electrons closer (smaller radius) and holds them tighter (higher IE and EN).',
        solution: 'Across a period: atomic radius decreases (more protons pull electrons in), IE increases, EN increases, and EA magnitude generally increases (halogens have the highest). All due to increasing effective nuclear charge.',
        concepts: ['periodic-trends']
      },
      {
        id: 'ps2-4',
        type: 'mcq',
        difficulty: 3,
        text: 'Which of the following ions is the smallest in size?',
        options: ['O\u00B2\u207B', 'F\u207B', 'Na\u207A', 'Mg\u00B2\u207A'],
        correctIndex: 3,
        hint: 'These are all isoelectronic (10 electrons each). For isoelectronic species, the one with the most protons is the smallest.',
        steps: [
          'O\u00B2\u207B: 10 electrons, 8 protons',
          'F\u207B: 10 electrons, 9 protons',
          'Na\u207A: 10 electrons, 11 protons',
          'Mg\u00B2\u207A: 10 electrons, 12 protons',
          'More protons pull the same number of electrons closer',
          'Smallest: Mg\u00B2\u207A (most protons)'
        ],
        solution: 'All have 10 electrons (isoelectronic with Ne). More protons = smaller radius. Order: Mg\u00B2\u207A < Na\u207A < F\u207B < O\u00B2\u207B. Mg\u00B2\u207A is the smallest.',
        concepts: ['ionic-radius', 'isoelectronic']
      },
      {
        id: 'ps2-5',
        type: 'mcq',
        difficulty: 4,
        text: 'The second ionization energy of which element is anomalously high compared to its neighbors in Period 3?',
        options: ['Na', 'Mg', 'Al', 'Si'],
        correctIndex: 0,
        hint: 'The second IE is anomalously high when removing the second electron requires breaking into a noble gas core.',
        steps: [
          'Na: [Ne] 3s\u00B9. After removing the first electron, Na\u207A has the noble gas configuration [Ne]',
          'Removing the second electron from Na\u207A means breaking the stable [Ne] core',
          'This requires a huge amount of energy',
          'Na has an abnormally high IE\u2082 compared to Mg and Al'
        ],
        solution: 'Na has only 1 valence electron. After its removal (Na\u207A has [Ne] configuration), the second ionization requires removing a core electron from the stable noble gas shell, making IE\u2082 extremely high.',
        concepts: ['ionization-energy']
      },
      {
        id: 'ps2-6',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following statements about electron affinity are correct?',
        options: [
          'Noble gases have very low (near zero or positive) electron affinities',
          'Chlorine has a more negative electron affinity than fluorine',
          'Elements with completely filled subshells have low electron affinities',
          'Electron affinity always increases across a period',
          'Second electron affinity is always endothermic (positive)'
        ],
        correctIndices: [0, 1, 2, 4],
        hint: 'Fluorine\'s small size causes electron-electron repulsion, making its EA less negative than Cl. Noble gases and filled-shell elements resist gaining electrons.',
        solution: '(A) Noble gases have stable configurations, resist gaining electrons. (B) F is so small that added electron faces repulsion; Cl has higher EA. (C) Filled subshells (like Be: 2s\u00B2 or N: 2p\u00B3) resist extra electrons. (D) Wrong: there are exceptions (N, Be, Ne). (E) Correct: adding a second electron to an already negative ion always requires energy.',
        concepts: ['electron-affinity', 'periodic-trends']
      },
      {
        id: 'ps2-7',
        type: 'mcq',
        difficulty: 3,
        text: 'Which element in Period 3 has the highest electronegativity?',
        options: ['Na', 'Al', 'P', 'Cl'],
        correctIndex: 3,
        hint: 'Electronegativity increases across a period (left to right) and decreases down a group.',
        steps: [
          'Electronegativity increases across a period due to increasing Z_eff',
          'In Period 3: Na < Mg < Al < Si < P < S < Cl',
          'Cl (Group 17) has the highest EN in Period 3',
          '(Ar is a noble gas and is not assigned an EN value on the Pauling scale)'
        ],
        solution: 'Cl has the highest electronegativity in Period 3 (3.16 on the Pauling scale). EN increases across a period due to increasing effective nuclear charge.',
        concepts: ['electronegativity', 'periodic-trends']
      },
      {
        id: 'ps2-8',
        type: 'numerical',
        difficulty: 2,
        text: 'How many elements are present in the 4th period of the periodic table?',
        correctAnswer: 18,
        unit: 'elements',
        hint: 'The 4th period includes 4s, 3d, and 4p subshells. Count the total capacity.',
        steps: [
          '4s subshell: 2 electrons (K, Ca)',
          '3d subshell: 10 electrons (Sc through Zn)',
          '4p subshell: 6 electrons (Ga through Kr)',
          'Total: 2 + 10 + 6 = 18 elements'
        ],
        solution: 'Period 4 fills the 4s (2), 3d (10), and 4p (6) subshells = 18 elements total (from K to Kr).',
        concepts: ['periodic-table']
      }
    ]
  }
];
