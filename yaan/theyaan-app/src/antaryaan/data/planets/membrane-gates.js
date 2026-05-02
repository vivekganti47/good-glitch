// Membrane Gates - Membrane Transport & Biomolecules practice planets
// Topics: membrane structure, transport, osmosis, carbohydrates, proteins, lipids, nucleic acids, enzymes

export const membraneGatesPlanets = [
  // ==================== PLANET 1: Transport Mechanisms ====================
  {
    id: 'transport-mechanisms',
    name: 'Transport Mechanisms',
    constellationId: 'membrane-gates',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'mg1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'Which is the primary structural component of the cell membrane?',
        options: ['Carbohydrates', 'Phospholipid bilayer', 'Proteins only', 'Nucleic acids'],
        correctIndex: 1,
        hint: 'The fluid mosaic model describes the membrane. Its foundation is a double layer of amphipathic lipids.',
        steps: [
          'The cell membrane is built on a phospholipid bilayer',
          'Phospholipids have hydrophilic heads and hydrophobic tails',
          'They arrange with tails facing inward, heads facing outward',
          'Proteins, cholesterol, and carbohydrates are embedded in or attached to this bilayer'
        ],
        solution: 'The phospholipid bilayer forms the structural foundation of the cell membrane. Phospholipids are amphipathic: hydrophilic heads face aqueous environments while hydrophobic tails face inward.',
        concepts: ['phospholipid-bilayer', 'fluid-mosaic-model']
      },
      {
        id: 'mg1-2',
        type: 'match',
        difficulty: 2,
        text: 'Match each type of membrane transport with its correct description.',
        leftColumn: ['Simple diffusion', 'Facilitated diffusion', 'Active transport', 'Osmosis'],
        rightColumn: [
          'Movement of water across a semipermeable membrane from low to high solute concentration',
          'Movement of molecules through protein channels, down gradient, no ATP',
          'Movement of molecules against concentration gradient, requires ATP',
          'Movement of small nonpolar molecules directly through the bilayer, down gradient'
        ],
        correctMatches: { 0: 3, 1: 1, 2: 2, 3: 0 },
        hint: 'Passive transport (no ATP): simple diffusion, facilitated diffusion, osmosis. Active transport requires ATP.',
        solution: 'Simple diffusion: small nonpolar molecules pass through the bilayer. Facilitated: uses channel or carrier proteins, no ATP. Active: uses ATP to pump against gradient. Osmosis: water movement through a semipermeable membrane.',
        concepts: ['passive-transport', 'active-transport', 'osmosis']
      },
      {
        id: 'mg1-3',
        type: 'mcq',
        difficulty: 2,
        text: 'A red blood cell is placed in a hypertonic solution. What will happen?',
        options: [
          'It will swell and burst (lyse)',
          'It will shrink (crenate)',
          'Nothing will happen',
          'It will undergo mitosis'
        ],
        correctIndex: 1,
        hint: 'In a hypertonic solution, solute concentration is higher outside. Water moves from low solute to high solute.',
        steps: [
          'Hypertonic = higher solute concentration outside the cell',
          'Water moves OUT of the cell by osmosis (toward higher solute)',
          'The cell loses water and shrinks (crenation in animal cells)',
          'In a hypotonic solution, the opposite occurs (cell swells and may lyse)'
        ],
        solution: 'In a hypertonic solution, water leaves the cell by osmosis, causing it to shrink (crenate). In a hypotonic solution, water enters and the cell may lyse. In an isotonic solution, no net water movement occurs.',
        concepts: ['osmosis']
      },
      {
        id: 'mg1-4',
        type: 'mcq',
        difficulty: 3,
        text: 'The sodium-potassium pump (Na\u207A/K\u207A-ATPase) transports per cycle:',
        options: [
          '3 Na\u207A out and 2 K\u207A in per ATP hydrolyzed',
          '2 Na\u207A out and 3 K\u207A in per ATP hydrolyzed',
          '3 Na\u207A in and 2 K\u207A out per ATP hydrolyzed',
          'Equal numbers of Na\u207A and K\u207A in both directions'
        ],
        correctIndex: 0,
        hint: 'This pump is electrogenic because it moves unequal numbers of ions, creating a net charge difference.',
        solution: 'The Na\u207A/K\u207A-ATPase pumps 3 Na\u207A out and 2 K\u207A in per ATP hydrolyzed. This is active transport against concentration gradients and is electrogenic (net positive charge moved out), essential for nerve impulses.',
        concepts: ['active-transport']
      },
      {
        id: 'mg1-5',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following molecules can freely pass through the phospholipid bilayer by simple diffusion?',
        options: ['O\u2082', 'CO\u2082', 'Glucose', 'Na\u207A ions', 'Ethanol (small, partially nonpolar)'],
        correctIndices: [0, 1, 4],
        hint: 'Only small, nonpolar (or very small uncharged polar) molecules can pass through the hydrophobic core.',
        solution: 'O\u2082 and CO\u2082 are small and nonpolar, passing easily. Ethanol is small enough and partially nonpolar. Glucose is too large and polar (needs GLUT transporters). Na\u207A is charged and requires ion channels or pumps.',
        concepts: ['passive-transport', 'phospholipid-bilayer']
      },
      {
        id: 'mg1-6',
        type: 'mcq',
        difficulty: 3,
        text: 'A plant cell in a hypotonic solution will:',
        options: [
          'Shrink due to plasmolysis',
          'Become turgid due to the cell wall preventing bursting',
          'Burst (lyse) like an animal cell',
          'Not be affected because the cell wall blocks osmosis'
        ],
        correctIndex: 1,
        hint: 'Plant cells have a rigid cell wall that prevents them from bursting.',
        steps: [
          'Hypotonic = lower solute outside, water enters the cell',
          'In an animal cell, this would cause lysis',
          'But the rigid cell wall prevents bursting',
          'The cell becomes turgid (firm and pressurized)',
          'This turgor pressure is essential for plant structural support'
        ],
        solution: 'In a hypotonic solution, water enters the plant cell by osmosis. The cell wall prevents bursting and the cell becomes turgid. In a hypertonic solution, the membrane pulls away from the wall (plasmolysis), causing wilting.',
        concepts: ['osmosis']
      },
      {
        id: 'mg1-7',
        type: 'mcq',
        difficulty: 3,
        text: 'What is the role of cholesterol in the animal cell membrane?',
        options: [
          'It provides energy for active transport',
          'It acts as an enzyme to digest phospholipids',
          'It maintains membrane fluidity by acting as a fluidity buffer across temperatures',
          'It transports glucose across the membrane'
        ],
        correctIndex: 2,
        hint: 'Cholesterol sits between phospholipids in the bilayer. Think of it as a temperature stabilizer.',
        solution: 'Cholesterol is a fluidity buffer. At low temperatures, it prevents tight packing of phospholipid tails (prevents solidification). At high temperatures, it restricts phospholipid movement (prevents excessive fluidity). This maintains optimal membrane function.',
        concepts: ['fluid-mosaic-model']
      },
      {
        id: 'mg1-8',
        type: 'mcq',
        difficulty: 4,
        text: 'If a cell\'s ATP supply is completely blocked, which transport would continue to function?',
        options: ['Na\u207A/K\u207A pump', 'Phagocytosis', 'Osmosis', 'Exocytosis'],
        correctIndex: 2,
        hint: 'Only passive transport processes continue without ATP.',
        solution: 'Osmosis is passive transport (requires no ATP). The Na\u207A/K\u207A pump, phagocytosis, and exocytosis are all active processes requiring ATP and would stop if the ATP supply is blocked.',
        concepts: ['passive-transport', 'active-transport']
      }
    ]
  },

  // ==================== PLANET 2: Osmosis Problems ====================
  {
    id: 'osmosis-problems',
    name: 'Osmosis Problems',
    constellationId: 'membrane-gates',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'mg2-1',
        type: 'match',
        difficulty: 2,
        text: 'Match each biomolecule with its monomer (building block).',
        leftColumn: ['Proteins', 'Polysaccharides', 'Nucleic acids (DNA/RNA)', 'Triglycerides (fats)'],
        rightColumn: [
          'Nucleotides',
          'Glycerol + 3 fatty acids',
          'Amino acids',
          'Monosaccharides (simple sugars)'
        ],
        correctMatches: { 0: 2, 1: 3, 2: 0, 3: 1 },
        hint: 'Proteins are chains of amino acids. DNA/RNA are chains of nucleotides. Polysaccharides are chains of simple sugars.',
        solution: 'Proteins: amino acids (20 types). Polysaccharides: monosaccharides (e.g., glucose). Nucleic acids: nucleotides (base + sugar + phosphate). Triglycerides: glycerol + 3 fatty acids (not a true polymer).',
        concepts: ['biomolecules']
      },
      {
        id: 'mg2-2',
        type: 'mcq',
        difficulty: 2,
        text: 'Which level of protein structure is determined solely by the linear sequence of amino acids?',
        options: ['Primary structure', 'Secondary structure', 'Tertiary structure', 'Quaternary structure'],
        correctIndex: 0,
        hint: 'The four levels build upon each other. The first is simply the order of amino acids.',
        steps: [
          'Primary: amino acid sequence (peptide bonds)',
          'Secondary: local folding into alpha helices and beta sheets (hydrogen bonds)',
          'Tertiary: 3D shape of a single polypeptide (various interactions)',
          'Quaternary: arrangement of multiple polypeptide subunits'
        ],
        solution: 'Primary structure is the linear sequence of amino acids connected by peptide bonds. It is encoded by the gene and dictates all higher levels of protein structure through folding.',
        concepts: ['proteins']
      },
      {
        id: 'mg2-3',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following are polysaccharides?',
        options: ['Starch', 'Glucose', 'Cellulose', 'Glycogen', 'Sucrose'],
        correctIndices: [0, 2, 3],
        hint: 'Polysaccharides are polymers of many monosaccharide units. Glucose is a monomer. Sucrose is only 2 units.',
        solution: 'Starch (plant energy storage), cellulose (plant cell wall structural support), and glycogen (animal energy storage in liver/muscle) are polysaccharides, all made of glucose. Glucose is a monosaccharide. Sucrose is a disaccharide (glucose + fructose).',
        concepts: ['carbohydrates']
      },
      {
        id: 'mg2-4',
        type: 'mcq',
        difficulty: 3,
        text: 'Enzymes increase the rate of a chemical reaction by:',
        options: [
          'Increasing the temperature of the reaction',
          'Lowering the activation energy of the reaction',
          'Changing the free energy difference (\u0394G) of the reaction',
          'Adding energy to the products'
        ],
        correctIndex: 1,
        hint: 'Enzymes are biological catalysts. They speed up reactions without altering the equilibrium.',
        steps: [
          'Enzymes lower the activation energy (the energy barrier)',
          'They do NOT change \u0394G (overall energy change)',
          'They do NOT change the equilibrium position',
          'They provide an alternative reaction pathway with lower activation energy'
        ],
        solution: 'Enzymes are biological catalysts that lower the activation energy by stabilizing the transition state. They do not alter the equilibrium or the overall free energy change, but dramatically increase the reaction rate.',
        concepts: ['enzymes']
      },
      {
        id: 'mg2-5',
        type: 'match',
        difficulty: 3,
        text: 'Match each enzyme concept with its correct description.',
        leftColumn: ['Specificity', 'Active site', 'Denaturation', 'Competitive inhibition'],
        rightColumn: [
          'A molecule similar to the substrate binds to the active site, blocking the real substrate',
          'The region of the enzyme where the substrate binds and the reaction occurs',
          'Loss of 3D structure and function due to extreme pH or temperature',
          'Each enzyme acts on a specific substrate (lock-and-key or induced fit model)'
        ],
        correctMatches: { 0: 3, 1: 1, 2: 2, 3: 0 },
        hint: 'Enzymes have a specific active site shape. Extreme conditions disrupt the protein folding that creates this shape.',
        solution: 'Specificity: enzymes are substrate-specific (active site shape). Active site: binding and catalytic region. Denaturation: loss of 3D structure from extreme pH/temperature. Competitive inhibition: inhibitor competes for the active site.',
        concepts: ['enzymes']
      },
      {
        id: 'mg2-6',
        type: 'mcq',
        difficulty: 3,
        text: 'Which bond holds the two complementary strands of DNA together?',
        options: [
          'Covalent bonds between bases',
          'Hydrogen bonds between complementary base pairs',
          'Peptide bonds between nucleotides',
          'Ionic bonds between phosphate groups'
        ],
        correctIndex: 1,
        hint: 'The two strands are held by relatively weak bonds that allow separation during replication and transcription.',
        steps: [
          'The sugar-phosphate backbone is held by covalent phosphodiester bonds',
          'The two strands are held together by hydrogen bonds between base pairs',
          'A-T: 2 hydrogen bonds, G-C: 3 hydrogen bonds',
          'Individually weak, but collectively strong enough to maintain the double helix'
        ],
        solution: 'The two DNA strands are held together by hydrogen bonds between complementary base pairs (A=T: 2 H-bonds, G\u2261C: 3 H-bonds). The backbone uses phosphodiester bonds (covalent). This allows strand separation during replication.',
        concepts: ['nucleic-acids']
      },
      {
        id: 'mg2-7',
        type: 'mcq',
        difficulty: 4,
        text: 'Which type of lipid is the main component of cell membranes and has both hydrophilic and hydrophobic regions?',
        options: ['Triglycerides', 'Phospholipids', 'Steroids', 'Waxes'],
        correctIndex: 1,
        hint: 'This lipid has a glycerol backbone with two fatty acid tails (hydrophobic) and a phosphate head group (hydrophilic).',
        solution: 'Phospholipids are the main membrane lipid. They are amphipathic: the phosphate head is hydrophilic (faces water) and the two fatty acid tails are hydrophobic (face inward). This property drives the spontaneous formation of the bilayer.',
        concepts: ['lipids', 'phospholipid-bilayer']
      },
      {
        id: 'mg2-8',
        type: 'mcq',
        difficulty: 4,
        text: 'A cell maintains high K\u207A inside and high Na\u207A outside. If you block the Na\u207A/K\u207A pump but leave membrane channels open, what happens over time?',
        options: [
          'Nothing changes',
          'K\u207A leaks out and Na\u207A leaks in, gradually equalizing concentrations',
          'Both ions move further from equilibrium',
          'Only K\u207A moves because its channels are always open'
        ],
        correctIndex: 1,
        hint: 'Without the pump maintaining the gradient, ions will move down their concentration gradients through open channels.',
        solution: 'Without the pump, K\u207A leaks out (high inside to low outside) and Na\u207A leaks in (high outside to low inside) through their channels, gradually equalizing concentrations. This demonstrates that the pump actively maintains the electrochemical gradient.',
        concepts: ['active-transport']
      }
    ]
  }
];
