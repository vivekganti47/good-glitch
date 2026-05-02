// Nucleus Archive - Cell Division practice planets
// Topics: cell cycle, mitosis, meiosis, chromosome counting, genetic variation

export const nucleusArchivePlanets = [
  {
    id: 'division-identification',
    name: 'Division Identification',
    constellationId: 'nucleus-archive',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'na1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'During which phase of the cell cycle is DNA replicated?',
        options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
        correctIndex: 1,
        hint: 'S stands for Synthesis - DNA synthesis.',
        solution: 'DNA replication occurs during S (Synthesis) phase of interphase. After S phase, each chromosome consists of 2 identical sister chromatids.',
        concepts: ['cell-cycle']
      },
      {
        id: 'na1-2',
        type: 'mcq',
        difficulty: 2,
        text: 'Chromosomes line up at the cell equator during which stage of mitosis?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctIndex: 1,
        hint: 'Think: Meta = Middle.',
        solution: 'During metaphase, chromosomes align at the metaphase plate (cell equator). This allows the spindle checkpoint to verify proper attachment before separation.',
        concepts: ['mitosis']
      },
      {
        id: 'na1-3',
        type: 'mcq',
        difficulty: 2,
        text: 'Sister chromatids separate during:',
        options: ['Anaphase of mitosis', 'Anaphase I of meiosis', 'Prophase', 'Telophase'],
        correctIndex: 0,
        hint: 'In mitosis, sister chromatids separate. In meiosis I, homologous chromosomes separate.',
        solution: 'Sister chromatids separate during anaphase of mitosis (and also anaphase II of meiosis). During anaphase I, homologous chromosomes (not sister chromatids) separate.',
        concepts: ['mitosis', 'meiosis']
      },
      {
        id: 'na1-4',
        type: 'numerical',
        difficulty: 2,
        text: 'A human cell has 46 chromosomes (2n = 46). After mitosis, each daughter cell has how many chromosomes?',
        correctAnswer: 46,
        unit: 'chromosomes',
        hint: 'Mitosis produces genetically identical cells with the same chromosome number.',
        solution: 'Mitosis preserves the chromosome number. Both daughter cells have 46 chromosomes, identical to the parent cell.',
        concepts: ['mitosis']
      },
      {
        id: 'na1-5',
        type: 'numerical',
        difficulty: 2,
        text: 'After meiosis I, each cell has how many chromosomes? (Starting with 2n = 46)',
        correctAnswer: 23,
        unit: 'chromosomes',
        hint: 'Meiosis I is the reduction division, halving the chromosome number.',
        solution: 'Meiosis I separates homologous chromosomes, halving the number from 46 to 23. Each chromosome still has 2 sister chromatids.',
        concepts: ['meiosis']
      },
      {
        id: 'na1-6',
        type: 'match',
        difficulty: 3,
        text: 'Match each phase of mitosis with its key event.',
        leftColumn: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        rightColumn: [
          'Nuclear envelope re-forms',
          'Chromosomes condense, spindle forms',
          'Chromosomes align at equator',
          'Sister chromatids separate'
        ],
        correctMatches: { 0: 1, 1: 2, 2: 3, 3: 0 },
        hint: 'PMAT: Prophase (condense), Metaphase (middle), Anaphase (apart), Telophase (two nuclei).',
        solution: 'Prophase: condense/spindle. Metaphase: align at equator. Anaphase: chromatids separate. Telophase: nuclear envelope re-forms.',
        concepts: ['mitosis']
      },
      {
        id: 'na1-7',
        type: 'mcq',
        difficulty: 3,
        text: 'Crossing over occurs during which specific stage?',
        options: ['Prophase of mitosis', 'Prophase I of meiosis', 'Metaphase I of meiosis', 'Anaphase II of meiosis'],
        correctIndex: 1,
        hint: 'Crossing over requires homologous chromosomes to be paired (synapsis).',
        solution: 'Crossing over occurs during Prophase I of meiosis when homologous chromosomes pair up (synapsis) and exchange DNA segments at chiasmata. This creates genetic recombination.',
        concepts: ['meiosis', 'crossing-over']
      },
      {
        id: 'na1-8',
        type: 'mcq',
        difficulty: 4,
        text: 'A cell in metaphase I of meiosis can be distinguished from one in metaphase of mitosis because in metaphase I:',
        options: [
          'Chromosomes are visible',
          'Homologous pairs (tetrads) are lined up at the equator',
          'Individual chromosomes line up at the equator',
          'The cell is larger'
        ],
        correctIndex: 1,
        hint: 'In meiosis I, homologous chromosomes are still paired. In mitosis, individual chromosomes align.',
        solution: 'In metaphase I, homologous pairs (bivalents/tetrads) align at the equator. In mitosis metaphase, individual chromosomes align. This is the key visual difference.',
        concepts: ['meiosis-vs-mitosis']
      }
    ]
  },
  {
    id: 'meiosis-vs-mitosis',
    name: 'Meiosis vs Mitosis',
    constellationId: 'nucleus-archive',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'na2-1',
        type: 'mcq',
        difficulty: 2,
        text: 'How many cells are produced at the end of meiosis (from one parent cell)?',
        options: ['1', '2', '4', '8'],
        correctIndex: 2,
        hint: 'Meiosis has two rounds of division.',
        solution: 'Meiosis I: 1 cell \u2192 2 cells. Meiosis II: 2 cells \u2192 4 cells. Total: 4 haploid daughter cells.',
        concepts: ['meiosis']
      },
      {
        id: 'na2-2',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following are sources of genetic variation in meiosis?',
        options: [
          'Crossing over',
          'Independent assortment',
          'DNA replication',
          'Random fertilization',
          'Cytokinesis'
        ],
        correctIndices: [0, 1, 3],
        hint: 'Three mechanisms create genetic diversity in sexual reproduction.',
        solution: 'Crossing over (Prophase I), independent assortment (Metaphase I), and random fertilization all contribute to genetic variation. DNA replication aims for accuracy, and cytokinesis is just cytoplasm division.',
        concepts: ['genetic-variation']
      },
      {
        id: 'na2-3',
        type: 'numerical',
        difficulty: 3,
        text: 'An organism has 2n = 8. How many different combinations of chromosomes can be produced by independent assortment alone?',
        correctAnswer: 16,
        unit: 'combinations',
        hint: 'With n pairs of homologous chromosomes, independent assortment produces 2^n combinations.',
        solution: 'n = 4 (since 2n = 8). Number of combinations = 2^n = 2^4 = 16.',
        concepts: ['independent-assortment']
      },
      {
        id: 'na2-4',
        type: 'mcq',
        difficulty: 3,
        text: 'What separates during Anaphase I of meiosis?',
        options: [
          'Sister chromatids',
          'Homologous chromosomes',
          'DNA double helix',
          'Centrioles'
        ],
        correctIndex: 1,
        hint: 'Meiosis I is the reduction division. What needs to separate to reduce the chromosome number?',
        solution: 'During Anaphase I, homologous chromosomes separate (one goes to each pole). Sister chromatids remain attached until Anaphase II.',
        concepts: ['meiosis']
      },
      {
        id: 'na2-5',
        type: 'numerical',
        difficulty: 4,
        text: 'A human cell (2n = 46) has completed S phase and is about to enter mitosis. How many DNA molecules does it have?',
        correctAnswer: 92,
        unit: 'DNA molecules',
        hint: 'After S phase, each chromosome has been replicated into 2 sister chromatids.',
        solution: 'After S phase, each of the 46 chromosomes has been replicated (2 chromatids each). 46 \u00D7 2 = 92 DNA molecules. (But still only 46 centromeres until anaphase.)',
        concepts: ['cell-cycle', 'chromosome-counting']
      },
      {
        id: 'na2-6',
        type: 'mcq',
        difficulty: 4,
        text: 'Nondisjunction during meiosis I would result in gametes with:',
        options: [
          'The normal number of chromosomes',
          'Either n+1 or n-1 chromosomes',
          'Double the normal chromosome number',
          'No chromosomes'
        ],
        correctIndex: 1,
        hint: 'Nondisjunction means chromosomes fail to separate properly.',
        solution: 'Nondisjunction in meiosis I: one daughter cell gets both homologs (n+1) and the other gets neither (n-1). After meiosis II: 2 gametes have n+1, 2 have n-1. Fertilization with a normal gamete gives trisomy (2n+1) or monosomy (2n-1).',
        concepts: ['nondisjunction']
      },
      {
        id: 'na2-7',
        type: 'match',
        difficulty: 3,
        text: 'Match mitosis vs meiosis characteristics.',
        leftColumn: [
          'Produces 2 cells',
          'Produces 4 cells',
          'Daughter cells are diploid',
          'Crossing over occurs'
        ],
        rightColumn: ['Mitosis', 'Meiosis', 'Mitosis', 'Meiosis'],
        correctMatches: { 0: 0, 1: 1, 2: 2, 3: 3 },
        hint: 'Mitosis: 1 division, 2 diploid cells. Meiosis: 2 divisions, 4 haploid cells with crossing over.',
        solution: '2 cells \u2192 mitosis. 4 cells \u2192 meiosis. Diploid \u2192 mitosis. Crossing over \u2192 meiosis.',
        concepts: ['meiosis-vs-mitosis']
      },
      {
        id: 'na2-8',
        type: 'mcq',
        difficulty: 5,
        text: 'Down syndrome (trisomy 21) most commonly results from:',
        options: [
          'A mutation in chromosome 21',
          'Nondisjunction during meiosis producing a gamete with 2 copies of chromosome 21',
          'Exposure to radiation',
          'A deletion on chromosome 21'
        ],
        correctIndex: 1,
        hint: 'Trisomy means 3 copies of a chromosome instead of 2.',
        solution: 'Nondisjunction during meiosis (usually in the egg) produces a gamete with 2 copies of chromosome 21. When fertilized by a normal sperm (1 copy), the zygote has 3 copies (trisomy 21).',
        concepts: ['nondisjunction']
      }
    ]
  }
];
