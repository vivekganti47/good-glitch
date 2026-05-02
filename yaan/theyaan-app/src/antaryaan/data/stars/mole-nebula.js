export const moleNebulaStars = [
  // ========== STAR 1: Counting Atoms ==========
  {
    id: 'counting-atoms',
    name: 'Counting Atoms',
    constellationId: 'mole-nebula',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['mole-concept', 'avogadro-number', 'atoms-to-moles', 'moles-to-atoms'],
    blocks: [
      {
        type: 'text',
        content: 'Atoms are unimaginably small. A single drop of water contains about 10\u00B2\u00B9 water molecules. How do chemists count things this small? They use the **mole**, chemistry\'s counting unit.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'mole-converter',
        title: 'Mole Counting Station',
        description: 'Enter a number of particles or moles and watch the converter translate between the two in real time. A visual counter shows representative particles accumulating as you increase the mole value. Explore how astronomically large Avogadro\'s number really is.',
        controls: [],
        discoveries: [
          { id: 'avogadro-scale', label: 'One mole contains 6.022 \u00D7 10\u00B2\u00B3 particles', hint: 'Set the input to exactly 1 mole and read the particle count' },
          { id: 'mole-fraction', label: 'Half a mole is 3.011 \u00D7 10\u00B2\u00B3 particles', hint: 'Enter 0.5 moles and check the result' },
          { id: 'atoms-in-molecule', label: 'One mole of CO\u2082 contains 2 moles of oxygen atoms', hint: 'Select CO\u2082 and check atom count per molecule' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The mole is a counting unit, not a mass unit. 1 mole of hydrogen atoms and 1 mole of lead atoms both contain the same NUMBER of atoms (6.022 \u00D7 10\u00B2\u00B3), but they have very different masses.'
      },
      {
        type: 'formula',
        title: 'The Mole',
        formulas: [
          { label: 'Avogadro\'s Number', formula: 'N_A = 6.022 \u00D7 10\u00B2\u00B3', note: 'Number of particles in 1 mole' },
          { label: 'Moles to particles', formula: 'N = n \u00D7 N_A', note: 'n = number of moles, N = number of particles' },
          { label: 'Particles to moles', formula: 'n = N / N_A', note: '' }
        ]
      },
      {
        type: 'text',
        content: 'One mole is simply 6.022 \u00D7 10\u00B2\u00B3 of anything. A mole of atoms, a mole of molecules, a mole of ions. Just like a "dozen" means 12, a "mole" means 6.022 \u00D7 10\u00B2\u00B3.\n\nWhy this specific number? Because 1 mole of carbon-12 atoms has a mass of exactly 12 grams. The mole bridges the atomic world (amu) and the lab world (grams).',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many atoms are in 2 moles of iron?',
        correctAnswer: 12.044,
        unit: '\u00D7 10\u00B2\u00B3',
        tolerance: 0.01,
        explanation: 'N = n \u00D7 N_A = 2 \u00D7 6.022 \u00D7 10\u00B2\u00B3 = 12.044 \u00D7 10\u00B2\u00B3 atoms.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many moles of water are in 3.011 \u00D7 10\u00B2\u00B3 molecules?',
        correctAnswer: 0.5,
        unit: 'mol',
        explanation: 'n = N/N_A = 3.011 \u00D7 10\u00B2\u00B3 / 6.022 \u00D7 10\u00B2\u00B3 = 0.5 mol.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ca-q1',
            question: 'How many molecules are in 0.25 moles of CO\u2082?',
            type: 'number',
            correctAnswer: 1.506,
            unit: '\u00D7 10\u00B2\u00B3',
            tolerance: 0.01,
            explanation: 'N = 0.25 \u00D7 6.022 \u00D7 10\u00B2\u00B3 = 1.506 \u00D7 10\u00B2\u00B3 molecules.'
          },
          {
            id: 'ca-q2',
            question: 'How many oxygen ATOMS are in 0.25 mol of CO\u2082?',
            type: 'number',
            correctAnswer: 3.011,
            unit: '\u00D7 10\u00B2\u00B3',
            tolerance: 0.01,
            explanation: 'Each CO\u2082 has 2 O atoms. 0.25 mol CO\u2082 has 0.5 mol O atoms = 0.5 \u00D7 6.022 \u00D7 10\u00B2\u00B3 = 3.011 \u00D7 10\u00B2\u00B3.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Molar Mass Magic ==========
  {
    id: 'molar-mass-magic',
    name: 'Molar Mass Magic',
    constellationId: 'mole-nebula',
    order: 2,
    duration: 10,
    xp: 20,
    concepts: ['molar-mass', 'grams-to-moles', 'moles-to-grams', 'molecular-weight'],
    blocks: [
      {
        type: 'text',
        content: 'The mole connects mass (grams) to number of particles. The key is **molar mass (M)**: the mass of 1 mole of a substance, in grams per mole (g/mol). Numerically, it equals the atomic/molecular weight from the periodic table.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'mole-converter',
        title: 'Mass-Mole-Particle Converter',
        description: 'Type a substance formula and enter any one quantity: grams, moles, or number of particles. The converter instantly calculates the other two. Watch the conversion triangle animate to show which bridge you crossed.',
        controls: [],
        discoveries: [
          { id: 'grams-to-moles', label: 'Dividing mass by molar mass gives moles', hint: 'Enter 44g of CO\u2082 (M=44) and see it equals 1 mole' },
          { id: 'moles-to-particles', label: 'Multiplying moles by Avogadro\'s number gives particles', hint: 'Enter 1 mole and read the particle count' },
          { id: 'grams-to-particles', label: 'Going from grams to particles requires going through moles', hint: 'Enter 18g of H\u2082O and follow the two-step conversion' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The conversion triangle: Particles \u2194 Moles \u2194 Grams. To go from particles to grams or vice versa, always go through moles. Moles is the central hub of chemistry calculations.'
      },
      {
        type: 'formula',
        title: 'Molar Mass Conversions',
        formulas: [
          { label: 'Moles from mass', formula: 'n = mass / M', note: 'mass in grams, M in g/mol' },
          { label: 'Mass from moles', formula: 'mass = n \u00D7 M', note: '' },
          { label: 'Molar mass of compound', formula: 'M = sum of atomic masses', note: 'e.g., H\u2082O: 2(1) + 16 = 18 g/mol' }
        ]
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'What is the molar mass of H\u2082SO\u2084? (H=1, S=32, O=16)',
        correctAnswer: 98,
        unit: 'g/mol',
        explanation: 'M = 2(1) + 32 + 4(16) = 2 + 32 + 64 = 98 g/mol.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many moles are in 44 g of CO\u2082? (C=12, O=16)',
        correctAnswer: 1,
        unit: 'mol',
        explanation: 'M of CO\u2082 = 12 + 2(16) = 44 g/mol. n = mass/M = 44/44 = 1 mol.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mm-q1',
            question: 'How many moles are in 9 g of water? (M = 18 g/mol)',
            type: 'number',
            correctAnswer: 0.5,
            unit: 'mol',
            explanation: 'n = 9/18 = 0.5 mol.'
          },
          {
            id: 'mm-q2',
            question: 'What is the mass of 0.1 mol of CaCO\u2083? (Ca=40, C=12, O=16)',
            type: 'number',
            correctAnswer: 10,
            unit: 'g',
            explanation: 'M = 40 + 12 + 3(16) = 100 g/mol. Mass = 0.1 \u00D7 100 = 10 g.'
          },
          {
            id: 'mm-q3',
            question: 'How many molecules are in 36 g of water? (M = 18)',
            type: 'number',
            correctAnswer: 12.044,
            unit: '\u00D7 10\u00B2\u00B3',
            tolerance: 0.01,
            explanation: 'n = 36/18 = 2 mol. N = 2 \u00D7 6.022 \u00D7 10\u00B2\u00B3 = 12.044 \u00D7 10\u00B2\u00B3.'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Balancing Equations ==========
  {
    id: 'balancing-equations',
    name: 'Balancing Equations',
    constellationId: 'mole-nebula',
    order: 3,
    duration: 8,
    xp: 20,
    concepts: ['chemical-equations', 'balancing', 'law-of-conservation-of-mass'],
    blocks: [
      {
        type: 'text',
        content: 'A chemical equation is a recipe. The reactants are ingredients, the products are what you make. But atoms are neither created nor destroyed (Law of Conservation of Mass), so the number of each type of atom must be EQUAL on both sides.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'reaction-balancer',
        title: 'Equation Balancer Challenge',
        description: 'Balance chemical equations by adjusting coefficients. Molecule clusters on each side update in real time so you can visually verify atom counts. Start with simple equations and progress to combustion and redox reactions.',
        objective: 'Balance all equations correctly to conserve mass',
        targetScore: 70,
      },
      {
        type: 'keyInsight',
        content: 'You can only change COEFFICIENTS (numbers in front of formulas), never subscripts. Changing subscripts changes the identity of the substance.'
      },
      {
        type: 'text',
        content: '**Steps to Balance an Equation:**\n1. Write the unbalanced equation with correct formulas\n2. Count atoms of each element on both sides\n3. Adjust coefficients (numbers in front) to balance each element\n4. Start with the most complex molecule\n5. Check that all atoms balance\n6. Ensure coefficients are the smallest whole numbers',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'Balance: Fe + O\u2082 \u2192 Fe\u2082O\u2083. What is the coefficient of Fe?',
        correctAnswer: 4,
        unit: '',
        explanation: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083. Check: Fe: 4 = 4, O: 6 = 6. Balanced.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'Balance: C\u2083H\u2088 + O\u2082 \u2192 CO\u2082 + H\u2082O. What is the coefficient of O\u2082?',
        correctAnswer: 5,
        unit: '',
        explanation: 'C\u2083H\u2088 + 5O\u2082 \u2192 3CO\u2082 + 4H\u2082O. C: 3=3, H: 8=8, O: 10=10.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'be-q1',
            question: 'Balance: N\u2082 + H\u2082 \u2192 NH\u2083. The coefficient of H\u2082 is:',
            type: 'number',
            correctAnswer: 3,
            unit: '',
            explanation: 'N\u2082 + 3H\u2082 \u2192 2NH\u2083. N: 2=2, H: 6=6.'
          },
          {
            id: 'be-q2',
            question: 'Balance: Al + HCl \u2192 AlCl\u2083 + H\u2082. The coefficient of HCl is:',
            type: 'number',
            correctAnswer: 6,
            unit: '',
            explanation: '2Al + 6HCl \u2192 2AlCl\u2083 + 3H\u2082.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Stoichiometry Basics ==========
  {
    id: 'stoichiometry-basics',
    name: 'Stoichiometry Basics',
    constellationId: 'mole-nebula',
    order: 4,
    duration: 10,
    xp: 25,
    concepts: ['stoichiometry', 'mole-ratios', 'mass-to-mass', 'percent-yield'],
    blocks: [
      {
        type: 'text',
        content: '**Stoichiometry** is the arithmetic of chemistry. A balanced equation tells you the exact mole ratios. From these ratios, you can calculate how much product forms from a given amount of reactant.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'stoichiometry-factory',
        title: 'Stoichiometry Factory',
        description: 'Run a virtual chemical factory! Given a balanced equation and input amounts, calculate how much product your factory produces. Convert grams to moles, apply mole ratios, and convert back. Hit production targets to earn stars.',
        objective: 'Calculate correct product amounts for all factory orders',
        targetScore: 70,
      },
      {
        type: 'keyInsight',
        content: 'Always go through MOLES. Never try to go directly from grams of one substance to grams of another. The mole ratio is the bridge.'
      },
      {
        type: 'formula',
        title: 'Stoichiometry Framework',
        formulas: [
          { label: 'Grams to moles', formula: 'n = mass / M', note: '' },
          { label: 'Mole ratio', formula: 'n_B = n_A \u00D7 (coeff_B / coeff_A)', note: 'From balanced equation' },
          { label: 'Moles to grams', formula: 'mass = n \u00D7 M', note: '' },
          { label: 'Percent yield', formula: '% yield = (actual / theoretical) \u00D7 100', note: '' }
        ]
      },
      {
        type: 'text',
        content: '**The Stoichiometry Method:**\n1. Write and balance the equation\n2. Convert given quantity to moles\n3. Use mole ratio from balanced equation\n4. Convert moles to desired unit (grams, liters, particles)',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'In 2H\u2082 + O\u2082 \u2192 2H\u2082O, how many grams of water from 4 g of H\u2082? (H=1, O=16)',
        correctAnswer: 36,
        unit: 'g',
        explanation: 'n(H\u2082) = 4/2 = 2 mol. Ratio: 2 mol H\u2082 \u2192 2 mol H\u2082O. n(H\u2082O) = 2 mol. Mass = 2 \u00D7 18 = 36 g.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'CaCO\u2083 \u2192 CaO + CO\u2082. How many grams of CaO from 200 g CaCO\u2083? (Ca=40, C=12, O=16)',
        correctAnswer: 112,
        unit: 'g',
        explanation: 'n(CaCO\u2083) = 200/100 = 2 mol. 1:1 ratio. n(CaO) = 2 mol. Mass = 2 \u00D7 56 = 112 g.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'sb-q1',
            question: 'In N\u2082 + 3H\u2082 \u2192 2NH\u2083, how many moles of NH\u2083 from 5 mol H\u2082?',
            type: 'number',
            correctAnswer: 3.33,
            unit: 'mol',
            tolerance: 0.05,
            explanation: 'Ratio: 3 mol H\u2082 \u2192 2 mol NH\u2083. So 5 \u00D7 (2/3) = 3.33 mol.'
          },
          {
            id: 'sb-q2',
            question: 'A reaction has theoretical yield of 50 g but produces 40 g. Percent yield?',
            type: 'number',
            correctAnswer: 80,
            unit: '%',
            explanation: '% yield = (40/50) \u00D7 100 = 80%.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Limiting Reagent ==========
  {
    id: 'limiting-reagent',
    name: 'The Limiting Reagent',
    constellationId: 'mole-nebula',
    order: 5,
    duration: 10,
    xp: 25,
    concepts: ['limiting-reagent', 'excess-reagent', 'theoretical-yield'],
    blocks: [
      {
        type: 'text',
        content: 'When you make sandwiches with 10 slices of bread and 3 patties, patties limit you to 3 sandwiches. In chemistry, the **limiting reagent** runs out first, determining how much product can form.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'stoichiometry-factory',
        title: 'Limiting Reagent Factory',
        description: 'Your factory receives two reactants in specific amounts. Identify which reactant runs out first (limiting reagent), calculate the theoretical yield, and determine how much excess reagent remains. Optimize your production line!',
        objective: 'Correctly identify the limiting reagent and calculate yield for all scenarios',
        targetScore: 70,
      },
      {
        type: 'keyInsight',
        content: 'Theoretical yield is ALWAYS calculated from the limiting reagent. Using the excess reagent gives an overestimate.'
      },
      {
        type: 'text',
        content: '**Finding the Limiting Reagent:**\n1. Calculate moles of each reactant\n2. Divide each by its coefficient in the balanced equation\n3. The smallest value is the limiting reagent\n4. Use the limiting reagent to calculate theoretical yield',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: '2H\u2082 + O\u2082 \u2192 2H\u2082O. You have 3 mol H\u2082 and 2 mol O\u2082. Limiting reagent?',
        options: ['H\u2082', 'O\u2082', 'Neither', 'Cannot determine'],
        correctAnswer: 0,
        explanation: 'H\u2082: 3/2 = 1.5. O\u2082: 2/1 = 2. H\u2082 has smaller value, so H\u2082 is limiting.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'In the above (3 mol H\u2082, 2 mol O\u2082), how many moles of H\u2082O produced?',
        correctAnswer: 3,
        unit: 'mol',
        explanation: 'Use limiting reagent H\u2082: 3 mol H\u2082 \u2192 3 mol H\u2082O (2:2 ratio).'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'lr-q1',
            question: 'N\u2082 + 3H\u2082 \u2192 2NH\u2083. You have 2 mol N\u2082 and 3 mol H\u2082. Limiting reagent?',
            type: 'mcq',
            options: ['N\u2082', 'H\u2082'],
            correctAnswer: 1,
            explanation: 'N\u2082: 2/1 = 2. H\u2082: 3/3 = 1. H\u2082 is limiting.'
          },
          {
            id: 'lr-q2',
            question: 'From above, how many moles of NH\u2083 produced?',
            type: 'number',
            correctAnswer: 2,
            unit: 'mol',
            explanation: '3 mol H\u2082 \u2192 2 mol NH\u2083 (ratio 3:2).'
          },
          {
            id: 'lr-q3',
            question: '10 g Zn + excess HCl: Zn + 2HCl \u2192 ZnCl\u2082 + H\u2082. Grams of H\u2082? (Zn=65, H=1)',
            type: 'number',
            correctAnswer: 0.31,
            unit: 'g',
            tolerance: 0.02,
            explanation: 'n(Zn) = 10/65 = 0.154 mol. 1:1 with H\u2082. Mass = 0.154 \u00D7 2 = 0.31 g.'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Nebula Mastery ==========
  {
    id: 'nebula-mastery',
    name: 'Mole Nebula Mastery',
    constellationId: 'mole-nebula',
    order: 6,
    duration: 8,
    xp: 30,
    concepts: ['empirical-formula', 'molecular-formula', 'percent-composition', 'mole-review'],
    blocks: [
      {
        type: 'text',
        content: 'The Mole Nebula mastery adds two final concepts: determining formulas from experimental data, and percent composition. These are the tools of analytical chemistry.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'mole-converter',
        title: 'Composition Analyzer',
        description: 'Enter any compound formula to instantly see its molar mass, percent composition of each element, and the empirical vs molecular formula breakdown. Experiment with different compounds to see how composition relates to formula.',
        controls: [],
        discoveries: [
          { id: 'percent-comp', label: 'Percent composition adds up to 100% for any compound', hint: 'Enter H\u2082O and add the percent of H and O together' },
          { id: 'empirical-ratio', label: 'Empirical formula shows the simplest whole-number ratio', hint: 'Compare CH\u2082O and C\u2086H\u2081\u2082O\u2086 -- they share the same empirical formula' },
          { id: 'molar-mass-multiple', label: 'Molecular formula mass is a whole-number multiple of empirical mass', hint: 'Check glucose (C\u2086H\u2081\u2082O\u2086): its molar mass is 6\u00D7 the empirical mass of CH\u2082O' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'challenge',
        simType: 'stoichiometry-factory',
        title: 'Mole Nebula Final Challenge',
        description: 'A comprehensive challenge combining all mole concepts: convert between grams, moles, and particles, balance equations, solve stoichiometry problems with limiting reagents, and calculate percent yield. The ultimate test of your mole mastery.',
        objective: 'Complete all multi-step stoichiometry problems',
        targetScore: 75,
      },
      {
        type: 'text',
        content: '**Percent Composition:** % element = (mass of element in 1 mol / molar mass) \u00D7 100\n\n**Empirical Formula:** Simplest whole-number ratio of atoms. Found by converting mass % to moles, then dividing by smallest.\n\n**Molecular Formula:** Actual atom count. Molecular formula = n \u00D7 empirical formula, where n = molar mass / empirical mass.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'What is the percent of oxygen in H\u2082O? (H=1, O=16)',
        correctAnswer: 88.89,
        unit: '%',
        tolerance: 0.1,
        explanation: 'M(H\u2082O) = 18. %O = (16/18) \u00D7 100 = 88.89%.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A compound is 40% C, 6.7% H, 53.3% O. Empirical formula? (C=12, H=1, O=16)',
        options: ['CHO', 'CH\u2082O', 'C\u2082H\u2084O\u2082', 'CH\u2083O'],
        correctAnswer: 1,
        explanation: 'Moles: C: 40/12=3.33, H: 6.7/1=6.7, O: 53.3/16=3.33. Ratio 1:2:1. CH\u2082O.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'nm-q1',
            question: 'What is the percent of nitrogen in NH\u2083? (N=14, H=1)',
            type: 'number',
            correctAnswer: 82.35,
            unit: '%',
            tolerance: 0.1,
            explanation: 'M(NH\u2083) = 17. %N = (14/17) \u00D7 100 = 82.35%.'
          },
          {
            id: 'nm-q2',
            question: 'Empirical formula NO\u2082, molar mass 92. Molecular formula?',
            type: 'mcq',
            options: ['NO\u2082', 'N\u2082O\u2084', 'N\u2083O\u2086', 'N\u2082O\u2082'],
            correctAnswer: 1,
            explanation: 'Empirical mass = 46. n = 92/46 = 2. N\u2082O\u2084.'
          },
          {
            id: 'nm-q3',
            question: '2KClO\u2083 \u2192 2KCl + 3O\u2082. Grams of O\u2082 from 245 g KClO\u2083? (K=39, Cl=35.5, O=16)',
            type: 'number',
            correctAnswer: 96,
            unit: 'g',
            explanation: 'M(KClO\u2083)=122.5. n=2 mol. 2 mol \u2192 3 mol O\u2082. Mass = 3 \u00D7 32 = 96 g.'
          },
          {
            id: 'nm-q4',
            question: '50 g CaCO\u2083 heated. 20 g CaO obtained. Percent yield?',
            type: 'number',
            correctAnswer: 71.43,
            unit: '%',
            tolerance: 0.1,
            explanation: 'Theoretical: 0.5 mol CaCO\u2083 \u2192 0.5 mol CaO = 28 g. %yield = (20/28)\u00D7100 = 71.43%.'
          }
        ]
      }
    ]
  }
];
