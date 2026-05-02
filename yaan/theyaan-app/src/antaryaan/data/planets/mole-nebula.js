// Mole Nebula - Mole Concept practice planets
// Topics: moles, molar mass, stoichiometry, limiting reagent, percent yield, empirical formula
// Avogadro's number = 6.022 x 10^23

export const moleNebulaPlanets = [
  // ==================== PLANET 1: Mole Calculations ====================
  {
    id: 'mole-calculations',
    name: 'Mole Calculations',
    constellationId: 'mole-nebula',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'mn1-1',
        type: 'numerical',
        difficulty: 1,
        text: 'How many moles of water (H\u2082O) are present in 36 g of water? (H = 1, O = 16)',
        correctAnswer: 2,
        unit: 'mol',
        hint: 'Moles = mass / molar mass. Calculate the molar mass of H\u2082O first.',
        steps: [
          'Molar mass of H\u2082O = 2(1) + 16 = 18 g/mol',
          'Moles = mass / molar mass = 36 / 18 = 2 mol'
        ],
        solution: 'Molar mass of H\u2082O = 2(1) + 16 = 18 g/mol. Moles = 36/18 = 2 mol.',
        similarExample: 'Moles of CO\u2082 in 88 g: molar mass = 44 g/mol, moles = 88/44 = 2 mol.',
        concepts: ['mole-concept', 'molar-mass']
      },
      {
        id: 'mn1-2',
        type: 'numerical',
        difficulty: 2,
        text: 'How many molecules are present in 0.5 moles of CO\u2082? Express your answer as a multiple of 10\u00B2\u00B3 (e.g., enter 3.011 for 3.011 x 10\u00B2\u00B3).',
        correctAnswer: 3.011,
        unit: '\u00D7 10\u00B2\u00B3 molecules',
        hint: 'Number of molecules = moles \u00D7 Avogadro\'s number (6.022 \u00D7 10\u00B2\u00B3).',
        steps: [
          'Number of molecules = n \u00D7 N_A',
          '= 0.5 \u00D7 6.022 \u00D7 10\u00B2\u00B3',
          '= 3.011 \u00D7 10\u00B2\u00B3 molecules'
        ],
        solution: 'Molecules = 0.5 \u00D7 6.022 \u00D7 10\u00B2\u00B3 = 3.011 \u00D7 10\u00B2\u00B3.',
        concepts: ['mole-concept']
      },
      {
        id: 'mn1-3',
        type: 'mcq',
        difficulty: 2,
        text: 'Which of the following contains the greatest number of atoms?',
        options: [
          '16 g of O\u2082 (O = 16)',
          '14 g of N\u2082 (N = 14)',
          '2 g of H\u2082 (H = 1)',
          '4 g of He (He = 4)'
        ],
        correctIndex: 2,
        hint: 'First find moles of each substance. Then calculate total atoms (molecules \u00D7 atoms per molecule).',
        steps: [
          '16 g O\u2082: 16/32 = 0.5 mol \u2192 0.5 \u00D7 2 = 1 mol atoms',
          '14 g N\u2082: 14/28 = 0.5 mol \u2192 0.5 \u00D7 2 = 1 mol atoms',
          '2 g H\u2082: 2/2 = 1 mol \u2192 1 \u00D7 2 = 2 mol atoms',
          '4 g He: 4/4 = 1 mol \u2192 1 mol atoms (monatomic)',
          'H\u2082 gives the most atoms'
        ],
        solution: '2 g of H\u2082 = 1 mol of H\u2082 = 2 mol of H atoms (most). All others give only 1 mol of atoms.',
        concepts: ['mole-concept', 'molar-mass']
      },
      {
        id: 'mn1-4',
        type: 'numerical',
        difficulty: 2,
        text: 'Calculate the molar mass of calcium carbonate (CaCO\u2083). (Ca = 40, C = 12, O = 16)',
        correctAnswer: 100,
        unit: 'g/mol',
        hint: 'Add up the atomic masses of all atoms in the formula.',
        steps: [
          'CaCO\u2083 has: 1 Ca, 1 C, 3 O',
          'Molar mass = 40 + 12 + 3(16) = 40 + 12 + 48 = 100 g/mol'
        ],
        solution: 'M(CaCO\u2083) = 40 + 12 + 3(16) = 100 g/mol.',
        concepts: ['molar-mass']
      },
      {
        id: 'mn1-5',
        type: 'mcq',
        difficulty: 3,
        text: 'A compound has the empirical formula CH\u2082O and a molar mass of 60 g/mol. What is the molecular formula? (C = 12, H = 1, O = 16)',
        options: ['CH\u2082O', 'C\u2082H\u2084O\u2082', 'C\u2083H\u2086O\u2083', 'C\u2084H\u2088O\u2084'],
        correctIndex: 1,
        hint: 'Find the ratio: molar mass of compound / molar mass of empirical formula.',
        steps: [
          'Empirical formula mass = 12 + 2(1) + 16 = 30 g/mol',
          'n = molar mass / empirical formula mass = 60/30 = 2',
          'Molecular formula = (CH\u2082O)\u2082 = C\u2082H\u2084O\u2082'
        ],
        solution: 'Empirical formula mass of CH\u2082O = 30 g/mol. n = 60/30 = 2. Molecular formula = C\u2082H\u2084O\u2082 (this is acetic acid).',
        concepts: ['empirical-formula', 'molar-mass']
      },
      {
        id: 'mn1-6',
        type: 'match',
        difficulty: 2,
        text: 'Match each quantity with its value for exactly 1 mole of water (H\u2082O).',
        leftColumn: [
          'Mass',
          'Number of molecules',
          'Number of hydrogen atoms',
          'Number of total atoms'
        ],
        rightColumn: [
          '3 \u00D7 6.022 \u00D7 10\u00B2\u00B3',
          '2 \u00D7 6.022 \u00D7 10\u00B2\u00B3',
          '6.022 \u00D7 10\u00B2\u00B3',
          '18 g'
        ],
        correctMatches: { 0: 3, 1: 2, 2: 1, 3: 0 },
        hint: 'Each H\u2082O molecule has 2 H atoms and 1 O atom (3 atoms total). 1 mol = 6.022 \u00D7 10\u00B2\u00B3 molecules.',
        solution: 'Mass = 18 g. Molecules = 6.022 \u00D7 10\u00B2\u00B3. H atoms = 2 \u00D7 6.022 \u00D7 10\u00B2\u00B3. Total atoms = 3 \u00D7 6.022 \u00D7 10\u00B2\u00B3.',
        concepts: ['mole-concept']
      },
      {
        id: 'mn1-7',
        type: 'numerical',
        difficulty: 3,
        text: 'What is the percent composition by mass of oxygen in sulfuric acid (H\u2082SO\u2084)? (H = 1, S = 32, O = 16)',
        context: 'Round to one decimal place.',
        correctAnswer: 65.3,
        unit: '%',
        hint: 'Percent of O = (mass of O in one mole / molar mass of compound) \u00D7 100.',
        steps: [
          'Molar mass of H\u2082SO\u2084 = 2(1) + 32 + 4(16) = 2 + 32 + 64 = 98 g/mol',
          'Mass of O in one mole = 4 \u00D7 16 = 64 g',
          'Percent O = (64/98) \u00D7 100 = 65.3%'
        ],
        solution: 'M(H\u2082SO\u2084) = 98 g/mol. Mass of O = 64 g. % O = (64/98) \u00D7 100 = 65.3%.',
        concepts: ['percent-composition', 'molar-mass']
      }
    ]
  },

  // ==================== PLANET 2: Reaction Stoichiometry ====================
  {
    id: 'reaction-stoichiometry',
    name: 'Reaction Stoichiometry',
    constellationId: 'mole-nebula',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'mn2-1',
        type: 'mcq',
        difficulty: 2,
        text: 'In the balanced equation 2H\u2082 + O\u2082 \u2192 2H\u2082O, what does the coefficient "2" before H\u2082 represent?',
        options: [
          '2 grams of hydrogen',
          '2 atoms of hydrogen',
          '2 moles of hydrogen molecules',
          '2 liters of hydrogen'
        ],
        correctIndex: 2,
        hint: 'Coefficients in a balanced equation represent the molar ratio of reactants and products.',
        solution: 'The coefficient 2 before H\u2082 means 2 moles of H\u2082 molecules react with 1 mole of O\u2082 to produce 2 moles of H\u2082O. Coefficients give the molar (stoichiometric) ratio.',
        concepts: ['stoichiometry', 'balancing-equations']
      },
      {
        id: 'mn2-2',
        type: 'numerical',
        difficulty: 3,
        text: 'How many grams of CO\u2082 are produced when 10 g of CaCO\u2083 is completely decomposed? CaCO\u2083 \u2192 CaO + CO\u2082. (Ca = 40, C = 12, O = 16)',
        correctAnswer: 4.4,
        unit: 'g',
        hint: 'Convert grams of CaCO\u2083 to moles, use stoichiometric ratio (1:1) to find moles of CO\u2082, then convert to grams.',
        steps: [
          'M(CaCO\u2083) = 100 g/mol, M(CO\u2082) = 44 g/mol',
          'Moles of CaCO\u2083 = 10/100 = 0.1 mol',
          'From equation: 1 mol CaCO\u2083 \u2192 1 mol CO\u2082',
          'Moles of CO\u2082 = 0.1 mol',
          'Mass of CO\u2082 = 0.1 \u00D7 44 = 4.4 g'
        ],
        solution: 'Moles CaCO\u2083 = 10/100 = 0.1. Mole ratio is 1:1. Mass CO\u2082 = 0.1 \u00D7 44 = 4.4 g.',
        concepts: ['stoichiometry']
      },
      {
        id: 'mn2-3',
        type: 'mcq',
        difficulty: 3,
        text: 'In the reaction N\u2082 + 3H\u2082 \u2192 2NH\u2083, if 28 g of N\u2082 reacts with 10 g of H\u2082, which is the limiting reagent and how many grams of NH\u2083 are produced? (N = 14, H = 1)',
        options: [
          'N\u2082 is limiting; 34 g NH\u2083 produced',
          'H\u2082 is limiting; 34 g NH\u2083 produced',
          'N\u2082 is limiting; 17 g NH\u2083 produced',
          'Neither is limiting; 56.7 g NH\u2083 produced'
        ],
        correctIndex: 0,
        hint: 'Calculate moles of each reactant and divide by the stoichiometric coefficient. The smaller value is the limiting reagent.',
        steps: [
          'Moles of N\u2082 = 28/28 = 1 mol',
          'Moles of H\u2082 = 10/2 = 5 mol',
          'Divide by coefficients: N\u2082: 1/1 = 1, H\u2082: 5/3 = 1.67',
          'N\u2082 has the smaller ratio, so N\u2082 is the limiting reagent',
          'From 1 mol N\u2082: 2 mol NH\u2083 = 2 \u00D7 17 = 34 g'
        ],
        solution: 'Moles: N\u2082 = 1, H\u2082 = 5. Ratio test: N\u2082: 1/1 = 1, H\u2082: 5/3 = 1.67. N\u2082 is limiting (smaller ratio). 1 mol N\u2082 \u2192 2 mol NH\u2083 = 34 g.',
        concepts: ['limiting-reagent', 'stoichiometry']
      },
      {
        id: 'mn2-4',
        type: 'numerical',
        difficulty: 3,
        text: 'In the reaction 2Al + 6HCl \u2192 2AlCl\u2083 + 3H\u2082, how many grams of H\u2082 are produced from 5.4 g of Al? (Al = 27, H = 1)',
        correctAnswer: 0.6,
        unit: 'g',
        hint: 'Convert Al to moles, use the stoichiometric ratio (2 mol Al : 3 mol H\u2082), then convert to grams.',
        steps: [
          'Moles of Al = 5.4/27 = 0.2 mol',
          'From equation: 2 mol Al \u2192 3 mol H\u2082',
          'Moles of H\u2082 = 0.2 \u00D7 (3/2) = 0.3 mol',
          'Mass of H\u2082 = 0.3 \u00D7 2 = 0.6 g'
        ],
        solution: 'Moles Al = 5.4/27 = 0.2. Moles H\u2082 = 0.2 \u00D7 (3/2) = 0.3. Mass H\u2082 = 0.3 \u00D7 2 = 0.6 g.',
        concepts: ['stoichiometry']
      },
      {
        id: 'mn2-5',
        type: 'numerical',
        difficulty: 4,
        text: 'A reaction has a theoretical yield of 50 g of product but actually produces 40 g. What is the percent yield?',
        correctAnswer: 80,
        unit: '%',
        hint: 'Percent yield = (actual yield / theoretical yield) \u00D7 100.',
        steps: [
          'Percent yield = (actual / theoretical) \u00D7 100',
          '= (40/50) \u00D7 100',
          '= 80%'
        ],
        solution: 'Percent yield = (40/50) \u00D7 100 = 80%.',
        concepts: ['percent-yield']
      },
      {
        id: 'mn2-6',
        type: 'mcq',
        difficulty: 4,
        text: 'A 3.0 g sample of an organic compound containing only C, H, and O is burned completely. It produces 4.4 g of CO\u2082 and 1.8 g of H\u2082O. What is the empirical formula? (C = 12, O = 16, H = 1)',
        options: ['CH\u2082O', 'C\u2082H\u2084O', 'CHO', 'CH\u2082O\u2082'],
        correctIndex: 0,
        hint: 'Find moles of C from CO\u2082, moles of H from H\u2082O, and moles of O by difference.',
        steps: [
          'Moles of CO\u2082 = 4.4/44 = 0.1 mol \u2192 moles of C = 0.1, mass of C = 1.2 g',
          'Moles of H\u2082O = 1.8/18 = 0.1 mol \u2192 moles of H = 0.2, mass of H = 0.2 g',
          'Mass of O = 3.0 - 1.2 - 0.2 = 1.6 g \u2192 moles of O = 1.6/16 = 0.1',
          'Mole ratio C:H:O = 0.1:0.2:0.1 = 1:2:1',
          'Empirical formula = CH\u2082O'
        ],
        solution: 'C: 0.1 mol, H: 0.2 mol, O: 0.1 mol. Ratio = 1:2:1. Empirical formula = CH\u2082O (formaldehyde).',
        concepts: ['empirical-formula', 'stoichiometry']
      },
      {
        id: 'mn2-7',
        type: 'match',
        difficulty: 3,
        text: 'Match each balanced equation coefficient set with the correct reaction.',
        leftColumn: [
          'CH\u2084 + O\u2082 \u2192 CO\u2082 + H\u2082O',
          'Fe\u2082O\u2083 + C \u2192 Fe + CO\u2082',
          'N\u2082 + H\u2082 \u2192 NH\u2083'
        ],
        rightColumn: [
          '1, 3, 2, 3',
          '2, 3, 4, 3',
          '1, 2, 1, 2'
        ],
        correctMatches: { 0: 2, 1: 1, 2: 0 },
        hint: 'Balance each equation by adjusting coefficients so atoms are equal on both sides.',
        solution: 'CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O (coefficients: 1,2,1,2). 2Fe\u2082O\u2083 + 3C \u2192 4Fe + 3CO\u2082 (coefficients: 2,3,4,3). N\u2082 + 3H\u2082 \u2192 2NH\u2083 (coefficients: 1,3,2,3... but only 3 coefficients needed: 1,3,2).',
        concepts: ['balancing-equations']
      },
      {
        id: 'mn2-8',
        type: 'numerical',
        difficulty: 4,
        text: 'What volume (in liters at STP) of O\u2082 is needed to completely burn 3.2 g of methane (CH\u2084)? CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O. (C = 12, H = 1. At STP, 1 mol gas = 22.4 L)',
        correctAnswer: 8.96,
        unit: 'L',
        hint: 'Convert CH\u2084 mass to moles, use stoichiometry to find moles of O\u2082, then convert to volume at STP.',
        steps: [
          'M(CH\u2084) = 12 + 4 = 16 g/mol',
          'Moles of CH\u2084 = 3.2/16 = 0.2 mol',
          'From equation: 1 mol CH\u2084 needs 2 mol O\u2082',
          'Moles of O\u2082 needed = 0.2 \u00D7 2 = 0.4 mol',
          'Volume at STP = 0.4 \u00D7 22.4 = 8.96 L'
        ],
        solution: 'Moles CH\u2084 = 0.2. Moles O\u2082 = 0.4. Volume = 0.4 \u00D7 22.4 = 8.96 L at STP.',
        concepts: ['stoichiometry', 'gas-volumes']
      }
    ]
  }
];
