export const bondMatrixStars = [
  // ========== STAR 1: Ionic Bonds ==========
  {
    id: 'ionic-bonds',
    name: 'Ionic Bonds',
    constellationId: 'bond-matrix',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['ionic-bonding', 'lattice-energy', 'properties-of-ionic-compounds'],
    blocks: [
      {
        type: 'text',
        content: 'What happens when a metal meets a nonmetal? The metal, eager to lose electrons, transfers them to the nonmetal, which is desperate to gain them. The result: oppositely charged ions locked together by electrostatic attraction. This is the **ionic bond**.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'electron-shell',
        title: 'Ionic Bond Formation Viewer',
        description: 'Select a metal and a nonmetal to watch electron transfer in action. See the metal lose electrons and shrink into a cation while the nonmetal gains electrons and expands into an anion. Observe the electrostatic attraction that locks them together.',
        controls: [],
        discoveries: [
          { id: 'electron-transfer', label: 'Metals transfer electrons to nonmetals', hint: 'Pair Na with Cl and watch the electron jump' },
          { id: 'noble-gas-config', label: 'Both ions achieve noble gas configurations', hint: 'Check the electron count after Na gives its electron to Cl' },
          { id: 'charge-effect', label: 'Higher ion charges create stronger ionic bonds', hint: 'Compare NaCl with MgO and note the lattice energy difference' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Lattice energy is the energy released when gaseous ions form a solid crystal. Higher lattice energy = stronger ionic bond = higher melting point. Lattice energy increases with higher charges and smaller ions: MgO has much higher lattice energy than NaCl.'
      },
      {
        type: 'text',
        content: '**Properties of Ionic Compounds:**\n- High melting and boiling points (strong electrostatic forces)\n- Hard but brittle (shifting layers causes like charges to align and repel)\n- Conduct electricity when molten or dissolved (free ions carry charge)\n- Do NOT conduct as solids (ions locked in lattice)\n- Soluble in polar solvents (like water)',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which compound has the highest melting point?',
        options: ['NaCl', 'MgO', 'KBr', 'CsI'],
        correctAnswer: 1,
        explanation: 'MgO: Mg\u00B2\u207A and O\u00B2\u207B have charges of +2 and -2 (higher than +1/-1 in others) and are small ions. This gives the highest lattice energy and melting point (~2852\u00B0C).'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ib-q1',
            question: 'What type of bond forms between Ca and F?',
            type: 'mcq',
            options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen bond'],
            correctAnswer: 1,
            explanation: 'Ca is a metal (Group 2), F is a nonmetal (Group 17). Large electronegativity difference leads to ionic bonding. Ca\u00B2\u207A and 2F\u207B form CaF\u2082.'
          },
          {
            id: 'ib-q2',
            question: 'Why are ionic solids brittle?',
            type: 'mcq',
            options: [
              'Ions are weakly bonded',
              'Shifting layers brings like charges together, causing repulsion',
              'They have low lattice energy',
              'Electrons are free to move'
            ],
            correctAnswer: 1,
            explanation: 'When stress shifts one layer of ions, like charges align. The sudden repulsion shatters the crystal.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Covalent Sharing ==========
  {
    id: 'covalent-sharing',
    name: 'Covalent Sharing',
    constellationId: 'bond-matrix',
    order: 2,
    duration: 8,
    xp: 15,
    concepts: ['covalent-bonding', 'single-double-triple-bonds', 'bond-energy', 'bond-length'],
    blocks: [
      {
        type: 'text',
        content: 'When two nonmetals meet, neither wants to give up electrons. Instead, they **share** them. Each atom contributes one or more electrons to a shared pair, and both atoms count the shared electrons as their own. This is the **covalent bond**.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'bond-polarity',
        title: 'Bond Polarity Spectrum',
        description: 'Pick any two elements to form a bond and watch the electron density shift in real time. A polarity meter shows the electronegativity difference and classifies the bond as nonpolar covalent, polar covalent, or ionic.',
        controls: [],
        discoveries: [
          { id: 'nonpolar-bond', label: 'Identical atoms share electrons equally (nonpolar)', hint: 'Bond H with H or Cl with Cl' },
          { id: 'polar-bond', label: 'Different atoms create partial charges', hint: 'Bond H with Cl and watch the electron cloud shift' },
          { id: 'ionic-extreme', label: 'Very large EN differences create ionic character', hint: 'Bond Na with F and observe the near-complete electron transfer' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Polar vs Nonpolar covalent bonds: if the two atoms have DIFFERENT electronegativities, the shared electrons are pulled toward the more electronegative atom. This creates a **polar covalent bond** with partial charges (\u03B4+ and \u03B4-). If electronegativities are the same, the bond is nonpolar.'
      },
      {
        type: 'text',
        content: '**Types of Covalent Bonds:**\n- **Single bond:** 1 shared pair (e.g., H-H in H\u2082). Longest, weakest.\n- **Double bond:** 2 shared pairs (e.g., O=O in O\u2082). Shorter, stronger.\n- **Triple bond:** 3 shared pairs (e.g., N\u2261N in N\u2082). Shortest, strongest.\n\nBond order: single (1) < double (2) < triple (3).\nBond strength: single < double < triple.\nBond length: single > double > triple.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which bond is the strongest?',
        options: ['C-C', 'C=C', 'C\u2261C', 'C-O'],
        correctAnswer: 2,
        explanation: 'Triple bonds are the strongest. C\u2261C bond energy \u2248 837 kJ/mol, compared to C=C \u2248 614 kJ/mol and C-C \u2248 348 kJ/mol.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Classify the bond in HCl:',
        options: ['Pure covalent (nonpolar)', 'Polar covalent', 'Ionic', 'Metallic'],
        correctAnswer: 1,
        explanation: 'H (EN = 2.1) and Cl (EN = 3.0) have different electronegativities. The bond is polar covalent, with \u03B4+ on H and \u03B4- on Cl.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cs-q1',
            question: 'Which molecule has a triple bond?',
            type: 'mcq',
            options: ['O\u2082', 'CO\u2082', 'N\u2082', 'H\u2082O'],
            correctAnswer: 2,
            explanation: 'N\u2082 has a triple bond (N\u2261N). Each N needs 3 more electrons for an octet, so they share 3 pairs.'
          },
          {
            id: 'cs-q2',
            question: 'Arrange in order of increasing bond length: C-C, C=C, C\u2261C',
            type: 'mcq',
            options: ['C-C < C=C < C\u2261C', 'C\u2261C < C=C < C-C', 'C=C < C-C < C\u2261C', 'All are equal'],
            correctAnswer: 1,
            explanation: 'More shared electrons = shorter bond. C\u2261C (120 pm) < C=C (134 pm) < C-C (154 pm).'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Lewis Structures ==========
  {
    id: 'lewis-structures',
    name: 'Lewis Structures',
    constellationId: 'bond-matrix',
    order: 3,
    duration: 10,
    xp: 20,
    concepts: ['lewis-dot-structures', 'octet-rule', 'formal-charge', 'resonance'],
    blocks: [
      {
        type: 'text',
        content: 'A **Lewis structure** shows how valence electrons are distributed in a molecule. It reveals which atoms are bonded, how many bonds exist, and where lone pairs sit. It is the blueprint from which we predict molecular shape.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'molecule-builder',
        title: 'Lewis Structure Workshop',
        description: 'Drag atoms into the workspace and connect them with bonds. The builder counts valence electrons and highlights octet violations. Add lone pairs, convert single bonds to double or triple, and check formal charges.',
        goals: [
          { id: 'build-co2', label: 'Build CO\u2082 with correct double bonds (O=C=O)' },
          { id: 'build-no3', label: 'Build the nitrate ion (NO\u2083\u207B) and show one resonance structure' },
          { id: 'build-bf3', label: 'Build BF\u2083 and observe the octet rule exception on boron' },
        ],
      },
      {
        type: 'keyInsight',
        content: 'Exceptions to the octet rule:\n1. **Electron deficient:** BF\u2083 (B has only 6 electrons)\n2. **Expanded octet:** PCl\u2085 and SF\u2086 (atoms in Period 3+ can use d orbitals)\n3. **Odd electron:** NO has 11 electrons (one unpaired)'
      },
      {
        type: 'text',
        content: '**Steps to Draw a Lewis Structure:**\n1. Count total valence electrons (add for anions, subtract for cations)\n2. Draw single bonds between atoms (central atom is usually the least electronegative, never H)\n3. Complete octets on outer atoms first (duet for H)\n4. Place remaining electrons on the central atom\n5. If the central atom lacks an octet, convert lone pairs on outer atoms to double/triple bonds',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many total valence electrons does CO\u2082 have? (C is in Group 14, O is in Group 16)',
        correctAnswer: 16,
        unit: '',
        explanation: 'C has 4 valence e\u207B, each O has 6. Total = 4 + 6 + 6 = 16 valence electrons.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'In the Lewis structure of SO\u2082, how many lone pairs are on the sulfur atom?',
        correctAnswer: 1,
        unit: '',
        explanation: 'SO\u2082: Total valence e\u207B = 6+6+6 = 18. S is central with 2 double bonds to O (using 8 e\u207B for bonds). Each O gets 2 lone pairs (8 e\u207B). Remaining: 18 - 8 - 8 = 2 e\u207B = 1 lone pair on S.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ls-q1',
            question: 'How many total valence electrons does the nitrate ion (NO\u2083\u207B) have?',
            type: 'number',
            correctAnswer: 24,
            unit: '',
            explanation: 'N: 5, each O: 6 \u00D7 3 = 18, plus 1 for the negative charge. Total = 5 + 18 + 1 = 24.'
          },
          {
            id: 'ls-q2',
            question: 'How many resonance structures does the carbonate ion (CO\u2083\u00B2\u207B) have?',
            type: 'number',
            correctAnswer: 3,
            unit: '',
            explanation: 'CO\u2083\u00B2\u207B has 3 equivalent resonance structures. The double bond can be to any of the 3 oxygen atoms.'
          },
          {
            id: 'ls-q3',
            question: 'Which molecule violates the octet rule?',
            type: 'mcq',
            options: ['H\u2082O', 'BF\u2083', 'CO\u2082', 'NH\u2083'],
            correctAnswer: 1,
            explanation: 'BF\u2083: B has only 3 valence electrons and forms 3 bonds (6 electrons around B). It is electron-deficient.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: VSEPR and Molecular Geometry ==========
  {
    id: 'vsepr-geometry',
    name: 'VSEPR and Molecular Geometry',
    constellationId: 'bond-matrix',
    order: 4,
    duration: 10,
    xp: 25,
    concepts: ['vsepr-theory', 'electron-geometry', 'molecular-geometry', 'bond-angles'],
    blocks: [
      {
        type: 'text',
        content: 'Molecules are three-dimensional, and their shape determines their properties. **VSEPR** (Valence Shell Electron Pair Repulsion) theory predicts shape by a simple rule: electron pairs around a central atom repel each other and arrange themselves to be as far apart as possible.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'molecule-builder',
        title: '3D Molecular Shape Lab',
        description: 'Build molecules and watch them snap into 3D VSEPR geometries. Add lone pairs to the central atom and see how the shape changes from tetrahedral to trigonal pyramidal to bent. Rotate the 3D model to inspect bond angles.',
        goals: [
          { id: 'build-ch4', label: 'Build CH\u2084 and confirm tetrahedral geometry (109.5\u00B0)' },
          { id: 'build-nh3', label: 'Build NH\u2083 and observe the lone pair creating trigonal pyramidal shape' },
          { id: 'build-h2o', label: 'Build H\u2082O and see two lone pairs creating bent geometry' },
          { id: 'build-xef2', label: 'Build XeF\u2082 and discover linear shape from 3 lone pairs' },
        ],
      },
      {
        type: 'keyInsight',
        content: 'Lone pairs take up more angular space than bonding pairs (they are held closer to the central atom). This is why bond angles decrease: CH\u2084 (109.5\u00B0) > NH\u2083 (107\u00B0) > H\u2082O (104.5\u00B0). Each lone pair compresses the bond angles slightly.'
      },
      {
        type: 'text',
        content: '**Key VSEPR Geometries (based on electron domains around central atom):**\n\n| Electron Domains | Electron Geometry | Example |\n| 2 | Linear | BeCl\u2082 |\n| 3 | Trigonal planar | BF\u2083 |\n| 4 | Tetrahedral | CH\u2084 |\n| 5 | Trigonal bipyramidal | PCl\u2085 |\n| 6 | Octahedral | SF\u2086 |\n\nAn electron domain is either a bond (single, double, or triple counts as one domain) or a lone pair.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What is the molecular geometry of NH\u2083?',
        options: ['Tetrahedral', 'Trigonal pyramidal', 'Trigonal planar', 'Bent'],
        correctAnswer: 1,
        explanation: 'N has 4 electron domains (3 bonds + 1 lone pair). Electron geometry is tetrahedral, but the molecular shape (based on atom positions) is trigonal pyramidal.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What is the molecular geometry of XeF\u2082?',
        options: ['Linear', 'Bent', 'Trigonal planar', 'T-shaped'],
        correctAnswer: 0,
        explanation: 'Xe has 5 electron domains (2 bonds + 3 lone pairs). Electron geometry is trigonal bipyramidal. The 3 lone pairs occupy equatorial positions, placing the 2 F atoms in axial positions: linear molecular geometry.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'vg-q1',
            question: 'What is the bond angle in a molecule with 4 electron domains and no lone pairs?',
            type: 'number',
            correctAnswer: 109.5,
            unit: '\u00B0',
            explanation: 'This is tetrahedral geometry with bond angle 109.5\u00B0 (e.g., CH\u2084).'
          },
          {
            id: 'vg-q2',
            question: 'What is the molecular shape of SF\u2084?',
            type: 'mcq',
            options: ['Tetrahedral', 'See-saw', 'Square planar', 'Trigonal bipyramidal'],
            correctAnswer: 1,
            explanation: 'S has 5 electron domains (4 bonds + 1 lone pair). The lone pair occupies an equatorial position, giving a "see-saw" or "distorted tetrahedron" shape.'
          },
          {
            id: 'vg-q3',
            question: 'CO\u2082 is linear. Why?',
            type: 'mcq',
            options: [
              'C has no lone pairs and 2 electron domains (double bonds count as one domain each)',
              'C has 4 electron domains',
              'O atoms repel each other',
              'C is very electronegative'
            ],
            correctAnswer: 0,
            explanation: 'C in CO\u2082 has 2 electron domains (2 double bonds). 2 domains arrange linearly at 180\u00B0.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Hybridization ==========
  {
    id: 'hybridization',
    name: 'Hybridization',
    constellationId: 'bond-matrix',
    order: 5,
    duration: 10,
    xp: 25,
    concepts: ['sp3-hybridization', 'sp2-hybridization', 'sp-hybridization', 'sigma-pi-bonds'],
    blocks: [
      {
        type: 'text',
        content: 'Carbon has 2 electrons in 2s and 2 in 2p, yet it forms 4 equivalent bonds in methane. How? The answer is **hybridization**: atomic orbitals mix to form new, equivalent **hybrid orbitals** that are better suited for bonding.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'molecule-builder',
        title: 'Hybridization & Bond Explorer',
        description: 'Build molecules and see hybridization labels auto-assigned to each atom. Toggle an overlay that highlights sigma bonds (along the axis) vs pi bonds (above/below). Count \u03C3 and \u03C0 bonds to verify your understanding.',
        goals: [
          { id: 'build-ethylene', label: 'Build ethylene (C\u2082H\u2084) and verify sp\u00B2 hybridization with 1 \u03C0 bond' },
          { id: 'build-acetylene', label: 'Build acetylene (C\u2082H\u2082) and verify sp hybridization with 2 \u03C0 bonds' },
          { id: 'build-sf6', label: 'Build SF\u2086 and confirm sp\u00B3d\u00B2 hybridization on sulfur' },
        ],
      },
      {
        type: 'keyInsight',
        content: 'Quick counting: total bonds in a molecule = (number of \u03C3 bonds) + (number of \u03C0 bonds). Every single bond is 1\u03C3. Every double bond is 1\u03C3 + 1\u03C0. Every triple bond is 1\u03C3 + 2\u03C0.'
      },
      {
        type: 'formula',
        title: 'Quick Hybridization Rule',
        formulas: [
          { label: 'Hybridization', formula: 'Count electron domains around the atom', note: '' },
          { label: '2 domains', formula: 'sp', note: 'Linear' },
          { label: '3 domains', formula: 'sp\u00B2', note: 'Trigonal planar' },
          { label: '4 domains', formula: 'sp\u00B3', note: 'Tetrahedral' },
          { label: '5 domains', formula: 'sp\u00B3d', note: 'Trigonal bipyramidal' },
          { label: '6 domains', formula: 'sp\u00B3d\u00B2', note: 'Octahedral' }
        ]
      },
      {
        type: 'text',
        content: '**Sigma (\u03C3) and Pi (\u03C0) Bonds:**\n- A **sigma bond** is head-on overlap of orbitals (along the bond axis). Every single bond is a sigma bond.\n- A **pi bond** is sideways overlap of unhybridized p orbitals (above and below the bond axis).\n- Double bond = 1\u03C3 + 1\u03C0. Triple bond = 1\u03C3 + 2\u03C0.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What is the hybridization of carbon in CO\u2082?',
        options: ['sp\u00B3', 'sp\u00B2', 'sp', 'sp\u00B3d'],
        correctAnswer: 2,
        explanation: 'C in CO\u2082 has 2 electron domains (2 double bonds). 2 domains = sp hybridization. Linear geometry.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many pi (\u03C0) bonds are in C\u2082H\u2082 (acetylene, H-C\u2261C-H)?',
        correctAnswer: 2,
        unit: '',
        explanation: 'The triple bond C\u2261C has 1\u03C3 + 2\u03C0 bonds. Total \u03C0 bonds = 2.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'hy-q1',
            question: 'What is the hybridization of N in NH\u2083?',
            type: 'mcq',
            options: ['sp', 'sp\u00B2', 'sp\u00B3', 'sp\u00B3d'],
            correctAnswer: 2,
            explanation: 'N in NH\u2083 has 4 electron domains (3 bonds + 1 lone pair). 4 domains = sp\u00B3 hybridization.'
          },
          {
            id: 'hy-q2',
            question: 'How many sigma and pi bonds are in H\u2082C=CH\u2082 (ethylene)?',
            type: 'mcq',
            options: ['4\u03C3, 1\u03C0', '5\u03C3, 1\u03C0', '4\u03C3, 2\u03C0', '6\u03C3, 0\u03C0'],
            correctAnswer: 1,
            explanation: 'Each C-H is 1\u03C3 (4 total). C=C is 1\u03C3 + 1\u03C0. Total: 5\u03C3 + 1\u03C0.'
          },
          {
            id: 'hy-q3',
            question: 'What is the hybridization of S in SF\u2086?',
            type: 'mcq',
            options: ['sp\u00B3', 'sp\u00B3d', 'sp\u00B3d\u00B2', 'sp\u00B2'],
            correctAnswer: 2,
            explanation: 'S has 6 electron domains (6 bonds). 6 domains = sp\u00B3d\u00B2 hybridization. Octahedral.'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Molecular Orbital Theory ==========
  {
    id: 'molecular-orbitals',
    name: 'Molecular Orbital Theory',
    constellationId: 'bond-matrix',
    order: 6,
    duration: 10,
    xp: 25,
    concepts: ['bonding-antibonding', 'molecular-orbital-diagram', 'bond-order', 'paramagnetism'],
    blocks: [
      {
        type: 'text',
        content: 'Lewis structures and hybridization work well for most molecules, but they fail to explain why O\u2082 is magnetic. **Molecular Orbital (MO) Theory** provides a more complete picture: atomic orbitals combine to form molecular orbitals that belong to the entire molecule.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'bond-polarity',
        title: 'Molecular Orbital Viewer',
        description: 'Select a diatomic molecule and watch atomic orbitals combine into bonding and antibonding molecular orbitals. Fill electrons into the MO diagram and calculate bond order. Toggle a magnet to test paramagnetism.',
        controls: [],
        discoveries: [
          { id: 'bonding-antibonding', label: 'Bonding MOs are lower energy than antibonding MOs', hint: 'Look at the MO diagram for H\u2082 and notice the energy levels' },
          { id: 'o2-paramagnetic', label: 'O\u2082 has unpaired electrons making it paramagnetic', hint: 'Fill the MO diagram for O\u2082 and check the \u03C0* orbitals' },
          { id: 'he2-unstable', label: 'He\u2082 has bond order 0 and does not exist', hint: 'Fill the MO diagram for He\u2082 and calculate the bond order' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'O\u2082 has 2 unpaired electrons in \u03C0*2p orbitals (by Hund\'s rule). This makes O\u2082 paramagnetic (attracted to magnets). Lewis structure predicts all paired electrons and cannot explain this. MO theory gets it right.'
      },
      {
        type: 'formula',
        title: 'Bond Order from MO Theory',
        formulas: [
          { label: 'Bond Order', formula: 'BO = (bonding e\u207B - antibonding e\u207B) / 2', note: 'BO > 0 means bond exists; higher BO = stronger bond' }
        ]
      },
      {
        type: 'text',
        content: '**MO filling order for O\u2082, F\u2082, Ne\u2082:**\n\u03C31s < \u03C3*1s < \u03C32s < \u03C3*2s < \u03C32p < \u03C02p = \u03C02p < \u03C0*2p = \u03C0*2p < \u03C3*2p\n\n**For B\u2082, C\u2082, N\u2082** (Z \u2264 7): the \u03C3 2p and \u03C0 2p swap:\n\u03C31s < \u03C3*1s < \u03C32s < \u03C3*2s < \u03C02p = \u03C02p < \u03C32p < \u03C0*2p = \u03C0*2p < \u03C3*2p',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'What is the bond order of N\u2082? (N has 7 electrons, N\u2082 has 14)',
        correctAnswer: 3,
        unit: '',
        explanation: 'N\u2082: (\u03C31s)\u00B2(\u03C3*1s)\u00B2(\u03C32s)\u00B2(\u03C3*2s)\u00B2(\u03C02p)\u2074(\u03C32p)\u00B2. Bonding = 10, Antibonding = 4. BO = (10-4)/2 = 3. Triple bond, consistent with N\u2261N.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mo-q1',
            question: 'Is O\u2082 paramagnetic or diamagnetic?',
            type: 'mcq',
            options: ['Paramagnetic', 'Diamagnetic'],
            correctAnswer: 0,
            explanation: 'O\u2082 has 2 unpaired electrons in \u03C0*2p orbitals. Unpaired electrons make it paramagnetic.'
          },
          {
            id: 'mo-q2',
            question: 'What is the bond order of He\u2082 (4 electrons total)?',
            type: 'number',
            correctAnswer: 0,
            unit: '',
            explanation: '(\u03C31s)\u00B2(\u03C3*1s)\u00B2. Bonding = 2, Antibonding = 2. BO = 0. He\u2082 does not exist as a stable molecule.'
          }
        ]
      }
    ]
  },

  // ========== STAR 7: Intermolecular Forces ==========
  {
    id: 'intermolecular-forces',
    name: 'Intermolecular Forces',
    constellationId: 'bond-matrix',
    order: 7,
    duration: 8,
    xp: 20,
    concepts: ['london-dispersion', 'dipole-dipole', 'hydrogen-bonding', 'boiling-point-trends'],
    blocks: [
      {
        type: 'text',
        content: 'Why is water a liquid at room temperature while CO\u2082 is a gas, even though CO\u2082 is heavier? The answer lies not in the bonds within molecules but in the forces BETWEEN molecules: **intermolecular forces (IMFs)**.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'bond-polarity',
        title: 'Intermolecular Force Identifier',
        description: 'Select a molecule and see its 3D shape, bond polarities, and overall dipole moment. The simulator identifies which intermolecular forces are present and ranks their relative strength. Compare boiling points of different molecules.',
        controls: [],
        discoveries: [
          { id: 'hbond-water', label: 'Water has strong hydrogen bonds due to O-H groups', hint: 'Select H\u2082O and look at the IMF breakdown' },
          { id: 'ldf-only', label: 'Nonpolar molecules only have London dispersion forces', hint: 'Select CH\u2084 or CCl\u2084 and check which IMFs are present' },
          { id: 'bp-correlation', label: 'Stronger IMFs correlate with higher boiling points', hint: 'Compare the boiling points of Ar, HCl, and H\u2082O' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Water has an abnormally high boiling point (100\u00B0C) for its size because of hydrogen bonding. Without H-bonds, water would boil at about -80\u00B0C based on its molecular weight, and life as we know it would be impossible.'
      },
      {
        type: 'text',
        content: '**Types of IMFs (weakest to strongest):**\n\n1. **London Dispersion Forces (LDF):** Present in ALL molecules. Caused by temporary dipoles from electron fluctuations. Strength increases with molecular size and surface area.\n\n2. **Dipole-Dipole Forces:** Between polar molecules. The \u03B4+ of one attracts \u03B4- of another.\n\n3. **Hydrogen Bonding:** Special, strong dipole-dipole. Occurs when H is bonded to F, O, or N (very electronegative, small atoms). The H has a very strong \u03B4+ and can interact with lone pairs on F, O, or N of another molecule.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which has the higher boiling point: CH\u2083OH (methanol) or CH\u2083CH\u2083 (ethane)?',
        options: ['CH\u2083OH', 'CH\u2083CH\u2083', 'About the same'],
        correctAnswer: 0,
        explanation: 'CH\u2083OH can hydrogen bond (O-H group), giving it much stronger IMFs. Its bp is 65\u00B0C. CH\u2083CH\u2083 only has London forces, bp = -89\u00B0C.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which IMF is responsible for the fact that noble gases can be liquefied at very low temperatures?',
        options: ['Hydrogen bonding', 'Dipole-dipole', 'London dispersion forces', 'Ionic bonding'],
        correctAnswer: 2,
        explanation: 'Noble gases are nonpolar with no permanent dipole. Only London dispersion forces (temporary dipoles) hold them together. These are weak, so very low temperatures are needed.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'imf-q1',
            question: 'Which molecule can form hydrogen bonds?',
            type: 'mcq',
            options: ['CH\u2084', 'HF', 'CO\u2082', 'CCl\u2084'],
            correctAnswer: 1,
            explanation: 'HF has H bonded to F, meeting the requirement for hydrogen bonding. CH\u2084 has H bonded to C (not electronegative enough).'
          },
          {
            id: 'imf-q2',
            question: 'Arrange in order of increasing boiling point: Ar, HCl, H\u2082O',
            type: 'mcq',
            options: ['Ar < HCl < H\u2082O', 'H\u2082O < HCl < Ar', 'HCl < Ar < H\u2082O', 'Ar < H\u2082O < HCl'],
            correctAnswer: 0,
            explanation: 'Ar: only LDF (-186\u00B0C). HCl: dipole-dipole + LDF (-85\u00B0C). H\u2082O: H-bonding + dipole-dipole + LDF (100\u00B0C).'
          }
        ]
      }
    ]
  },

  // ========== STAR 8: Bond Matrix Mastery ==========
  {
    id: 'bond-mastery',
    name: 'Bond Matrix Mastery',
    constellationId: 'bond-matrix',
    order: 8,
    duration: 8,
    xp: 30,
    concepts: ['bonding-review', 'structure-property-relationships', 'advanced-problems'],
    blocks: [
      {
        type: 'text',
        content: 'The Bond Matrix mastery challenge integrates ionic and covalent bonding, Lewis structures, VSEPR geometry, hybridization, MO theory, and intermolecular forces. The true master sees how structure determines properties.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'molecule-builder',
        title: 'Molecular Analysis Lab',
        description: 'Build any molecule from scratch and get a full analysis: Lewis structure, VSEPR geometry, hybridization state, bond polarity, molecular polarity, and intermolecular forces. Use this as your bonding analysis workbench.',
        goals: [
          { id: 'analyze-ccl4', label: 'Build CCl\u2084 and verify it is tetrahedral and nonpolar despite polar bonds' },
          { id: 'analyze-chcl3', label: 'Build CHCl\u2083 and confirm it is polar (dipole does not cancel)' },
          { id: 'analyze-xef4', label: 'Build XeF\u2084 and discover square planar geometry with 2 lone pairs' },
        ],
      },
      {
        type: 'challenge',
        simType: 'reaction-balancer',
        title: 'Bond Mastery Speed Round',
        description: 'Given a molecular formula, predict the Lewis structure, geometry, hybridization, and polarity before time runs out. Earn points for each correct prediction in the bonding analysis pipeline.',
        objective: 'Complete the full bonding analysis for 5 molecules',
        targetScore: 70,
      },
      {
        type: 'keyInsight',
        content: 'The bonding analysis pipeline:\n1. Determine bond type (ionic vs covalent vs metallic)\n2. Draw Lewis structure\n3. Count electron domains \u2192 VSEPR shape\n4. Determine hybridization\n5. Identify polarity (bond and molecular)\n6. Predict IMFs and physical properties'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Molecule X is tetrahedral, nonpolar, and has only London dispersion forces. It could be:',
        options: ['NH\u2083', 'CCl\u2084', 'H\u2082O', 'CHCl\u2083'],
        correctAnswer: 1,
        explanation: 'CCl\u2084 is tetrahedral (4 identical bonds, no lone pairs on C). Because all 4 bonds are identical, dipoles cancel: nonpolar. Only LDF apply.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'bm-q1',
            question: 'ClF\u2083 has a T-shaped molecular geometry. What is the hybridization of Cl?',
            type: 'mcq',
            options: ['sp\u00B2', 'sp\u00B3', 'sp\u00B3d', 'sp\u00B3d\u00B2'],
            correctAnswer: 2,
            explanation: 'Cl has 5 electron domains (3 bonds + 2 lone pairs). 5 domains = sp\u00B3d hybridization.'
          },
          {
            id: 'bm-q2',
            question: 'PCl\u2085 exists but NCl\u2085 does not. Why?',
            type: 'mcq',
            options: [
              'N is too small',
              'N does not have d orbitals available for expanded octet',
              'N is too electronegative',
              'PCl\u2085 is ionic'
            ],
            correctAnswer: 1,
            explanation: 'N is in Period 2 with no d orbitals. It cannot expand beyond an octet. P is in Period 3 and can use 3d orbitals for sp\u00B3d hybridization.'
          },
          {
            id: 'bm-q3',
            question: 'In which molecule is the central atom sp\u00B2 hybridized with one lone pair?',
            type: 'mcq',
            options: ['BF\u2083', 'SO\u2082', 'CO\u2082', 'H\u2082O'],
            correctAnswer: 1,
            explanation: 'SO\u2082: S has 3 electron domains (2 double bonds + 1 lone pair). 3 domains = sp\u00B2. The lone pair gives bent molecular geometry.'
          },
          {
            id: 'bm-q4',
            question: 'Predict the boiling point order: Ne, HBr, H\u2082O, CH\u2083OH',
            type: 'mcq',
            options: [
              'Ne < HBr < CH\u2083OH < H\u2082O',
              'Ne < HBr < H\u2082O < CH\u2083OH',
              'HBr < Ne < H\u2082O < CH\u2083OH',
              'Ne < CH\u2083OH < HBr < H\u2082O'
            ],
            correctAnswer: 0,
            explanation: 'Ne: only LDF (-246\u00B0C). HBr: dipole + LDF (-67\u00B0C). CH\u2083OH: H-bonding (65\u00B0C). H\u2082O: extensive H-bonding (100\u00B0C). H\u2082O > CH\u2083OH because water has 2 H-bond donors and 2 acceptors.'
          }
        ]
      }
    ]
  }
];
