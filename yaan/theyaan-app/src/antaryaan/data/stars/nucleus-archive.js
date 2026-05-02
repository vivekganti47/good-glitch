export const nucleusArchiveStars = [
  // ========== STAR 1: Cell Cycle Overview ==========
  {
    id: 'cell-cycle-overview',
    name: 'The Cell Cycle',
    constellationId: 'nucleus-archive',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['cell-cycle', 'interphase', 'mitotic-phase', 'checkpoints'],
    blocks: [
      {
        type: 'text',
        content: 'Every cell that divides follows a carefully orchestrated cycle. The **cell cycle** is the life story of a cell: it grows, copies its DNA, and then divides into two daughter cells. Most of the cycle is spent preparing for division, not actually dividing.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'cell-cycle-clock',
        title: 'Cell Cycle Clock',
        description: 'Watch a cell progress through the complete cell cycle in real time. Observe how the cell grows during G1, replicates DNA in S phase, prepares in G2, and divides in M phase. Click checkpoints to see what happens when they fail.',
        controls: [
          { id: 'speed', label: 'Cycle Speed', type: 'slider', min: 0.5, max: 3, step: 0.5 },
        ],
        discoveries: [
          { id: 'interphase-duration', label: 'Observed that interphase takes most of the cycle', hint: 'Watch the clock and note how long each phase takes' },
          { id: 'checkpoint-fail', label: 'Triggered a checkpoint failure', hint: 'Click on a checkpoint marker to simulate failure' },
          { id: 's-phase-replication', label: 'Watched DNA replicate during S phase', hint: 'Zoom into the nucleus during S phase' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The cell cycle has checkpoints (G1, G2, and metaphase) where the cell verifies conditions are right before proceeding. Failure of checkpoints can lead to uncontrolled division, which is the basis of cancer.'
      },
      {
        type: 'text',
        content: '**Phases of the Cell Cycle:**\n\n**Interphase** (90% of cycle):\n- **G1 (Gap 1):** Cell grows, performs normal functions, produces proteins\n- **S (Synthesis):** DNA is replicated. Each chromosome becomes two sister chromatids joined at the centromere\n- **G2 (Gap 2):** Cell prepares for division, produces proteins needed for mitosis\n\n**M Phase** (Mitotic phase):\n- **Mitosis:** Nuclear division (4 stages)\n- **Cytokinesis:** Cytoplasmic division',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'During which phase is DNA replicated?',
        options: ['G1', 'S phase', 'G2', 'M phase'],
        correctAnswer: 1,
        explanation: 'S (Synthesis) phase is when all DNA is replicated. After S phase, each chromosome consists of two identical sister chromatids.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A cell spends most of its life in:',
        options: ['Mitosis', 'Interphase', 'Cytokinesis', 'M phase'],
        correctAnswer: 1,
        explanation: 'Interphase (G1 + S + G2) takes about 90% of the cell cycle. Actual division (M phase) is relatively brief.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cco-q1',
            question: 'What happens at the G1 checkpoint?',
            type: 'mcq',
            options: [
              'Cell checks if DNA replication is complete',
              'Cell checks if it is large enough and conditions are favorable to divide',
              'Cell checks if chromosomes are aligned',
              'Cell checks if cytokinesis is complete'
            ],
            correctAnswer: 1,
            explanation: 'The G1 checkpoint (restriction point) verifies the cell is large enough and has the right signals before committing to DNA replication.'
          },
          {
            id: 'cco-q2',
            question: 'After S phase, each chromosome consists of:',
            type: 'mcq',
            options: ['One chromatid', 'Two sister chromatids joined at centromere', 'Four chromatids', 'An unpaired chromosome'],
            correctAnswer: 1,
            explanation: 'DNA replication in S phase produces two identical copies (sister chromatids) joined at the centromere.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Mitosis Stages ==========
  {
    id: 'mitosis-stages',
    name: 'Mitosis: The Dance of Chromosomes',
    constellationId: 'nucleus-archive',
    order: 2,
    duration: 10,
    xp: 20,
    concepts: ['prophase', 'metaphase', 'anaphase', 'telophase', 'mitotic-spindle'],
    blocks: [
      {
        type: 'text',
        content: '**Mitosis** divides one nucleus into two genetically identical nuclei. It ensures each daughter cell gets an exact copy of the parent\'s chromosomes. Remember: PMAT (Prophase, Metaphase, Anaphase, Telophase).',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'mitosis-sorter',
        title: 'Mitosis Stage Sorter',
        description: 'Drag the microscope view cards into the correct order of mitosis stages. Identify prophase, prometaphase, metaphase, anaphase, and telophase from cell images.',
        objective: 'Arrange all mitosis stages in the correct order',
        targetScore: 70,
      },
      {
        type: 'keyInsight',
        content: 'Mitosis preserves chromosome number. If the parent cell has 46 chromosomes (2n), both daughter cells have 46 chromosomes (2n). This is why mitosis is used for growth and repair, not for making sex cells.'
      },
      {
        type: 'text',
        content: '**Prophase:**\n- Chromatin condenses into visible chromosomes (each = 2 sister chromatids)\n- Nucleolus disappears\n- Mitotic spindle begins to form from centrosomes\n- In animal cells, centrosomes move to opposite poles\n\n**Prometaphase:**\n- Nuclear envelope breaks down\n- Spindle microtubules attach to kinetochores on chromosomes\n- Chromosomes begin moving toward the middle',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'During which phase do sister chromatids separate?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctAnswer: 2,
        explanation: 'Anaphase: centromeres split and sister chromatids are pulled to opposite poles by spindle fibers.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ms-q1',
            question: 'Chromosomes line up at the equator during:',
            type: 'mcq',
            options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
            correctAnswer: 1,
            explanation: 'Metaphase: chromosomes align at the metaphase plate.'
          },
          {
            id: 'ms-q2',
            question: 'A human cell (46 chromosomes) undergoes mitosis. Each daughter cell has:',
            type: 'number',
            correctAnswer: 46,
            unit: 'chromosomes',
            explanation: 'Mitosis produces genetically identical cells. Both daughters have 46 chromosomes.'
          },
          {
            id: 'ms-q3',
            question: 'The nuclear envelope re-forms during:',
            type: 'mcq',
            options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
            correctAnswer: 3,
            explanation: 'Telophase reverses prophase: envelope reforms, chromosomes decondense, nucleoli reappear.'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Cytokinesis ==========
  {
    id: 'cytokinesis',
    name: 'Cytokinesis: Dividing the Cytoplasm',
    constellationId: 'nucleus-archive',
    order: 3,
    duration: 6,
    xp: 15,
    concepts: ['cytokinesis', 'cleavage-furrow', 'cell-plate', 'animal-vs-plant'],
    blocks: [
      {
        type: 'text',
        content: 'Mitosis divides the nucleus, but the cell is not two cells until the cytoplasm divides too. **Cytokinesis** splits the cytoplasm and typically begins during late anaphase or telophase.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'mitosis-sorter',
        title: 'Cytokinesis Comparison',
        description: 'Compare animal and plant cytokinesis side by side. Drag the cleavage furrow to pinch an animal cell and build a cell plate to divide a plant cell. Switch between views to understand both mechanisms.',
        controls: [
          { id: 'cell-type', label: 'Cell Type', type: 'toggle', options: ['Animal', 'Plant'] },
        ],
        discoveries: [
          { id: 'furrow-pinch', label: 'Completed animal cell cytokinesis with cleavage furrow', hint: 'Drag the contractile ring to pinch the cell' },
          { id: 'plate-formation', label: 'Built the cell plate in a plant cell', hint: 'Switch to plant mode and guide vesicles to the center' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The cleavage furrow uses microfilaments (actin + myosin), while the cell plate uses vesicles from the Golgi. Different solutions to the same problem, adapted to the presence or absence of a cell wall.'
      },
      {
        type: 'text',
        content: '**In Animal Cells:**\n- A ring of actin microfilaments contracts (like pulling a drawstring)\n- Creates a **cleavage furrow** that pinches the cell in two\n- Two separate daughter cells result\n\n**In Plant Cells:**\n- A rigid cell wall prevents pinching\n- Instead, Golgi vesicles carrying cell wall material fuse at the center\n- They form a **cell plate** that grows outward until it divides the cell\n- The cell plate becomes the new cell wall between daughter cells',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Plant cells divide their cytoplasm using:',
        options: ['Cleavage furrow', 'Cell plate', 'Constriction ring', 'Nuclear envelope'],
        correctAnswer: 1,
        explanation: 'Plant cells form a cell plate from Golgi vesicles. They cannot pinch because of the rigid cell wall.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cy-q1',
            question: 'The cleavage furrow is formed by contraction of:',
            type: 'mcq',
            options: ['Microtubules', 'Actin microfilaments', 'Intermediate filaments', 'Spindle fibers'],
            correctAnswer: 1,
            explanation: 'A contractile ring of actin and myosin microfilaments pinches the animal cell in two.'
          },
          {
            id: 'cy-q2',
            question: 'In plant cytokinesis, vesicles from which organelle form the cell plate?',
            type: 'mcq',
            options: ['ER', 'Golgi apparatus', 'Lysosomes', 'Mitochondria'],
            correctAnswer: 1,
            explanation: 'Golgi-derived vesicles carry cell wall materials and fuse to form the cell plate.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Meiosis I ==========
  {
    id: 'meiosis-one',
    name: 'Meiosis I: The Reduction Division',
    constellationId: 'nucleus-archive',
    order: 4,
    duration: 10,
    xp: 25,
    concepts: ['meiosis-i', 'homologous-chromosomes', 'crossing-over', 'independent-assortment'],
    blocks: [
      {
        type: 'text',
        content: '**Meiosis** produces sex cells (gametes) with HALF the chromosome number. A diploid cell (2n) produces haploid cells (n). Meiosis I is the "reduction division" where homologous chromosomes separate.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'chromosome-counter',
        title: 'Meiosis I Chromosome Tracker',
        description: 'Follow chromosomes through each stage of Meiosis I. Count chromosomes, chromatids, and DNA molecules at each phase. Watch homologous chromosomes pair up and separate during the reduction division.',
        controls: [
          { id: 'organism', label: 'Organism (2n)', type: 'select', options: ['Human (2n=46)', 'Fruit Fly (2n=8)', 'Pea (2n=14)'] },
        ],
        discoveries: [
          { id: 'tetrad-formation', label: 'Observed tetrads forming during Prophase I', hint: 'Watch homologous pairs come together' },
          { id: 'reduction', label: 'Counted the chromosome reduction after Anaphase I', hint: 'Count chromosomes moving to each pole' },
          { id: 'crossing-over', label: 'Spotted crossing over between homologs', hint: 'Zoom into a tetrad during Prophase I' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Meiosis I separates HOMOLOGS (maternal vs paternal chromosomes). Meiosis II separates SISTER CHROMATIDS. The reduction in chromosome number happens in Meiosis I. Meiosis II is essentially mitosis of haploid cells.'
      },
      {
        type: 'text',
        content: '**Prophase I:** (longest and most important phase)\n- Chromosomes condense\n- Homologous chromosomes pair up (synapsis) forming tetrads (bivalents)\n- **Crossing over** occurs: homologs exchange segments of DNA\n- This creates new combinations of alleles (genetic recombination)\n\n**Metaphase I:**\n- Homologous PAIRS line up at the metaphase plate (not individual chromosomes)\n- Orientation of each pair is random (independent assortment)',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What separates during Anaphase I?',
        options: ['Sister chromatids', 'Homologous chromosomes', 'Individual chromosomes', 'DNA strands'],
        correctAnswer: 1,
        explanation: 'In Anaphase I, homologous chromosomes separate. Sister chromatids remain joined and separate later in Anaphase II.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Crossing over occurs during:',
        options: ['Prophase I', 'Metaphase I', 'Prophase II', 'S phase'],
        correctAnswer: 0,
        explanation: 'Crossing over happens in Prophase I when homologous chromosomes are paired (synapsis). They exchange DNA segments at points called chiasmata.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mi-q1',
            question: 'A human cell (2n = 46) completes Meiosis I. Each daughter cell has:',
            type: 'number',
            correctAnswer: 23,
            unit: 'chromosomes',
            explanation: 'Meiosis I halves the number: 46 → 23. Each cell has 23 chromosomes (each still with 2 chromatids).'
          },
          {
            id: 'mi-q2',
            question: 'Independent assortment occurs because:',
            type: 'mcq',
            options: [
              'Homologous pairs orient randomly at Metaphase I',
              'Crossing over mixes alleles',
              'Sister chromatids separate randomly',
              'DNA replication introduces mutations'
            ],
            correctAnswer: 0,
            explanation: 'Each homologous pair aligns independently at the metaphase plate, so maternal and paternal chromosomes sort into gametes randomly.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Meiosis II ==========
  {
    id: 'meiosis-two',
    name: 'Meiosis II and Genetic Diversity',
    constellationId: 'nucleus-archive',
    order: 5,
    duration: 8,
    xp: 20,
    concepts: ['meiosis-ii', 'genetic-variation', 'meiosis-vs-mitosis', 'gamete-formation'],
    blocks: [
      {
        type: 'text',
        content: '**Meiosis II** is very similar to mitosis: sister chromatids separate. But it starts with haploid cells, so it produces haploid cells. The end result of meiosis: 4 genetically unique haploid cells from one diploid parent.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'chromosome-counter',
        title: 'Mitosis vs Meiosis Comparison',
        description: 'Run mitosis and meiosis side by side and track chromosome numbers at every stage. See how one preserves the count while the other halves it, and where genetic variation is introduced.',
        controls: [
          { id: 'view-mode', label: 'View', type: 'toggle', options: ['Side by Side', 'Meiosis Only'] },
          { id: 'organism', label: 'Organism (2n)', type: 'select', options: ['Human (2n=46)', 'Fruit Fly (2n=8)', 'Pea (2n=14)'] },
        ],
        discoveries: [
          { id: 'same-vs-half', label: 'Compared final chromosome counts of mitosis vs meiosis', hint: 'Let both processes complete and compare daughter cells' },
          { id: 'two-vs-four', label: 'Noted mitosis makes 2 cells while meiosis makes 4', hint: 'Count the final daughter cells in each process' },
          { id: 'unique-gametes', label: 'Observed that all 4 meiotic products are genetically different', hint: 'Compare the chromosome patterns in the 4 meiotic daughter cells' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Mitosis: 1 cell → 2 identical diploid cells (for growth/repair).\nMeiosis: 1 cell → 4 unique haploid cells (for sexual reproduction).\nMeiosis halves chromosome number; fertilization restores it.'
      },
      {
        type: 'text',
        content: '**Three Sources of Genetic Variation in Meiosis:**\n1. **Crossing over** (Prophase I): Shuffles alleles between homologs\n2. **Independent assortment** (Metaphase I): Random orientation of homologous pairs. For n chromosome pairs, there are 2ⁿ possible combinations (humans: 2²³ = 8.4 million)\n3. **Random fertilization:** Any sperm can meet any egg',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'How many genetically unique cells result from one round of meiosis?',
        options: ['2', '4', '8', '1'],
        correctAnswer: 1,
        explanation: 'Meiosis produces 4 haploid cells. Due to crossing over and independent assortment, all 4 are genetically unique.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mii-q1',
            question: 'What separates during Anaphase II?',
            type: 'mcq',
            options: ['Homologous chromosomes', 'Sister chromatids', 'DNA double helix', 'Cell membrane'],
            correctAnswer: 1,
            explanation: 'Anaphase II: sister chromatids finally separate, just like in mitosis.'
          },
          {
            id: 'mii-q2',
            question: 'A cell with 2n = 8 undergoes meiosis. Each gamete has:',
            type: 'number',
            correctAnswer: 4,
            unit: 'chromosomes',
            explanation: '2n = 8, so n = 4. Each gamete is haploid with 4 chromosomes.'
          },
          {
            id: 'mii-q3',
            question: 'Which process does NOT contribute to genetic variation?',
            type: 'mcq',
            options: ['Crossing over', 'Independent assortment', 'DNA replication', 'Random fertilization'],
            correctAnswer: 2,
            explanation: 'DNA replication aims to produce identical copies. Crossing over, independent assortment, and random fertilization all generate variation.'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Archive Mastery ==========
  {
    id: 'archive-mastery',
    name: 'Nucleus Archive Mastery',
    constellationId: 'nucleus-archive',
    order: 6,
    duration: 8,
    xp: 30,
    concepts: ['cell-division-review', 'mitosis-vs-meiosis', 'chromosome-counting'],
    blocks: [
      {
        type: 'text',
        content: 'The Nucleus Archive mastery requires you to distinguish mitosis from meiosis, track chromosome numbers through division, and understand the sources of genetic variation.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'mitosis-sorter',
        title: 'Division Stage Master Challenge',
        description: 'Sort microscope images into the correct stages of BOTH mitosis and meiosis. Identify whether each image shows mitosis or meiosis, then place it in the right phase. Includes tricky comparisons like Anaphase I vs Anaphase II.',
        objective: 'Correctly classify and order all division stages for both mitosis and meiosis',
        targetScore: 80,
      },
      {
        type: 'keyInsight',
        content: 'Mitosis vs Meiosis comparison:\n- Mitosis: 1 division, 2 cells, diploid, identical, for growth\n- Meiosis: 2 divisions, 4 cells, haploid, unique, for gametes\n- Meiosis I: homologs separate (reduction)\n- Meiosis II: sister chromatids separate (like mitosis)\n- Crossing over: only in Meiosis I (Prophase I)'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A human cell (2n = 46) is in G2 phase. How many DNA molecules does it contain?',
        correctAnswer: 92,
        unit: '',
        explanation: 'After S phase, each chromosome has been replicated (2 chromatids each). 46 chromosomes × 2 = 92 DNA molecules.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How many chromosomes are in a human cell at Metaphase II of meiosis?',
        correctAnswer: 23,
        unit: '',
        explanation: 'After Meiosis I, cells are haploid (23 chromosomes). Each chromosome still has 2 chromatids until Anaphase II.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'am-q1',
            question: 'Which is true about mitosis but NOT meiosis?',
            type: 'mcq',
            options: [
              'Produces genetically identical daughter cells',
              'Involves crossing over',
              'Produces haploid cells',
              'Involves two rounds of division'
            ],
            correctAnswer: 0,
            explanation: 'Mitosis produces identical cells. Meiosis produces unique haploid cells with crossing over and two divisions.'
          },
          {
            id: 'am-q2',
            question: 'Nondisjunction in Meiosis I means:',
            type: 'mcq',
            options: [
              'Crossing over does not occur',
              'Homologous chromosomes fail to separate',
              'Sister chromatids fail to separate',
              'The cell fails to undergo cytokinesis'
            ],
            correctAnswer: 1,
            explanation: 'Nondisjunction in Meiosis I: homologs fail to separate, resulting in gametes with abnormal chromosome numbers (e.g., trisomy 21 = Down syndrome).'
          },
          {
            id: 'am-q3',
            question: 'If a species has 2n = 14, how many different chromosome combinations can independent assortment produce?',
            type: 'number',
            correctAnswer: 128,
            unit: '',
            explanation: 'n = 7. Independent assortment gives 2⁷ = 128 possible combinations.'
          },
          {
            id: 'am-q4',
            question: 'A cell undergoes mitosis followed by meiosis. Starting with 2n = 10, the final cells have:',
            type: 'number',
            correctAnswer: 5,
            unit: 'chromosomes each',
            explanation: 'Mitosis: 2n → 2n (still 10). Then meiosis: 2n → n = 5.'
          }
        ]
      }
    ]
  }
];
