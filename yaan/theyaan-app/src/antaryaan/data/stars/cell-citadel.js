export const cellCitadelStars = [
  // ========== STAR 1: Cell Theory ==========
  {
    id: 'cell-theory',
    name: 'Cell Theory',
    constellationId: 'cell-citadel',
    order: 1,
    duration: 6,
    xp: 10,
    concepts: ['cell-theory', 'cell-discovery', 'microscopy'],
    blocks: [
      {
        type: 'text',
        content: 'In 1665, Robert Hooke looked at cork through a microscope and saw tiny boxes he called "cells." Three centuries of research later, the **cell theory** stands as one of biology\'s foundational pillars.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'cell-explorer',
        title: 'Cell Explorer',
        description: 'Click on organelles in this interactive cell cross-section. Toggle between animal and plant cells to see the differences.',
        controls: [],
        discoveries: [
          { id: 'mitochondria', label: 'Found the powerhouse of the cell', hint: 'Click on the double-membraned organelle' },
          { id: 'plant-unique', label: 'Identified plant-only organelles', hint: 'Toggle to plant cell mode' },
          { id: 'nucleus', label: 'Explored the control center', hint: 'Click on the largest organelle' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Viruses challenge cell theory: they are not cells and cannot reproduce on their own, yet they evolve and have genetic material. Most biologists consider viruses non-living, existing at the boundary between chemistry and biology.'
      },
      {
        type: 'text',
        content: '**The Three Tenets of Cell Theory:**\n1. All living organisms are composed of one or more cells\n2. The cell is the basic unit of structure and function in organisms\n3. All cells arise from pre-existing cells (Omnis cellula e cellula)\n\nThis third tenet was added by Rudolf Virchow in 1855, disproving spontaneous generation.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which is NOT part of the cell theory?',
        options: [
          'All living things are made of cells',
          'Cells are the basic unit of life',
          'All cells contain DNA in a nucleus',
          'All cells come from pre-existing cells'
        ],
        correctAnswer: 2,
        explanation: 'Not all cells have a nucleus. Prokaryotes lack a nucleus but are still cells. The cell theory makes no claim about a nucleus.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ct-q1',
            question: 'Who first used the term "cells"?',
            type: 'mcq',
            options: ['Robert Hooke', 'Anton van Leeuwenhoek', 'Rudolf Virchow', 'Matthias Schleiden'],
            correctAnswer: 0,
            explanation: 'Robert Hooke coined "cells" in 1665 observing cork under a microscope.'
          },
          {
            id: 'ct-q2',
            question: '"Omnis cellula e cellula" means:',
            type: 'mcq',
            options: ['All cells have a nucleus', 'All cells come from pre-existing cells', 'All organisms are made of cells', 'Cells are the basic unit of life'],
            correctAnswer: 1,
            explanation: 'Latin for "every cell from a cell," establishing that cells only arise from existing cells.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Prokaryote vs Eukaryote ==========
  {
    id: 'prokaryote-eukaryote',
    name: 'Prokaryote vs Eukaryote',
    constellationId: 'cell-citadel',
    order: 2,
    duration: 8,
    xp: 15,
    concepts: ['prokaryotic-cells', 'eukaryotic-cells', 'cell-size', 'compartmentalization'],
    blocks: [
      {
        type: 'text',
        content: '**Prokaryotes** (bacteria and archaea) are ancient, simple cells. **Eukaryotes** (plants, animals, fungi, protists) are larger, more complex cells with internal membrane-bound compartments.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'cell-explorer',
        title: 'Prokaryote vs Eukaryote Explorer',
        description: 'Compare prokaryotic and eukaryotic cells side by side. Click structures to highlight what is shared and what is unique to each cell type.',
        controls: [
          { id: 'cell-type', label: 'Cell Type', type: 'toggle', options: ['Prokaryote', 'Eukaryote'] },
        ],
        discoveries: [
          { id: 'shared-ribosomes', label: 'Found ribosomes in both cell types', hint: 'Look for the small granular structures' },
          { id: 'no-nucleus', label: 'Noticed the nucleoid region in prokaryotes', hint: 'Where is the DNA in prokaryotes?' },
          { id: 'compartments', label: 'Discovered eukaryotic compartmentalization', hint: 'Toggle to eukaryote and explore membrane-bound organelles' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The endosymbiotic theory explains how eukaryotes got mitochondria and chloroplasts: ancient prokaryotes were engulfed by larger cells. Evidence: both have own circular DNA, 70S ribosomes, and double membranes.'
      },
      {
        type: 'text',
        content: '**Prokaryotic Cells:**\n- No membrane-bound nucleus (DNA in nucleoid region)\n- No membrane-bound organelles\n- Small (0.1-5 \u03BCm)\n- Circular DNA, often with plasmids\n- Ribosomes: 70S (50S + 30S subunits)\n- Cell wall: peptidoglycan (bacteria)',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which feature is found in BOTH prokaryotic and eukaryotic cells?',
        options: ['Nucleus', 'Mitochondria', 'Ribosomes', 'Endoplasmic reticulum'],
        correctAnswer: 2,
        explanation: 'Both have ribosomes (70S vs 80S). Nucleus, mitochondria, and ER are only in eukaryotes.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'pe-q1',
            question: 'Typical size of a prokaryotic cell?',
            type: 'mcq',
            options: ['0.1-5 \u03BCm', '10-100 \u03BCm', '100-1000 \u03BCm', '1-10 mm'],
            correctAnswer: 0,
            explanation: 'Prokaryotes: 0.1-5 \u03BCm. Eukaryotes: 10-100 \u03BCm.'
          },
          {
            id: 'pe-q2',
            question: 'Which evidence supports endosymbiotic theory?',
            type: 'mcq',
            options: [
              'Mitochondria have their own circular DNA',
              'Mitochondria have double membranes',
              'Mitochondria have 70S ribosomes',
              'All of the above'
            ],
            correctAnswer: 3,
            explanation: 'All three features suggest mitochondria were once free-living prokaryotes.'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: The Nucleus ==========
  {
    id: 'nucleus-command',
    name: 'The Nucleus: Command Center',
    constellationId: 'cell-citadel',
    order: 3,
    duration: 8,
    xp: 15,
    concepts: ['nucleus', 'nuclear-envelope', 'nucleolus', 'chromatin', 'nuclear-pores'],
    blocks: [
      {
        type: 'text',
        content: 'The nucleus is the command center of the eukaryotic cell, containing nearly all the cell\'s DNA. It is surrounded by a double membrane called the **nuclear envelope**, controlling molecular traffic through **nuclear pores**.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'organelle-assembler',
        title: 'Build the Nucleus',
        description: 'Drag and place the nuclear envelope, nuclear pores, chromatin, nucleolus, and other components to assemble a functional nucleus.',
        objective: 'Correctly assemble all nuclear components',
        targetScore: 70,
      },
      {
        type: 'keyInsight',
        content: 'The nucleus stores information but does NOT make proteins directly. DNA is transcribed to mRNA in the nucleus; mRNA exits through nuclear pores to ribosomes in the cytoplasm where proteins are synthesized.'
      },
      {
        type: 'text',
        content: '**Nuclear Components:**\n- **Nuclear envelope:** Double membrane with pore complexes\n- **Nuclear pores:** Selective transport (mRNA out, proteins in)\n- **Chromatin:** DNA + histone proteins, loosely packed during interphase\n- **Chromosomes:** Condensed chromatin visible during division\n- **Nucleolus:** Site of rRNA synthesis and ribosome subunit assembly',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What is the function of nuclear pores?',
        options: [
          'Produce energy',
          'Selectively transport molecules between nucleus and cytoplasm',
          'Synthesize DNA',
          'Break down waste'
        ],
        correctAnswer: 1,
        explanation: 'Nuclear pores are selective channels for mRNA export and protein import.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'nc-q1',
            question: 'Where is ribosomal RNA (rRNA) synthesized?',
            type: 'mcq',
            options: ['Cytoplasm', 'Rough ER', 'Nucleolus', 'Golgi apparatus'],
            correctAnswer: 2,
            explanation: 'The nucleolus synthesizes rRNA and assembles ribosome subunits.'
          },
          {
            id: 'nc-q2',
            question: 'Chromatin condenses into visible chromosomes during:',
            type: 'mcq',
            options: ['G1 phase', 'S phase', 'Cell division', 'G0 phase'],
            correctAnswer: 2,
            explanation: 'Chromatin condenses during division for accurate chromosome segregation.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Endomembrane System ==========
  {
    id: 'endomembrane-system',
    name: 'The Endomembrane System',
    constellationId: 'cell-citadel',
    order: 4,
    duration: 10,
    xp: 20,
    concepts: ['endoplasmic-reticulum', 'golgi-apparatus', 'lysosomes', 'vesicle-transport'],
    blocks: [
      {
        type: 'text',
        content: 'The **endomembrane system** is a network of interconnected membranes working like a factory assembly line: synthesizing, modifying, packaging, and shipping proteins and lipids.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'endomembrane-tracer',
        title: 'Trace the Protein Pathway',
        description: 'Follow a newly synthesized protein through the endomembrane system. Click the correct organelles in order to trace the secretory pathway from ribosome to cell surface.',
        objective: 'Trace the complete secretory pathway in the correct order',
        targetScore: 80,
      },
      {
        type: 'keyInsight',
        content: 'The pathway: Ribosome on Rough ER \u2192 protein enters ER \u2192 vesicle to Golgi \u2192 modification \u2192 vesicle to membrane (secretion), lysosome, or stays in membrane.'
      },
      {
        type: 'text',
        content: '**Golgi Apparatus:**\n- Stack of flattened membrane sacs (cisternae)\n- Receives proteins from ER (cis face)\n- Modifies, sorts, packages proteins\n- Ships in vesicles (trans face)\n\n**Lysosomes:**\n- Contain hydrolytic enzymes at pH ~4.5\n- Break down macromolecules, old organelles, engulfed particles',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A cell secretes a protein. Arrange: (1) Golgi, (2) Rough ER, (3) Vesicle to membrane, (4) Ribosome',
        options: ['4 \u2192 2 \u2192 1 \u2192 3', '2 \u2192 4 \u2192 3 \u2192 1', '1 \u2192 2 \u2192 4 \u2192 3', '4 \u2192 1 \u2192 2 \u2192 3'],
        correctAnswer: 0,
        explanation: 'Ribosome \u2192 Rough ER \u2192 Golgi \u2192 Vesicle to membrane.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'es-q1',
            question: 'Which organelle detoxifies drugs and synthesizes lipids?',
            type: 'mcq',
            options: ['Rough ER', 'Smooth ER', 'Golgi', 'Lysosome'],
            correctAnswer: 1,
            explanation: 'Smooth ER handles lipid synthesis and drug detoxification.'
          },
          {
            id: 'es-q2',
            question: 'What is the pH inside a lysosome?',
            type: 'mcq',
            options: ['About 7', 'About 4.5', 'About 8', 'About 2'],
            correctAnswer: 1,
            explanation: 'Lysosomes maintain ~pH 4.5, optimal for their digestive enzymes.'
          },
          {
            id: 'es-q3',
            question: 'Tay-Sachs disease (missing lysosomal enzyme) causes:',
            type: 'mcq',
            options: [
              'Inability to synthesize proteins',
              'Accumulation of undigested lipids',
              'Inability to produce ATP',
              'Loss of cell membrane'
            ],
            correctAnswer: 1,
            explanation: 'Without the enzyme, specific lipids accumulate in cells, causing damage.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Mitochondria and Chloroplasts ==========
  {
    id: 'mitochondria-chloroplast',
    name: 'Powerhouses and Light Factories',
    constellationId: 'cell-citadel',
    order: 5,
    duration: 10,
    xp: 20,
    concepts: ['mitochondria', 'chloroplasts', 'cellular-respiration', 'photosynthesis'],
    blocks: [
      {
        type: 'text',
        content: 'Every cell needs energy. **Mitochondria** convert food into ATP. **Chloroplasts** (plants) capture sunlight into chemical energy. Together they drive life\'s energy cycle.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'organelle-assembler',
        title: 'Assemble the Energy Organelles',
        description: 'Drag components to build both a mitochondrion and a chloroplast. Place the outer membrane, inner membrane/cristae, matrix, thylakoids, and stroma in the correct locations.',
        objective: 'Correctly assemble mitochondria and chloroplast structures',
        targetScore: 75,
      },
      {
        type: 'keyInsight',
        content: 'Photosynthesis and respiration are reverse reactions. Chloroplasts store solar energy in glucose; mitochondria release it as ATP. The O\u2082 from photosynthesis fuels respiration; the CO\u2082 from respiration fuels photosynthesis.'
      },
      {
        type: 'formula',
        title: 'Energy Equations',
        formulas: [
          { label: 'Respiration', formula: 'C\u2086H\u2081\u2082O\u2086 + 6O\u2082 \u2192 6CO\u2082 + 6H\u2082O + ATP', note: 'In mitochondria' },
          { label: 'Photosynthesis', formula: '6CO\u2082 + 6H\u2082O + light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082', note: 'In chloroplasts' }
        ]
      },
      {
        type: 'text',
        content: '**Mitochondria:**\n- Double membrane: outer (smooth), inner (cristae - folds)\n- Inner membrane: electron transport chain, ATP synthesis\n- Matrix: Krebs cycle enzymes, own circular DNA, 70S ribosomes\n- Present in nearly ALL eukaryotes\n\n**Chloroplasts:**\n- Double outer membrane + thylakoid system inside\n- Thylakoids: light reactions (stacks = grana)\n- Stroma: Calvin cycle (dark reactions)\n- Own DNA and 70S ribosomes',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Where does the electron transport chain occur in mitochondria?',
        options: ['Outer membrane', 'Inner membrane (cristae)', 'Matrix', 'Intermembrane space'],
        correctAnswer: 1,
        explanation: 'The ETC is in the inner membrane. Cristae increase surface area for more ATP.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mc-q1',
            question: 'Which organelle has its own DNA and ribosomes?',
            type: 'mcq',
            options: ['Golgi', 'Lysosome', 'Mitochondria', 'Smooth ER'],
            correctAnswer: 2,
            explanation: 'Mitochondria and chloroplasts have own circular DNA and 70S ribosomes (endosymbiotic origin).'
          },
          {
            id: 'mc-q2',
            question: 'Why do plant cells need mitochondria if they have chloroplasts?',
            type: 'mcq',
            options: [
              'Mitochondria produce glucose',
              'Plants need respiration for ATP, especially at night',
              'Mitochondria are only in animals',
              'Chloroplasts cannot function alone'
            ],
            correctAnswer: 1,
            explanation: 'Plants still need respiration for ATP. At night, mitochondria are the sole ATP source.'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Cytoskeleton ==========
  {
    id: 'cytoskeleton',
    name: 'The Cytoskeleton',
    constellationId: 'cell-citadel',
    order: 6,
    duration: 8,
    xp: 15,
    concepts: ['microfilaments', 'intermediate-filaments', 'microtubules', 'motor-proteins'],
    blocks: [
      {
        type: 'text',
        content: 'Cells are not bags of fluid. The **cytoskeleton** is a dynamic network of protein filaments providing structure, enabling movement, and serving as transport tracks.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'cell-explorer',
        title: 'Cytoskeleton Viewer',
        description: 'Toggle between microfilaments, intermediate filaments, and microtubules to see how each type contributes to cell structure and movement. Watch motor proteins walk along their tracks.',
        controls: [
          { id: 'filament-type', label: 'Filament Type', type: 'select', options: ['Microfilaments', 'Intermediate Filaments', 'Microtubules'] },
          { id: 'show-motors', label: 'Show Motor Proteins', type: 'toggle', options: ['Off', 'On'] },
        ],
        discoveries: [
          { id: 'actin-contraction', label: 'Observed microfilament contraction', hint: 'Select microfilaments and watch the cell edge' },
          { id: 'kinesin-walk', label: 'Watched kinesin walk along microtubules', hint: 'Enable motor proteins with microtubules selected' },
          { id: 'spindle-formation', label: 'Saw mitotic spindle formation', hint: 'Look for the dividing cell view' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Motor proteins walk along tracks:\n- Kinesin: toward (+) end of microtubules (cell periphery)\n- Dynein: toward (-) end of microtubules (cell center)\n- Myosin: along actin filaments (muscle contraction)'
      },
      {
        type: 'text',
        content: '**Three Types:**\n1. **Microfilaments (Actin):** Thinnest (7 nm). Muscle contraction, cell crawling, cytokinesis.\n2. **Intermediate Filaments:** Medium (8-12 nm). Mechanical strength, anchoring. Most stable.\n3. **Microtubules (Tubulin):** Thickest (25 nm). Cell division (spindle), transport tracks, cilia/flagella.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'The mitotic spindle is made of:',
        options: ['Microfilaments', 'Intermediate filaments', 'Microtubules', 'All three'],
        correctAnswer: 2,
        explanation: 'Microtubules form the mitotic spindle, attaching to and separating chromosomes.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cs-q1',
            question: 'Which cytoskeletal element is made of actin?',
            type: 'mcq',
            options: ['Microtubules', 'Microfilaments', 'Intermediate filaments', 'Centrioles'],
            correctAnswer: 1,
            explanation: 'Microfilaments = actin filaments. Thinnest at 7 nm.'
          },
          {
            id: 'cs-q2',
            question: 'Colchicine blocks microtubule assembly. It would inhibit:',
            type: 'mcq',
            options: ['Protein synthesis', 'Cell division', 'Lipid metabolism', 'DNA replication'],
            correctAnswer: 1,
            explanation: 'No microtubules = no mitotic spindle = no chromosome separation = no division.'
          }
        ]
      }
    ]
  },

  // ========== STAR 7: Cell Junctions ==========
  {
    id: 'cell-junctions',
    name: 'Cell Junctions and Communication',
    constellationId: 'cell-citadel',
    order: 7,
    duration: 8,
    xp: 15,
    concepts: ['tight-junctions', 'desmosomes', 'gap-junctions', 'plasmodesmata'],
    blocks: [
      {
        type: 'text',
        content: 'In multicellular organisms, cells connect through specialized junctions for structural support, sealing, and communication.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'cell-explorer',
        title: 'Cell Junction Explorer',
        description: 'Zoom into the boundaries between cells. Click on different junction types to see how tight junctions seal, desmosomes anchor, and gap junctions communicate.',
        controls: [
          { id: 'tissue-type', label: 'Tissue', type: 'select', options: ['Intestinal Epithelium', 'Heart Muscle', 'Skin', 'Plant Tissue'] },
        ],
        discoveries: [
          { id: 'tight-seal', label: 'Observed tight junction seal', hint: 'Examine intestinal epithelium cells' },
          { id: 'gap-signals', label: 'Watched ions pass through gap junctions', hint: 'Look at heart muscle tissue' },
          { id: 'plasmodesmata', label: 'Found plasmodesmata in plant cells', hint: 'Switch to plant tissue view' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'text',
        content: '**Animal Cell Junctions:**\n1. **Tight Junctions:** Seal cells together, prevent leakage. In intestinal lining, blood-brain barrier.\n2. **Desmosomes:** Rivet-like mechanical anchors linked to intermediate filaments. In skin, heart.\n3. **Gap Junctions:** Channels (connexons) for direct passage of small molecules/ions. In heart muscle (synchronized beating).\n\n**Plant Junctions:**\n**Plasmodesmata:** Channels through cell walls connecting cytoplasm of adjacent cells. Functionally similar to gap junctions.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which junction prevents leakage between intestinal lining cells?',
        options: ['Desmosomes', 'Gap junctions', 'Tight junctions', 'Plasmodesmata'],
        correctAnswer: 2,
        explanation: 'Tight junctions create a watertight seal between epithelial cells.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cj-q1',
            question: 'Heart cells must beat in synchrony. Which junction enables this?',
            type: 'mcq',
            options: ['Tight junctions', 'Desmosomes', 'Gap junctions', 'Plasmodesmata'],
            correctAnswer: 2,
            explanation: 'Gap junctions allow rapid ion/signal transfer to synchronize contraction.'
          },
          {
            id: 'cj-q2',
            question: 'Plant equivalent of gap junctions:',
            type: 'mcq',
            options: ['Tight junctions', 'Desmosomes', 'Middle lamella', 'Plasmodesmata'],
            correctAnswer: 3,
            explanation: 'Plasmodesmata are channels through plant cell walls for direct cell-cell communication.'
          }
        ]
      }
    ]
  },

  // ========== STAR 8: Citadel Mastery ==========
  {
    id: 'citadel-mastery',
    name: 'Cell Citadel Mastery',
    constellationId: 'cell-citadel',
    order: 8,
    duration: 8,
    xp: 30,
    concepts: ['cell-biology-review', 'organelle-functions', 'cell-comparisons'],
    blocks: [
      {
        type: 'text',
        content: 'You have explored every chamber of the Cell Citadel. Prove your mastery by identifying organelles, tracing pathways, and comparing cell types.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'organelle-assembler',
        title: 'Master Cell Builder',
        description: 'Build a complete eukaryotic cell from scratch. Drag all organelles into their correct positions and connect the endomembrane system. Score bonus points for identifying plant-only and animal-only components.',
        objective: 'Assemble a complete cell with all organelles correctly placed',
        targetScore: 85,
      },
      {
        type: 'keyInsight',
        content: 'Cell structure quick reference:\n- Energy: Mitochondria (all), Chloroplasts (plants)\n- Protein path: Ribosome \u2192 Rough ER \u2192 Golgi \u2192 Vesicle\n- Digestion: Lysosomes (animals), Vacuoles (plants)\n- Structure: Cytoskeleton (all), Cell wall (plants/fungi/bacteria)\n- Genetic control: Nucleus\n- Communication: Gap junctions (animals), Plasmodesmata (plants)'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A cell has chloroplasts, a large central vacuole, and a cell wall. It is:',
        options: ['An animal cell', 'A plant cell', 'A bacterial cell', 'A fungal cell'],
        correctAnswer: 1,
        explanation: 'Chloroplasts + large vacuole + cell wall = plant cell.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cm-q1',
            question: 'Most abundant organelle in a protein-secreting cell?',
            type: 'mcq',
            options: ['Smooth ER', 'Rough ER and Golgi', 'Lysosomes', 'Peroxisomes'],
            correctAnswer: 1,
            explanation: 'Secretory cells need lots of Rough ER and Golgi for protein synthesis and export.'
          },
          {
            id: 'cm-q2',
            question: 'A plant cell in hypertonic solution will:',
            type: 'mcq',
            options: ['Swell and burst', 'Plasmolyze', 'Stay the same', 'Divide rapidly'],
            correctAnswer: 1,
            explanation: 'Water leaves by osmosis. Cell membrane pulls away from rigid wall = plasmolysis.'
          },
          {
            id: 'cm-q3',
            question: 'Which is NOT found in animal cells?',
            type: 'mcq',
            options: ['Mitochondria', 'Cell wall', 'Golgi apparatus', 'Lysosomes'],
            correctAnswer: 1,
            explanation: 'Animal cells lack cell walls. Only cell membrane.'
          },
          {
            id: 'cm-q4',
            question: 'Organelle with hydrolytic enzymes at pH 4.5:',
            type: 'mcq',
            options: ['Peroxisome', 'Lysosome', 'Mitochondrion', 'Ribosome'],
            correctAnswer: 1,
            explanation: 'Lysosomes: acidic pH, hydrolytic enzymes, digest macromolecules.'
          }
        ]
      }
    ]
  }
];
