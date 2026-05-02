// Cell Citadel - Cell Biology practice planets
// Topics: cell structure, organelles, membrane, transport, prokaryotic vs eukaryotic

export const cellCitadelPlanets = [
  // ==================== PLANET 1: Organelle Identification ====================
  {
    id: 'organelle-identification',
    name: 'Organelle Identification',
    constellationId: 'cell-citadel',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'cc1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'Which organelle is known as the "powerhouse of the cell" because it generates most of the cell\'s ATP?',
        options: ['Golgi apparatus', 'Mitochondria', 'Endoplasmic reticulum', 'Lysosome'],
        correctIndex: 1,
        hint: 'This organelle has its own DNA and a double membrane with inner folds called cristae.',
        steps: [
          'Mitochondria perform oxidative phosphorylation',
          'The inner membrane has cristae that increase surface area for ATP synthesis',
          'They produce ~36-38 ATP per glucose molecule via cellular respiration'
        ],
        solution: 'Mitochondria are the powerhouse of the cell. They perform oxidative phosphorylation on the inner membrane (cristae) to generate most of the cell\'s ATP from glucose.',
        concepts: ['mitochondria', 'organelles']
      },
      {
        id: 'cc1-2',
        type: 'match',
        difficulty: 2,
        text: 'Match each organelle with its primary function.',
        leftColumn: [
          'Rough endoplasmic reticulum',
          'Golgi apparatus',
          'Lysosome',
          'Ribosome'
        ],
        rightColumn: [
          'Protein synthesis (translation)',
          'Intracellular digestion and recycling',
          'Modification, packaging, and sorting of proteins',
          'Protein folding and transport (studded with ribosomes)'
        ],
        correctMatches: { 0: 3, 1: 2, 2: 1, 3: 0 },
        hint: 'The rough ER is "rough" because of ribosomes on its surface. The Golgi is like a post office.',
        solution: 'RER: has ribosomes, folds and transports proteins. Golgi: modifies, packages, and sorts proteins into vesicles. Lysosome: contains hydrolytic enzymes for digestion. Ribosome: site of protein synthesis (mRNA to protein).',
        concepts: ['organelles', 'endomembrane-system']
      },
      {
        id: 'cc1-3',
        type: 'mcq',
        difficulty: 2,
        text: 'Which of the following organelles is NOT part of the endomembrane system?',
        options: ['Endoplasmic reticulum', 'Golgi apparatus', 'Mitochondria', 'Lysosomes'],
        correctIndex: 2,
        hint: 'The endomembrane system includes organelles connected by membrane flow (vesicles). Some organelles evolved independently via endosymbiosis.',
        steps: [
          'The endomembrane system: nuclear envelope, ER, Golgi, lysosomes, vesicles, plasma membrane',
          'Mitochondria (and chloroplasts) are NOT part of the endomembrane system',
          'They have their own DNA and double membranes (endosymbiont origin)'
        ],
        solution: 'Mitochondria are not part of the endomembrane system. They originated from an endosymbiotic event (a prokaryote engulfed by an ancestral eukaryote) and have their own DNA and double membrane.',
        concepts: ['endomembrane-system', 'mitochondria']
      },
      {
        id: 'cc1-4',
        type: 'mcq-multi',
        difficulty: 2,
        text: 'Which of the following features are found in plant cells but NOT in animal cells?',
        options: [
          'Cell wall',
          'Mitochondria',
          'Chloroplasts',
          'Large central vacuole',
          'Nucleus'
        ],
        correctIndices: [0, 2, 3],
        hint: 'Both plant and animal cells are eukaryotic and share many organelles. Plant cells have unique structures for photosynthesis and structural support.',
        solution: 'Plant cells (but not animal cells) have: (A) cell wall (cellulose), (C) chloroplasts (photosynthesis), and (D) a large central vacuole (turgor pressure, storage). Both have mitochondria and nuclei.',
        concepts: ['prokaryotic-eukaryotic', 'organelles']
      },
      {
        id: 'cc1-5',
        type: 'mcq',
        difficulty: 3,
        text: 'The smooth endoplasmic reticulum (SER) performs all of the following functions EXCEPT:',
        options: [
          'Lipid synthesis',
          'Detoxification of drugs',
          'Protein synthesis',
          'Calcium ion storage'
        ],
        correctIndex: 2,
        hint: 'Protein synthesis occurs on the ROUGH ER (which has ribosomes). The smooth ER lacks ribosomes.',
        solution: 'The SER synthesizes lipids, detoxifies drugs (especially in liver cells), and stores calcium ions (especially in muscle cells as sarcoplasmic reticulum). Protein synthesis occurs on the rough ER, not the smooth ER.',
        concepts: ['organelles', 'endomembrane-system']
      },
      {
        id: 'cc1-6',
        type: 'mcq',
        difficulty: 3,
        text: 'A cell is observed to have no membrane-bound nucleus, no mitochondria, and a single circular chromosome. This cell is most likely:',
        options: [
          'A plant cell',
          'An animal cell',
          'A prokaryotic cell',
          'A fungal cell'
        ],
        correctIndex: 2,
        hint: 'Prokaryotes lack membrane-bound organelles and have a single circular chromosome in the nucleoid region.',
        steps: [
          'No membrane-bound nucleus = no true nucleus',
          'No mitochondria = no membrane-bound organelles',
          'Single circular chromosome = prokaryotic DNA organization',
          'These are all hallmarks of prokaryotic cells (bacteria, archaea)'
        ],
        solution: 'Prokaryotic cells lack a membrane-bound nucleus (DNA is in the nucleoid region), have no membrane-bound organelles like mitochondria, and typically have a single circular chromosome plus plasmids.',
        concepts: ['prokaryotic-eukaryotic']
      },
      {
        id: 'cc1-7',
        type: 'match',
        difficulty: 3,
        text: 'Match each cellular component with the type of cell it is found in.',
        leftColumn: [
          'Plasmids',
          'Centrioles',
          'Chloroplasts',
          'Nucleoid'
        ],
        rightColumn: [
          'Plant cells only',
          'Prokaryotic cells only',
          'Animal cells only',
          'Prokaryotic cells (and some eukaryotes via genetic engineering)'
        ],
        correctMatches: { 0: 3, 1: 2, 2: 0, 3: 1 },
        hint: 'Plasmids are small circular DNA found naturally in bacteria. Centrioles are involved in cell division in animal cells. The nucleoid is the DNA-containing region in prokaryotes.',
        solution: 'Plasmids: naturally in prokaryotes (also used in genetic engineering of eukaryotes). Centrioles: animal cells (organize spindle fibers). Chloroplasts: plant cells (photosynthesis). Nucleoid: prokaryotic cells (region containing circular DNA).',
        concepts: ['prokaryotic-eukaryotic', 'organelles']
      }
    ]
  },

  // ==================== PLANET 2: Cell Comparison ====================
  {
    id: 'cell-comparison',
    name: 'Cell Comparison',
    constellationId: 'cell-citadel',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'cc2-1',
        type: 'mcq',
        difficulty: 3,
        text: 'According to the cell theory, which of the following statements is correct?',
        options: [
          'All living organisms are composed of cells, but viruses are an exception',
          'All cells arise from pre-existing cells by spontaneous generation',
          'The cell is the basic structural and functional unit of life, and all cells arise from pre-existing cells',
          'Only eukaryotic organisms are made of cells'
        ],
        correctIndex: 2,
        hint: 'The modern cell theory has three tenets: all organisms are made of cells, cells are the basic unit of life, and cells come from pre-existing cells.',
        solution: 'The cell theory states: (1) All living organisms are composed of one or more cells, (2) the cell is the basic unit of structure and function in organisms, and (3) all cells arise from pre-existing cells (omnis cellula e cellula). Viruses are not considered truly "living" by this definition.',
        concepts: ['cell-theory']
      },
      {
        id: 'cc2-2',
        type: 'mcq',
        difficulty: 3,
        text: 'Which cytoskeletal element is the thinnest and is responsible for muscle contraction and cell crawling?',
        options: ['Microtubules', 'Intermediate filaments', 'Microfilaments (actin filaments)', 'Flagella'],
        correctIndex: 2,
        hint: 'The three main cytoskeletal elements are microtubules (thickest), intermediate filaments (medium), and microfilaments (thinnest, ~7 nm).',
        steps: [
          'Microfilaments (actin): ~7 nm diameter, thinnest',
          'Intermediate filaments: ~10 nm, medium',
          'Microtubules: ~25 nm, thickest',
          'Actin filaments are involved in muscle contraction (with myosin), amoeboid movement, and cytokinesis'
        ],
        solution: 'Microfilaments (actin filaments) are the thinnest cytoskeletal elements (~7 nm). They are crucial for muscle contraction (interacting with myosin), cell crawling, and forming the cleavage furrow during cytokinesis.',
        concepts: ['cytoskeleton']
      },
      {
        id: 'cc2-3',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following statements about mitochondria are correct?',
        options: [
          'They have their own circular DNA',
          'They have a double membrane',
          'The inner membrane is folded into cristae',
          'They can replicate independently of the cell',
          'They are found only in animal cells'
        ],
        correctIndices: [0, 1, 2, 3],
        hint: 'Mitochondria show evidence of endosymbiotic origin: own DNA, double membrane, own ribosomes, and ability to divide.',
        solution: 'All except (E) are correct. Mitochondria have circular DNA, a double membrane with cristae, and can semi-autonomously replicate (binary fission). They are found in BOTH plant and animal cells. Their features support the endosymbiotic theory.',
        concepts: ['mitochondria', 'organelles']
      },
      {
        id: 'cc2-4',
        type: 'mcq',
        difficulty: 3,
        text: 'Which type of cell junction allows direct cytoplasmic communication between adjacent animal cells?',
        options: ['Tight junctions', 'Desmosomes', 'Gap junctions', 'Plasmodesmata'],
        correctIndex: 2,
        hint: 'One type of junction forms channels (connexons) that allow ions and small molecules to pass between cells.',
        steps: [
          'Tight junctions: seal cells together, prevent leakage',
          'Desmosomes: anchor cells together (like rivets), mechanical strength',
          'Gap junctions: channels (connexons) for direct cell-to-cell communication',
          'Plasmodesmata: similar to gap junctions but found in plant cells'
        ],
        solution: 'Gap junctions consist of connexon channels that allow ions and small molecules to pass directly between adjacent animal cells, enabling cell-to-cell communication. Plasmodesmata serve a similar function in plant cells.',
        concepts: ['cell-junctions']
      },
      {
        id: 'cc2-5',
        type: 'match',
        difficulty: 3,
        text: 'Match each organelle with the evidence supporting its endosymbiotic origin.',
        leftColumn: [
          'Mitochondria originated from aerobic bacteria',
          'Chloroplasts originated from photosynthetic cyanobacteria',
          'Both organelles share this feature with prokaryotes',
          'Both organelles have this structural feature'
        ],
        rightColumn: [
          'Double membrane (inner from bacterium, outer from host vesicle)',
          'Perform oxidative phosphorylation, similar to aerobic bacteria',
          '70S ribosomes (like bacteria, not 80S like eukaryotic cytoplasm)',
          'Perform photosynthesis using thylakoids, like cyanobacteria'
        ],
        correctMatches: { 0: 1, 1: 3, 2: 2, 3: 0 },
        hint: 'The endosymbiotic theory proposes that mitochondria and chloroplasts were once free-living prokaryotes engulfed by ancestral eukaryotic cells.',
        solution: 'Mitochondria: similar to aerobic bacteria (oxidative phosphorylation). Chloroplasts: similar to cyanobacteria (thylakoid-based photosynthesis). Both have 70S ribosomes (prokaryotic type). Both have double membranes (inner = original bacterial membrane).',
        concepts: ['mitochondria', 'organelles']
      },
      {
        id: 'cc2-6',
        type: 'mcq',
        difficulty: 4,
        text: 'A researcher observes a cell with the following features: cell wall, no chloroplasts, no nucleus, flagellum, ribosomes. What type of organism is this cell most likely from?',
        options: [
          'A plant',
          'A fungus',
          'A bacterium',
          'A protist'
        ],
        correctIndex: 2,
        hint: 'The key features are: no nucleus (prokaryotic), cell wall (not unique to any domain), and flagellum (motility).',
        steps: [
          'No nucleus = prokaryotic (eliminates plants, fungi, protists)',
          'Cell wall + no chloroplasts = could be bacteria or archaea',
          'Has flagellum = motile prokaryote',
          'Most likely a bacterium (e.g., E. coli or Bacillus)'
        ],
        solution: 'The absence of a nucleus is the defining feature of prokaryotes. A cell wall, no chloroplasts, flagellum, and ribosomes without a nucleus = bacterium.',
        concepts: ['prokaryotic-eukaryotic']
      },
      {
        id: 'cc2-7',
        type: 'numerical',
        difficulty: 2,
        text: 'If a cell has a diameter of 10 micrometers (\u03BCm), what is its diameter in nanometers?',
        correctAnswer: 10000,
        unit: 'nm',
        hint: '1 micrometer (\u03BCm) = 1000 nanometers (nm).',
        steps: [
          '1 \u03BCm = 1000 nm',
          '10 \u03BCm = 10 \u00D7 1000 = 10000 nm'
        ],
        solution: '10 \u03BCm \u00D7 1000 nm/\u03BCm = 10,000 nm. Typical eukaryotic cells are 10-100 \u03BCm, while prokaryotic cells are 1-10 \u03BCm.',
        concepts: ['cell-size']
      },
      {
        id: 'cc2-8',
        type: 'mcq',
        difficulty: 4,
        text: 'Which organelle is responsible for the synthesis and modification of lipids and plays a key role in detoxification in liver cells?',
        options: [
          'Rough endoplasmic reticulum',
          'Smooth endoplasmic reticulum',
          'Golgi apparatus',
          'Peroxisome'
        ],
        correctIndex: 1,
        hint: 'This organelle lacks ribosomes and is particularly abundant in cells that produce steroid hormones or detoxify drugs.',
        solution: 'The smooth endoplasmic reticulum (SER) synthesizes lipids (including phospholipids and steroids), detoxifies drugs and poisons (especially in liver hepatocytes), and stores calcium ions. It is particularly abundant in liver cells and cells that produce steroid hormones.',
        concepts: ['organelles', 'endomembrane-system']
      }
    ]
  }
];
