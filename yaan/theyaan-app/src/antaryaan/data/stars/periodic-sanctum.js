export const periodicSanctumStars = [
  // ========== STAR 1: Atomic Architecture ==========
  {
    id: 'atomic-architecture',
    name: 'Atomic Architecture',
    constellationId: 'periodic-sanctum',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['atomic-number', 'mass-number', 'isotopes', 'isobars', 'subatomic-particles'],
    blocks: [
      {
        type: 'text',
        content: 'Every element in the universe is defined by one number: how many protons sit in its nucleus. This is the **atomic number (Z)**, and it is the identity card of an element. Change Z and you change the element entirely.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'electron-shell',
        title: 'Atomic Structure Explorer',
        description: 'Select any element and watch its atom build up: protons and neutrons fill the nucleus while electrons populate shells. Toggle between neutral atoms and common ions to see how electron count changes.',
        controls: [],
        discoveries: [
          { id: 'proton-identity', label: 'Changing the proton count changes the element', hint: 'Try moving from element 11 to element 12' },
          { id: 'neutron-isotope', label: 'Changing neutrons creates isotopes of the same element', hint: 'Look at Carbon-12 vs Carbon-14' },
          { id: 'ion-electrons', label: 'Ions have a different electron count than the neutral atom', hint: 'Compare Na and Na\u207A' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'formula',
        title: 'Atomic Notation',
        formulas: [
          { label: 'Atomic Number', formula: 'Z = number of protons', note: 'Defines the element' },
          { label: 'Mass Number', formula: 'A = Z + N', note: 'N = number of neutrons' },
          { label: 'Notation', formula: '\u00B2\u00B3Na means Z=11, A=23', note: 'So 23-11 = 12 neutrons' }
        ]
      },
      {
        type: 'text',
        content: '**Subatomic Particles:**\n- **Proton (p):** positive charge (+1), mass \u2248 1 amu, found in nucleus\n- **Neutron (n):** no charge (0), mass \u2248 1 amu, found in nucleus\n- **Electron (e):** negative charge (-1), mass \u2248 1/1836 amu, found in electron cloud\n\nIn a neutral atom: number of electrons = number of protons = Z',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'An atom has 17 protons and 18 neutrons. What is its mass number?',
        correctAnswer: 35,
        unit: '',
        explanation: 'A = Z + N = 17 + 18 = 35. This is Chlorine-35.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'An ion of oxygen (Z=8) has a charge of -2. How many electrons does it have?',
        correctAnswer: 10,
        unit: '',
        explanation: 'Neutral O has 8 electrons. A -2 charge means 2 extra electrons: 8 + 2 = 10 electrons.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'aa-q1',
            question: 'Which of the following are isotopes of each other?',
            type: 'mcq',
            options: ['C-12 and N-14', 'C-12 and C-14', 'N-14 and C-14', 'O-16 and S-16'],
            correctAnswer: 1,
            explanation: 'Isotopes have the same atomic number (same element). C-12 and C-14 are both carbon (Z=6).'
          },
          {
            id: 'aa-q2',
            question: 'An atom of phosphorus (Z=15, A=31) has how many neutrons?',
            type: 'number',
            correctAnswer: 16,
            unit: '',
            explanation: 'N = A - Z = 31 - 15 = 16 neutrons.'
          },
          {
            id: 'aa-q3',
            question: 'Fe\u00B3\u207A has atomic number 26. How many electrons does it have?',
            type: 'number',
            correctAnswer: 23,
            unit: '',
            explanation: 'Fe has 26 electrons normally. Fe\u00B3\u207A has lost 3 electrons: 26 - 3 = 23.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Quantum Numbers ==========
  {
    id: 'quantum-numbers',
    name: 'Quantum Numbers',
    constellationId: 'periodic-sanctum',
    order: 2,
    duration: 10,
    xp: 20,
    concepts: ['principal-quantum-number', 'azimuthal-quantum-number', 'magnetic-quantum-number', 'spin-quantum-number', 'orbitals'],
    blocks: [
      {
        type: 'text',
        content: 'Electrons do not orbit the nucleus in neat circles like planets. Instead, they occupy fuzzy regions of probability called **orbitals**. Four quantum numbers describe the address of each electron, like a cosmic zip code.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'electron-shell-builder',
        title: 'Orbital Building Lab',
        description: 'Drag electrons into shells and subshells to build electron configurations from scratch. The workspace enforces quantum number rules: violate Pauli exclusion or exceed orbital capacity and the electron bounces back.',
        goals: [
          { id: 'build-helium', label: 'Fill the 1s orbital for Helium (2 electrons)' },
          { id: 'build-carbon', label: 'Build Carbon with correct 2p filling (Hund\'s rule)' },
          { id: 'build-neon', label: 'Complete all orbitals for Neon (noble gas)' },
        ],
      },
      {
        type: 'keyInsight',
        content: 'No two electrons in an atom can have the same set of four quantum numbers. This is the Pauli Exclusion Principle. It is why atoms have structure and why the periodic table exists.'
      },
      {
        type: 'formula',
        title: 'Orbital Capacities',
        formulas: [
          { label: 's subshell', formula: 'l=0, 1 orbital, 2 electrons', note: '' },
          { label: 'p subshell', formula: 'l=1, 3 orbitals, 6 electrons', note: '' },
          { label: 'd subshell', formula: 'l=2, 5 orbitals, 10 electrons', note: '' },
          { label: 'f subshell', formula: 'l=3, 7 orbitals, 14 electrons', note: '' }
        ]
      },
      {
        type: 'text',
        content: '**1. Principal Quantum Number (n):** n = 1, 2, 3, 4...\n- Determines the main energy level (shell)\n- Higher n = higher energy, larger orbital\n- Maximum electrons in shell n = 2n\u00B2\n\n**2. Azimuthal Quantum Number (l):** l = 0 to (n-1)\n- Determines the shape of the orbital\n- l=0: s (sphere), l=1: p (dumbbell), l=2: d (clover), l=3: f (complex)',
        subtype: 'concept'
      },
      {
        type: 'text',
        content: '**3. Magnetic Quantum Number (m_l):** m_l = -l to +l\n- Determines the orientation of the orbital in space\n- For p orbitals (l=1): m_l = -1, 0, +1 (three p orbitals: px, py, pz)\n\n**4. Spin Quantum Number (m_s):** +\u00BD or -\u00BD\n- Each orbital holds at most 2 electrons with opposite spins',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'For n = 3, what are the possible values of l? How many subshells are there?',
        correctAnswer: 3,
        unit: 'subshells',
        explanation: 'l = 0, 1, 2 (that is, 3s, 3p, 3d). Three subshells.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many orbitals are in the 3d subshell?',
        correctAnswer: 5,
        unit: '',
        explanation: 'For d subshell, l = 2. Number of orbitals = 2l + 1 = 2(2) + 1 = 5.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'qn-q1',
            question: 'What is the maximum number of electrons in the n = 3 shell?',
            type: 'number',
            correctAnswer: 18,
            unit: '',
            explanation: 'Max electrons = 2n\u00B2 = 2(9) = 18. (3s: 2 + 3p: 6 + 3d: 10 = 18).'
          },
          {
            id: 'qn-q2',
            question: 'Which set of quantum numbers is NOT allowed?',
            type: 'mcq',
            options: ['n=2, l=1, ml=0, ms=+1/2', 'n=1, l=1, ml=0, ms=+1/2', 'n=3, l=2, ml=-1, ms=-1/2', 'n=4, l=0, ml=0, ms=+1/2'],
            correctAnswer: 1,
            explanation: 'For n=1, l can only be 0. l=1 is not allowed when n=1 (l must be less than n).'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Electron Filling Order ==========
  {
    id: 'electron-filling',
    name: 'Electron Filling Order',
    constellationId: 'periodic-sanctum',
    order: 3,
    duration: 10,
    xp: 20,
    concepts: ['aufbau-principle', 'pauli-exclusion', 'hunds-rule', 'electron-configuration'],
    blocks: [
      {
        type: 'text',
        content: 'How do electrons arrange themselves in an atom? They fill orbitals following three strict rules. Master these rules and you can write the electron configuration of any element, predicting its chemical behavior.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'electron-shell',
        title: 'Electron Configuration Visualizer',
        description: 'Select any element and watch electrons fill orbitals one by one following Aufbau, Pauli, and Hund\'s rules. Observe how 4s fills before 3d and spot the chromium and copper exceptions in real time.',
        controls: [],
        discoveries: [
          { id: 'aufbau-order', label: '4s fills before 3d', hint: 'Select element 19 (K) and watch where the electron goes' },
          { id: 'hunds-rule', label: 'Electrons spread out before pairing in p or d orbitals', hint: 'Watch Nitrogen (Z=7) fill its 2p orbitals' },
          { id: 'chromium-exception', label: 'Chromium has 3d\u2075 4s\u00B9 instead of 3d\u2074 4s\u00B2', hint: 'Select Cr (Z=24) and check the 4s and 3d filling' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The filling order follows the (n + l) rule: lower (n + l) fills first. If two subshells have the same (n + l), the one with lower n fills first. Example: 3d has n+l = 5, 4s has n+l = 4. So 4s fills before 3d.'
      },
      {
        type: 'text',
        content: '**Three Rules of Electron Filling:**\n\n1. **Aufbau Principle:** Electrons fill orbitals from lowest energy to highest.\n   Order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p...\n\n2. **Pauli Exclusion Principle:** Each orbital holds at most 2 electrons with opposite spins.\n\n3. **Hund\'s Rule:** When filling orbitals of equal energy (e.g., the three 2p orbitals), put one electron in each before pairing. This maximizes total spin.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What is the electron configuration of Carbon (Z = 6)?',
        options: ['1s\u00B2 2s\u00B2 2p\u00B2', '1s\u00B2 2s\u00B2 2p\u00B6', '1s\u00B2 2s\u00B4', '1s\u00B2 2p\u2074'],
        correctAnswer: 0,
        explanation: '6 electrons: 1s\u00B2 (2), 2s\u00B2 (2), 2p\u00B2 (2). By Hund\'s rule, the 2 electrons in 2p occupy separate orbitals with parallel spins.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What is the electron configuration of Iron (Z = 26)?',
        options: [
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 4s\u00B2 3d\u2076',
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 3d\u2078',
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 3d\u2076 4s\u00B2',
          '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076 4s\u00B2 4p\u2076'
        ],
        correctAnswer: 0,
        explanation: 'Iron: [Ar] 4s\u00B2 3d\u2076. Written in order of filling: ...3p\u2076 4s\u00B2 3d\u2076. Note 4s fills before 3d.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ef-q1',
            question: 'What is the electron configuration of Sulfur (Z = 16)?',
            type: 'mcq',
            options: [
              '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2074',
              '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3p\u2076',
              '1s\u00B2 2s\u00B2 2p\u2076 3p\u2076',
              '1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2 3d\u2074'
            ],
            correctAnswer: 0,
            explanation: '16 electrons: 1s\u00B2(2) 2s\u00B2(4) 2p\u2076(10) 3s\u00B2(12) 3p\u2074(16).'
          },
          {
            id: 'ef-q2',
            question: 'How many unpaired electrons does Nitrogen (Z = 7) have?',
            type: 'number',
            correctAnswer: 3,
            unit: '',
            explanation: 'N: 1s\u00B2 2s\u00B2 2p\u00B3. By Hund\'s rule, the 3 electrons in 2p each occupy a separate orbital. All 3 are unpaired.'
          },
          {
            id: 'ef-q3',
            question: 'Which subshell fills after 4s?',
            type: 'mcq',
            options: ['4p', '3d', '5s', '4d'],
            correctAnswer: 1,
            explanation: 'After 4s (n+l=4), the next is 3d (n+l=5 with lower n). Then 4p (n+l=5 with higher n).'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Periodic Trends - Size ==========
  {
    id: 'periodic-trends-size',
    name: 'Periodic Trends: Size',
    constellationId: 'periodic-sanctum',
    order: 4,
    duration: 8,
    xp: 20,
    concepts: ['atomic-radius', 'ionic-radius', 'isoelectronic-species'],
    blocks: [
      {
        type: 'text',
        content: 'The periodic table is not just a catalog of elements. It is a map of patterns. The most fundamental trend is **atomic size**, which controls nearly everything else: ionization energy, electronegativity, and reactivity.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'atom-sizer',
        title: 'Atomic Size Comparator',
        description: 'Pick any two elements and see their atoms drawn to scale side by side. Drag elements from the periodic table to compare atomic and ionic radii. Watch atoms shrink across a period and grow down a group.',
        controls: [],
        discoveries: [
          { id: 'period-shrink', label: 'Atoms shrink from left to right across a period', hint: 'Compare Na and Cl in Period 3' },
          { id: 'group-grow', label: 'Atoms grow going down a group', hint: 'Compare Li, Na, K in Group 1' },
          { id: 'cation-smaller', label: 'Cations are smaller than their parent atoms', hint: 'Compare Na with Na\u207A' },
          { id: 'anion-larger', label: 'Anions are larger than their parent atoms', hint: 'Compare Cl with Cl\u207B' },
        ],
        completionCriteria: { requiredDiscoveries: 3 },
      },
      {
        type: 'keyInsight',
        content: 'The key factor is **effective nuclear charge (Z_eff)**. Across a period, Z_eff increases because protons are added faster than shielding increases. Down a group, a new shell is added, which is farther from the nucleus despite higher Z_eff.'
      },
      {
        type: 'text',
        content: '**Ionic Radius:**\n- Cations (positive ions) are SMALLER than their parent atoms. Losing electrons reduces electron-electron repulsion and the remaining electrons are pulled closer.\n- Anions (negative ions) are LARGER than their parent atoms. Extra electrons increase repulsion, expanding the electron cloud.\n\n**Isoelectronic species** have the same number of electrons (e.g., O\u00B2\u207B, F\u207B, Na\u207A, Mg\u00B2\u207A all have 10 electrons). Among isoelectronic species, more protons = smaller radius.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which atom is larger: Na (Z=11) or Cl (Z=17)?',
        options: ['Na', 'Cl', 'Same size', 'Cannot determine'],
        correctAnswer: 0,
        explanation: 'Both are in Period 3. Moving left to right, atomic radius decreases. Na (leftmost) is larger than Cl (further right).'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Arrange in order of increasing size: Na\u207A, F\u207B, O\u00B2\u207B, Mg\u00B2\u207A (all have 10 electrons)',
        options: [
          'Mg\u00B2\u207A < Na\u207A < F\u207B < O\u00B2\u207B',
          'O\u00B2\u207B < F\u207B < Na\u207A < Mg\u00B2\u207A',
          'Na\u207A < Mg\u00B2\u207A < F\u207B < O\u00B2\u207B',
          'F\u207B < O\u00B2\u207B < Na\u207A < Mg\u00B2\u207A'
        ],
        correctAnswer: 0,
        explanation: 'Isoelectronic: same electrons (10), but different nuclear charges. More protons = smaller. Mg\u00B2\u207A (12p) < Na\u207A (11p) < F\u207B (9p) < O\u00B2\u207B (8p).'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'pts-q1',
            question: 'Which is larger: Li or Cs?',
            type: 'mcq',
            options: ['Li', 'Cs', 'Same size'],
            correctAnswer: 1,
            explanation: 'Both in Group 1. Cs is below Li with many more shells, so Cs is much larger.'
          },
          {
            id: 'pts-q2',
            question: 'Which is larger: Na or Na\u207A?',
            type: 'mcq',
            options: ['Na atom', 'Na\u207A ion', 'Same size'],
            correctAnswer: 0,
            explanation: 'Na\u207A has lost an electron, reducing repulsion. The cation is smaller than the neutral atom.'
          },
          {
            id: 'pts-q3',
            question: 'Which is the smallest atom in Period 2?',
            type: 'mcq',
            options: ['Li', 'C', 'O', 'Ne'],
            correctAnswer: 3,
            explanation: 'Across a period, radius decreases. Ne (rightmost in Period 2) has the smallest atomic radius.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Periodic Trends - Energy ==========
  {
    id: 'periodic-trends-energy',
    name: 'Periodic Trends: Energy',
    constellationId: 'periodic-sanctum',
    order: 5,
    duration: 10,
    xp: 25,
    concepts: ['ionization-energy', 'electron-affinity', 'electronegativity'],
    blocks: [
      {
        type: 'text',
        content: 'How tightly does an atom hold its electrons? How eagerly does it grab new ones? These energy-related properties determine how atoms react, what bonds they form, and whether they behave as metals or nonmetals.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'periodic-trends',
        title: 'Periodic Trend Explorer',
        description: 'Select a property and watch the periodic table light up as a heatmap. Discover how atomic radius, ionization energy, and electronegativity change across periods and groups.',
        controls: [],
        discoveries: [
          { id: 'ie-period', label: 'Ionization energy generally increases across a period', hint: 'Switch to ionization energy and look across Period 3' },
          { id: 'ie-group', label: 'Ionization energy decreases down a group', hint: 'Look down Group 1 from Li to Cs' },
          { id: 'en-trend', label: 'Electronegativity increases toward the top-right', hint: 'Switch to electronegativity and check the top-right corner' },
          { id: 'ie-anomaly', label: 'Mg has higher IE than Al (half-filled subshell stability)', hint: 'Compare Mg and Al ionization energies in Period 3' },
        ],
        completionCriteria: { requiredDiscoveries: 3 },
      },
      {
        type: 'keyInsight',
        content: 'All three trends (IE, EA magnitude, EN) follow the same pattern: increase across a period, decrease down a group. The underlying reason is always effective nuclear charge and distance from the nucleus. Smaller atoms hold electrons more tightly.'
      },
      {
        type: 'text',
        content: '**Electron Affinity (EA):** The energy change when a gaseous atom gains an electron.\n\n- More negative EA = more energy released = atom wants electrons more\n- Halogens (Group 17) have the most negative EA (they love gaining electrons)\n- Noble gases have near-zero EA (they don\'t want extra electrons)\n\nTrend: Generally becomes more negative across a period (L to R) and less negative down a group.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which has the highest first ionization energy?',
        options: ['Na', 'Mg', 'Al', 'Si'],
        correctAnswer: 1,
        explanation: 'Generally IE increases across a period. But Mg (1s\u00B2 2s\u00B2 2p\u2076 3s\u00B2) has a fully-filled 3s subshell, making it extra stable. Its IE is higher than Al, which must remove from the less-stable 3p. So: Na < Al < Si < Mg (Mg has an anomalously high IE).'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which element is the most electronegative?',
        options: ['Oxygen', 'Fluorine', 'Chlorine', 'Nitrogen'],
        correctAnswer: 1,
        explanation: 'Fluorine (F) has the highest electronegativity of all elements (4.0 on the Pauling scale). It is the smallest halogen and has the strongest pull on shared electrons.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'pte-q1',
            question: 'Which has a lower ionization energy: K or Ca?',
            type: 'mcq',
            options: ['K', 'Ca', 'Same'],
            correctAnswer: 0,
            explanation: 'K (Group 1) has lower IE than Ca (Group 2). K easily loses its single 4s electron.'
          },
          {
            id: 'pte-q2',
            question: 'Why does Nitrogen have a higher IE than Oxygen?',
            type: 'mcq',
            options: [
              'N is smaller',
              'N has a half-filled 2p subshell (extra stability)',
              'N has more protons',
              'N has fewer electrons'
            ],
            correctAnswer: 1,
            explanation: 'N has a half-filled 2p\u00B3 configuration, which is extra stable. Removing an electron from this stable arrangement requires more energy than removing from O\'s 2p\u2074 (one paired electron is easier to remove).'
          },
          {
            id: 'pte-q3',
            question: 'Arrange in order of increasing electronegativity: C, N, O, F',
            type: 'mcq',
            options: ['C < N < O < F', 'F < O < N < C', 'C < O < N < F', 'N < C < O < F'],
            correctAnswer: 0,
            explanation: 'Electronegativity increases across a period: C (2.5) < N (3.0) < O (3.5) < F (4.0).'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Sanctum Mastery ==========
  {
    id: 'sanctum-mastery',
    name: 'Periodic Sanctum Mastery',
    constellationId: 'periodic-sanctum',
    order: 6,
    duration: 8,
    xp: 30,
    concepts: ['periodic-table-review', 'trend-predictions', 'configuration-applications'],
    blocks: [
      {
        type: 'text',
        content: 'The Periodic Sanctum mastery challenge requires you to combine your knowledge of atomic structure, quantum numbers, electron configurations, and periodic trends to solve complex problems and make predictions about element behavior.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'periodic-trends',
        title: 'Mastery Trend Challenge',
        description: 'All periodic trends in one view. Toggle between atomic radius, ionization energy, electron affinity, and electronegativity. Predict which element wins a comparison before revealing the answer.',
        controls: [],
        discoveries: [
          { id: 'ea-halogens', label: 'Halogens have the most negative electron affinity', hint: 'Switch to electron affinity and check Group 17' },
          { id: 'metal-nonmetal', label: 'Metals cluster on the left with low IE; nonmetals on the right with high IE', hint: 'Look at the IE heatmap and notice the metal-nonmetal divide' },
          { id: 'noble-gas-ie', label: 'Noble gases have the highest IE in each period', hint: 'Check the rightmost column in the IE view' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'sandbox',
        simType: 'electron-shell-builder',
        title: 'Configuration Mastery Lab',
        description: 'Given a mystery element\'s position on the periodic table, build its electron configuration from scratch. The lab checks your filling order, Hund\'s rule compliance, and flags exceptions like Cr and Cu.',
        goals: [
          { id: 'build-fe', label: 'Build the electron configuration of Iron (Z=26)' },
          { id: 'build-cr', label: 'Build the anomalous configuration of Chromium (Z=24)' },
          { id: 'build-fe3plus', label: 'Build the configuration of Fe\u00B3\u207A (electrons removed from 4s first)' },
        ],
      },
      {
        type: 'keyInsight',
        content: 'The periodic table is a cheat sheet for chemistry. Know the position of an element and you can predict:\n- Its electron configuration (period = highest shell, group = valence electrons)\n- Its size, IE, EN (trends from position)\n- Whether it\'s a metal, nonmetal, or metalloid\n- What ions it typically forms\n- What types of bonds it prefers'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'An element has electron configuration [Ne] 3s\u00B2 3p\u00B3. Predict its properties:',
        options: [
          'Metal, low IE, forms +1 ion',
          'Nonmetal, high IE, forms -3 ion or shares electrons',
          'Noble gas, very high IE, forms no ions',
          'Metal, forms +3 ion'
        ],
        correctAnswer: 1,
        explanation: 'This is Phosphorus (Z=15). It is in Group 15, Period 3. It\'s a nonmetal with relatively high IE. It can form P\u00B3\u207B or share electrons in covalent bonds (usually shares).'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which of these ions is the most stable (hardest to remove the next electron from)?',
        options: ['Na\u207A', 'Mg\u207A', 'Al\u207A', 'Si\u207A'],
        correctAnswer: 0,
        explanation: 'Na\u207A has the configuration of Ne (noble gas configuration: 1s\u00B2 2s\u00B2 2p\u2076). Noble gas configurations are extremely stable. Mg\u207A is [Ne]3s\u00B9, Al\u207A is [Ne]3s\u00B2, Si\u207A is [Ne]3s\u00B23p\u00B9.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'sm-q1',
            question: 'Element X has the configuration [Kr] 4d\u00B9\u2070 5s\u00B2 5p\u2074. Which group is it in?',
            type: 'mcq',
            options: ['Group 14', 'Group 16', 'Group 4', 'Group 6'],
            correctAnswer: 1,
            explanation: 'Valence electrons = 5s\u00B2 5p\u2074 = 6 valence electrons. Group 16. This is Tellurium (Te).'
          },
          {
            id: 'sm-q2',
            question: 'Predict: which has the larger atomic radius, Ge or Sn?',
            type: 'mcq',
            options: ['Ge', 'Sn', 'Same'],
            correctAnswer: 1,
            explanation: 'Both in Group 14. Sn is below Ge, so Sn is larger (radius increases down a group).'
          },
          {
            id: 'sm-q3',
            question: 'Among S\u00B2\u207B, Cl\u207B, K\u207A, Ca\u00B2\u207A (all isoelectronic with 18e\u207B), which is the largest?',
            type: 'mcq',
            options: ['S\u00B2\u207B', 'Cl\u207B', 'K\u207A', 'Ca\u00B2\u207A'],
            correctAnswer: 0,
            explanation: 'Isoelectronic species: fewer protons = larger radius. S\u00B2\u207B has 16 protons (least), so it is the largest.'
          },
          {
            id: 'sm-q4',
            question: 'The second ionization energy of Na is much higher than the first. Why?',
            type: 'mcq',
            options: [
              'Na\u207A is smaller',
              'The second electron is removed from a noble gas core (2p\u2076)',
              'Na has only one valence electron',
              'Both B and C are correct'
            ],
            correctAnswer: 3,
            explanation: 'Na\u207A has a noble gas configuration [Ne]. Removing an electron from this very stable arrangement requires much more energy. Also, Na\u207A is smaller, so the remaining electrons are held more tightly.'
          }
        ]
      }
    ]
  }
];
