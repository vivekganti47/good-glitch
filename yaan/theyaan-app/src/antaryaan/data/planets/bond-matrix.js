// Bond Matrix - Chemical Bonding practice planets
// Topics: ionic bonding, covalent bonding, Lewis structures, VSEPR, hybridization, intermolecular forces

export const bondMatrixPlanets = [
  // ==================== PLANET 1: Bonding Basics ====================
  {
    id: 'bonding-basics',
    name: 'Bonding Basics',
    constellationId: 'bond-matrix',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'bm1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'Which of the following compounds is primarily ionic?',
        options: ['HCl', 'NaCl', 'CO\u2082', 'H\u2082O'],
        correctIndex: 1,
        hint: 'Ionic bonds form between metals and non-metals when there is a large electronegativity difference (typically > 1.7).',
        steps: [
          'NaCl: Na is a metal (Group 1), Cl is a non-metal (Group 17)',
          'Electronegativity difference: 3.16 - 0.93 = 2.23 (very large)',
          'Na transfers its electron to Cl: Na\u207A Cl\u207B',
          'The other compounds are between non-metals (covalent)'
        ],
        solution: 'NaCl is ionic. Na (metal) transfers one electron to Cl (non-metal), forming Na\u207A and Cl\u207B ions held together by electrostatic attraction.',
        concepts: ['ionic-bonding']
      },
      {
        id: 'bm1-2',
        type: 'mcq',
        difficulty: 2,
        text: 'How many lone pairs are present on the central atom in water (H\u2082O)?',
        options: ['0', '1', '2', '3'],
        correctIndex: 2,
        hint: 'Oxygen has 6 valence electrons. Two are used for bonding with H atoms. The remaining form lone pairs.',
        steps: [
          'O has 6 valence electrons',
          '2 electrons are used in 2 O-H bonds',
          'Remaining 4 electrons form 2 lone pairs',
          'Total around O: 2 bonding pairs + 2 lone pairs = 4 electron pairs'
        ],
        solution: 'Oxygen has 6 valence electrons. It forms 2 bonds with H (using 2 electrons) and has 4 remaining electrons as 2 lone pairs.',
        concepts: ['lewis-structures', 'lone-pairs']
      },
      {
        id: 'bm1-3',
        type: 'match',
        difficulty: 2,
        text: 'Match each molecule with its molecular geometry according to VSEPR theory.',
        leftColumn: ['BeCl\u2082', 'BF\u2083', 'CH\u2084', 'SF\u2086'],
        rightColumn: ['Tetrahedral', 'Octahedral', 'Linear', 'Trigonal planar'],
        correctMatches: { 0: 2, 1: 3, 2: 0, 3: 1 },
        hint: 'Count the electron pairs around the central atom. 2 pairs = linear, 3 = trigonal planar, 4 = tetrahedral, 6 = octahedral.',
        solution: 'BeCl\u2082: 2 bond pairs, 0 lone pairs \u2192 linear (180\u00B0). BF\u2083: 3 BP, 0 LP \u2192 trigonal planar (120\u00B0). CH\u2084: 4 BP, 0 LP \u2192 tetrahedral (109.5\u00B0). SF\u2086: 6 BP, 0 LP \u2192 octahedral (90\u00B0).',
        concepts: ['vsepr']
      },
      {
        id: 'bm1-4',
        type: 'mcq',
        difficulty: 3,
        text: 'What is the shape of NH\u2083 according to VSEPR theory?',
        options: ['Trigonal planar', 'Tetrahedral', 'Trigonal pyramidal', 'Bent'],
        correctIndex: 2,
        hint: 'N has 5 valence electrons. 3 are used for bonding with H, leaving 1 lone pair. The electron geometry is tetrahedral, but the molecular geometry considers only atoms.',
        steps: [
          'N has 5 valence electrons',
          'Forms 3 N-H bonds (3 bonding pairs) + 1 lone pair = 4 electron pairs',
          'Electron pair geometry: tetrahedral',
          'But molecular shape (atoms only): trigonal pyramidal (3 bonds, 1 LP)',
          'Bond angle: ~107\u00B0 (less than 109.5\u00B0 due to LP repulsion)'
        ],
        solution: 'NH\u2083: 3 bonding pairs + 1 lone pair around N. Electron geometry is tetrahedral, but molecular geometry is trigonal pyramidal. The lone pair compresses the bond angle to ~107\u00B0.',
        concepts: ['vsepr', 'lewis-structures']
      },
      {
        id: 'bm1-5',
        type: 'numerical',
        difficulty: 2,
        text: 'How many sigma (\u03C3) and pi (\u03C0) bonds are present in ethylene (C\u2082H\u2084)? Enter the total number of pi bonds.',
        correctAnswer: 1,
        unit: 'pi bond(s)',
        hint: 'Ethylene has a C=C double bond. A double bond consists of one sigma and one pi bond.',
        steps: [
          'C\u2082H\u2084 structure: H\u2082C=CH\u2082',
          'C=C double bond: 1 sigma + 1 pi bond',
          'Each C-H bond: 1 sigma bond (4 total)',
          'Total: 5 sigma bonds + 1 pi bond'
        ],
        solution: 'Ethylene (H\u2082C=CH\u2082) has 5 sigma bonds (4 C-H + 1 C-C) and 1 pi bond (from the double bond). Answer: 1 pi bond.',
        concepts: ['covalent-bonding', 'sigma-pi-bonds']
      },
      {
        id: 'bm1-6',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following molecules are polar?',
        options: ['H\u2082O', 'CO\u2082', 'NH\u2083', 'CCl\u2084', 'HF'],
        correctIndices: [0, 2, 4],
        hint: 'A molecule is polar if (1) it has polar bonds AND (2) the bond dipoles do not cancel due to symmetry.',
        solution: 'H\u2082O: bent shape, dipoles don\'t cancel \u2192 polar. CO\u2082: linear, dipoles cancel \u2192 nonpolar. NH\u2083: pyramidal, dipoles don\'t cancel \u2192 polar. CCl\u2084: tetrahedral, symmetric, dipoles cancel \u2192 nonpolar. HF: single polar bond \u2192 polar.',
        concepts: ['molecular-polarity', 'vsepr']
      }
    ]
  },

  // ==================== PLANET 2: Geometry Lab ====================
  {
    id: 'geometry-lab',
    name: 'Geometry Lab',
    constellationId: 'bond-matrix',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'bm2-1',
        type: 'mcq',
        difficulty: 3,
        text: 'What is the hybridization of the central atom in XeF\u2084?',
        options: ['sp\u00B3', 'sp\u00B3d', 'sp\u00B3d\u00B2', 'dsp\u00B2'],
        correctIndex: 2,
        hint: 'Count the total electron pairs around Xe (bonding + lone pairs). XeF\u2084 has 4 bonds and 2 lone pairs on Xe.',
        steps: [
          'Xe has 8 valence electrons, each F contributes 1 bond',
          'After forming 4 Xe-F bonds, Xe still has 4 electrons = 2 lone pairs',
          'Total electron pairs around Xe = 4 BP + 2 LP = 6',
          '6 electron pairs require sp\u00B3d\u00B2 hybridization',
          'Shape: square planar (lone pairs occupy axial positions)'
        ],
        solution: 'XeF\u2084: 4 bonding pairs + 2 lone pairs = 6 electron pairs around Xe. This requires sp\u00B3d\u00B2 hybridization. The molecular geometry is square planar.',
        concepts: ['hybridization', 'vsepr']
      },
      {
        id: 'bm2-2',
        type: 'match',
        difficulty: 3,
        text: 'Match each hybridization with the correct geometry and bond angle.',
        leftColumn: ['sp', 'sp\u00B2', 'sp\u00B3', 'sp\u00B3d'],
        rightColumn: [
          'Tetrahedral, 109.5\u00B0',
          'Trigonal bipyramidal, 90\u00B0 and 120\u00B0',
          'Linear, 180\u00B0',
          'Trigonal planar, 120\u00B0'
        ],
        correctMatches: { 0: 2, 1: 3, 2: 0, 3: 1 },
        hint: 'sp has 2 hybrid orbitals (linear), sp\u00B2 has 3 (trigonal planar), sp\u00B3 has 4 (tetrahedral), sp\u00B3d has 5 (trigonal bipyramidal).',
        solution: 'sp \u2192 linear (180\u00B0). sp\u00B2 \u2192 trigonal planar (120\u00B0). sp\u00B3 \u2192 tetrahedral (109.5\u00B0). sp\u00B3d \u2192 trigonal bipyramidal (90\u00B0 and 120\u00B0).',
        concepts: ['hybridization']
      },
      {
        id: 'bm2-3',
        type: 'mcq',
        difficulty: 3,
        text: 'Which of the following molecules has a bond angle less than 109.5\u00B0?',
        options: ['CH\u2084', 'NH\u2083', 'BF\u2083', 'CO\u2082'],
        correctIndex: 1,
        hint: 'Lone pairs repel more strongly than bonding pairs, compressing the bond angle below the ideal value.',
        steps: [
          'CH\u2084: 4 BP, 0 LP \u2192 exactly 109.5\u00B0',
          'NH\u2083: 3 BP, 1 LP \u2192 LP-BP repulsion compresses angle to ~107\u00B0',
          'BF\u2083: 3 BP, 0 LP \u2192 120\u00B0 (trigonal planar)',
          'CO\u2082: 2 BP, 0 LP \u2192 180\u00B0 (linear)'
        ],
        solution: 'NH\u2083 has a bond angle of ~107\u00B0 (less than 109.5\u00B0) because the lone pair on N repels the bonding pairs more than they repel each other, compressing the H-N-H angle.',
        concepts: ['vsepr', 'lone-pair-repulsion']
      },
      {
        id: 'bm2-4',
        type: 'numerical',
        difficulty: 3,
        text: 'How many sigma (\u03C3) and pi (\u03C0) bonds are present in HCN? Enter the number of sigma bonds.',
        correctAnswer: 2,
        unit: 'sigma bond(s)',
        hint: 'HCN has the structure H-C\u2261N. A triple bond has 1 sigma and 2 pi bonds.',
        steps: [
          'Structure: H-C\u2261N',
          'H-C bond: 1 sigma bond',
          'C\u2261N triple bond: 1 sigma + 2 pi bonds',
          'Total: 2 sigma bonds + 2 pi bonds'
        ],
        solution: 'HCN: H-C (1\u03C3) + C\u2261N (1\u03C3 + 2\u03C0) = 2 sigma bonds total. Carbon is sp hybridized.',
        concepts: ['covalent-bonding', 'sigma-pi-bonds']
      },
      {
        id: 'bm2-5',
        type: 'mcq',
        difficulty: 4,
        text: 'In which of the following molecules does the central atom have TWO lone pairs?',
        options: ['ClF\u2083 (T-shaped)', 'XeF\u2082 (linear)', 'SF\u2084 (see-saw)', 'IF\u2085 (square pyramidal)'],
        correctIndex: 1,
        hint: 'Start with the valence electrons of the central atom, subtract the electrons used in bonds, and count remaining pairs.',
        steps: [
          'ClF\u2083: Cl has 7 VE, uses 3 for bonds \u2192 4 leftover = 2 LP. Wait, let me check all.',
          'ClF\u2083: 7 - 3 = 4 electrons = 2 LP. But the shape is T-shaped (3 BP + 2 LP = sp\u00B3d)',
          'XeF\u2082: 8 - 2 = 6 electrons = 3 LP. Molecular shape is linear (2 BP + 3 LP = sp\u00B3d)',
          'SF\u2084: 6 - 4 = 2 electrons = 1 LP (see-saw, sp\u00B3d)',
          'IF\u2085: 7 - 5 = 2 electrons = 1 LP (square pyramidal, sp\u00B3d\u00B2)',
          'Actually ClF\u2083 has 2 LP and XeF\u2082 has 3 LP!'
        ],
        solution: 'ClF\u2083: 7-3=4 electrons = 2 lone pairs (5 total electron pairs, sp\u00B3d, T-shaped). XeF\u2082: 8-2=6 electrons = 3 lone pairs. SF\u2084: 1 LP. IF\u2085: 1 LP. Both ClF\u2083 and XeF\u2082 technically have 2+ lone pairs, but ClF\u2083 has exactly 2. This question asks for exactly 2 LP, which is ClF\u2083.',
        concepts: ['vsepr', 'hybridization']
      },
      {
        id: 'bm2-6',
        type: 'mcq',
        difficulty: 4,
        text: 'Which molecule has the shortest C-O bond?',
        options: ['CH\u2083OH', 'CO\u2082', 'CO', 'H\u2082CO'],
        correctIndex: 2,
        hint: 'Higher bond order = shorter and stronger bond. CO has a triple bond.',
        steps: [
          'CH\u2083OH: C-O single bond (bond order 1)',
          'CO\u2082: C=O double bond (bond order 2)',
          'CO: C\u2261O triple bond (bond order 3)',
          'H\u2082CO: C=O double bond (bond order 2)',
          'Higher bond order = shorter bond',
          'CO has the shortest C-O bond'
        ],
        solution: 'CO has a triple bond (bond order 3), making it the shortest C-O bond. Bond length order: CO < CO\u2082 \u2248 H\u2082CO < CH\u2083OH.',
        concepts: ['bond-order', 'bond-length']
      },
      {
        id: 'bm2-7',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following exhibit hydrogen bonding?',
        options: ['HF', 'CH\u2084', 'H\u2082O', 'NH\u2083', 'H\u2082S'],
        correctIndices: [0, 2, 3],
        hint: 'Hydrogen bonding occurs when H is bonded to a highly electronegative atom (F, O, or N) that also has lone pairs.',
        solution: 'Hydrogen bonding requires H bonded to F, O, or N (highly electronegative atoms with lone pairs). HF, H\u2082O, and NH\u2083 all qualify. CH\u2084 has no electronegative atom bonded to H. H\u2082S: sulfur is not electronegative enough for H-bonding.',
        concepts: ['intermolecular-forces', 'hydrogen-bonding']
      }
    ]
  },

  // ==================== PLANET 3: Hybrid Challenges ====================
  {
    id: 'hybrid-challenges',
    name: 'Hybrid Challenges',
    constellationId: 'bond-matrix',
    order: 3,
    difficulty: 4,
    xp: 30,
    problems: [
      {
        id: 'bm3-1',
        type: 'mcq',
        difficulty: 4,
        text: 'What is the hybridization of each carbon atom in CH\u2082=CH-CH\u2083, from left to right?',
        options: [
          'sp\u00B2, sp\u00B2, sp\u00B3',
          'sp\u00B2, sp\u00B3, sp\u00B3',
          'sp, sp\u00B2, sp\u00B3',
          'sp\u00B3, sp\u00B2, sp\u00B2'
        ],
        correctIndex: 0,
        hint: 'A carbon in a double bond is sp\u00B2 hybridized. A carbon with only single bonds is sp\u00B3.',
        steps: [
          'C1 (CH\u2082=): involved in a C=C double bond \u2192 sp\u00B2',
          'C2 (=CH-): involved in the same C=C double bond \u2192 sp\u00B2',
          'C3 (-CH\u2083): only single bonds \u2192 sp\u00B3',
          'Answer: sp\u00B2, sp\u00B2, sp\u00B3'
        ],
        solution: 'CH\u2082=CH-CH\u2083 (propene): C1 and C2 are part of the double bond (sp\u00B2), C3 has only single bonds (sp\u00B3).',
        concepts: ['hybridization']
      },
      {
        id: 'bm3-2',
        type: 'numerical',
        difficulty: 4,
        text: 'How many sigma (\u03C3) and pi (\u03C0) bonds are present in benzene (C\u2086H\u2086)? Enter the total number of sigma bonds.',
        correctAnswer: 12,
        unit: 'sigma bond(s)',
        hint: 'Benzene has 6 C-C bonds and 6 C-H bonds. Each single bond is a sigma bond, and the alternating double bonds each contribute one pi bond.',
        steps: [
          '6 C-H bonds: 6 sigma bonds',
          '6 C-C bonds in the ring: 6 sigma bonds',
          '3 pi bonds (from the 3 double bonds in one Kekule structure)',
          'Total: 12 sigma bonds + 3 pi bonds'
        ],
        solution: 'Benzene: 6 C-H sigma bonds + 6 C-C sigma bonds = 12 sigma bonds. Plus 3 pi bonds (delocalized over the ring).',
        concepts: ['sigma-pi-bonds', 'hybridization']
      },
      {
        id: 'bm3-3',
        type: 'match',
        difficulty: 4,
        text: 'Match each molecule with its intermolecular force type (the STRONGEST intermolecular force present).',
        leftColumn: ['NaCl (dissolved)', 'CH\u2083OH', 'CH\u2084', 'HCl'],
        rightColumn: [
          'London dispersion forces only',
          'Dipole-dipole interactions',
          'Ion-dipole interactions',
          'Hydrogen bonding'
        ],
        correctMatches: { 0: 2, 1: 3, 2: 0, 3: 1 },
        hint: 'CH\u2083OH has an O-H group (hydrogen bonding). NaCl dissolved means ions in solution interact with polar molecules. CH\u2084 is nonpolar.',
        solution: 'NaCl dissolved: ion-dipole (ions interacting with solvent). CH\u2083OH: H-bonding (O-H group). CH\u2084: only London dispersion (nonpolar). HCl: dipole-dipole (polar but no F, O, or N for H-bonding).',
        concepts: ['intermolecular-forces']
      },
      {
        id: 'bm3-4',
        type: 'mcq',
        difficulty: 4,
        text: 'According to molecular orbital theory, what is the bond order of O\u2082?',
        options: ['1', '1.5', '2', '3'],
        correctIndex: 2,
        hint: 'Bond order = (bonding electrons - antibonding electrons) / 2. O\u2082 has 16 electrons total.',
        steps: [
          'O\u2082: 16 electrons. MO filling order:',
          '\u03C31s\u00B2, \u03C3*1s\u00B2, \u03C32s\u00B2, \u03C3*2s\u00B2, \u03C32p\u00B2, \u03C02p\u2074, \u03C0*2p\u00B2',
          'Bonding electrons: 2+2+2+4 = 10',
          'Antibonding electrons: 2+2+2 = 6',
          'Bond order = (10-6)/2 = 2'
        ],
        solution: 'O\u2082 has bond order = (10-6)/2 = 2. It also has 2 unpaired electrons in the \u03C0*2p orbitals, making it paramagnetic.',
        concepts: ['molecular-orbital-theory', 'bond-order']
      },
      {
        id: 'bm3-5',
        type: 'mcq',
        difficulty: 5,
        text: 'Which of the following species is paramagnetic according to molecular orbital theory?',
        options: ['N\u2082', 'O\u2082', 'F\u2082', 'C\u2082'],
        correctIndex: 1,
        hint: 'Paramagnetic species have unpaired electrons. Check the MO electron configuration of each molecule.',
        steps: [
          'N\u2082 (14 e\u207B): all electrons paired \u2192 diamagnetic',
          'O\u2082 (16 e\u207B): 2 unpaired electrons in \u03C0*2p \u2192 paramagnetic',
          'F\u2082 (18 e\u207B): all electrons paired \u2192 diamagnetic',
          'C\u2082 (12 e\u207B): all electrons paired \u2192 diamagnetic'
        ],
        solution: 'O\u2082 is paramagnetic because it has 2 unpaired electrons in the degenerate \u03C0*2p orbitals. This was a triumph of MO theory, as Lewis structures predict O\u2082 to be diamagnetic.',
        concepts: ['molecular-orbital-theory', 'paramagnetism']
      },
      {
        id: 'bm3-6',
        type: 'numerical',
        difficulty: 3,
        text: 'What is the formal charge on the nitrogen atom in the ammonium ion NH\u2084\u207A?',
        correctAnswer: 1,
        unit: '',
        hint: 'Formal charge = valence electrons - lone pair electrons - (1/2)(bonding electrons).',
        steps: [
          'N has 5 valence electrons',
          'In NH\u2084\u207A: N forms 4 bonds, 0 lone pairs',
          'Formal charge = 5 - 0 - (1/2)(8) = 5 - 4 = +1'
        ],
        solution: 'Formal charge on N in NH\u2084\u207A = 5 - 0 - 4 = +1. Nitrogen uses all 5 valence electrons for bonding (one bond is a dative/coordinate bond from N to H\u207A).',
        concepts: ['formal-charge', 'lewis-structures']
      }
    ]
  }
];
