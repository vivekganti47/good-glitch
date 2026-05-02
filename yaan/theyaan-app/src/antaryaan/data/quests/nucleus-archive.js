// ---------------------------------------------------------------------------
// Nucleus Archive — Side Quests (Cell Division)
// Topics: cell cycle, mitosis, meiosis, DNA replication, chromosomes,
//         crossing over, independent assortment
// ---------------------------------------------------------------------------

export const nucleusArchiveQuests = [
  // =======================================================================
  // QUEST 1 — The Division Protocol
  // =======================================================================
  {
    id: 'division-protocol',
    name: 'The Division Protocol',
    constellationId: 'nucleus-archive',
    order: 1,
    xp: 160,
    intro:
      'The **Nucleus Archive** has detected an error in its cell replication database — the records describing mitosis have become scrambled. As a **Division Specialist**, you must restore the correct sequence of mitotic stages, verify chromosome counts at each phase, and ensure the Archive\'s records match biological reality. Every cell in your body depends on mitosis working correctly.',
    loreReward:
      'The mitosis database is fully restored. Your corrections reveal a subtle error that had been propagating through the Archive for cycles — a miscount of chromatids during anaphase. The corrected **Division Protocol** is now the authoritative reference in the Nucleus Archive.',
    titleReward: 'Division Specialist',
    badgeReward: 'mitosis-master',
    parts: [
      {
        title: 'The Cell Cycle Overview',
        story:
          'Before examining mitosis itself, the Archive asks you about the **cell cycle** as a whole. A human somatic cell spends most of its life in a phase that includes growth and DNA replication. Mitosis is actually a relatively brief part of the cycle.',
        question: {
          text: 'In which phase of the cell cycle does DNA replication occur?',
          options: [
            'S phase (Synthesis phase) of interphase',
            'M phase (Mitosis)',
            'G1 phase of interphase',
            'G2 phase of interphase',
          ],
          correctIndex: 0,
          explanation:
            'The cell cycle has two major parts: Interphase (G1 → S → G2) and M phase (Mitosis + Cytokinesis). DNA replication occurs during the S (Synthesis) phase of interphase. G1 is the first gap phase (cell growth and normal functions). G2 is the second gap phase (preparation for mitosis, synthesis of mitotic proteins). After S phase, each chromosome consists of two identical sister chromatids joined at the centromere.',
        },
        reveal:
          'The S phase record is restored. The Archive now correctly shows that a human cell enters S phase with 46 chromosomes (each as a single chromatid) and exits with 46 chromosomes (each as two sister chromatids joined at the centromere). The DNA content doubles from 2n to 4n during S phase.',
      },
      {
        title: 'The Stages of Mitosis',
        story:
          'The Archive presents the four stages of mitosis but in random order: **Anaphase, Prophase, Telophase, Metaphase**. You must arrange them correctly. Each stage has characteristic events involving chromosomes, spindle fibers, and the nuclear envelope.',
        question: {
          text: 'What is the correct order of mitotic stages?',
          options: [
            'Prophase → Metaphase → Anaphase → Telophase',
            'Metaphase → Prophase → Anaphase → Telophase',
            'Prophase → Anaphase → Metaphase → Telophase',
            'Telophase → Metaphase → Anaphase → Prophase',
          ],
          correctIndex: 0,
          explanation:
            'The mnemonic "PMAT" helps remember: Prophase (chromosomes condense, nuclear envelope breaks down, spindle forms), Metaphase (chromosomes align at the metaphase plate), Anaphase (sister chromatids separate and move to opposite poles), Telophase (nuclear envelopes reform, chromosomes decondense). Cytokinesis (division of the cytoplasm) typically overlaps with telophase.',
        },
        reveal:
          'PMAT — Prophase, Metaphase, Anaphase, Telophase. The sequence is locked into the Archive. Each stage has a clear checkpoint: the spindle assembly checkpoint at the metaphase-to-anaphase transition is especially critical. If chromosomes are not properly attached to spindle fibers, anaphase is delayed.',
      },
      {
        title: 'The Chromosome Count',
        story:
          'A critical question: a human somatic cell enters mitosis with **46 chromosomes** (2n = 46). Each chromosome has been replicated during S phase and consists of two sister chromatids. At the end of mitosis, how many chromosomes does each daughter cell have?',
        question: {
          text: 'A human cell (2n = 46) undergoes mitosis. How many chromosomes does each daughter cell have?',
          options: [
            '46 chromosomes (2n) — same as the parent',
            '23 chromosomes (n) — half the parent',
            '92 chromosomes (4n) — double the parent',
            '46 chromosomes but with different gene combinations',
          ],
          correctIndex: 0,
          explanation:
            'Mitosis produces two genetically identical daughter cells, each with the SAME chromosome number as the parent cell (2n = 46 in humans). During anaphase, sister chromatids (not homologous chromosomes) separate. Each daughter cell receives one chromatid from every chromosome, restoring the single-chromatid state. Mitosis is equational division — the ploidy remains unchanged. Only meiosis reduces the chromosome number.',
        },
        reveal:
          'Each daughter cell receives 46 chromosomes — a perfect copy of the parent. The genetic material is identical (barring any replication errors). This is why mitosis is used for growth, repair, and replacement of somatic cells. It maintains the diploid chromosome number across all body cells.',
      },
      {
        title: 'Anaphase Under the Microscope',
        story:
          'The Archive\'s microscopy records show a cell in **anaphase of mitosis**. The V-shaped structures are moving toward opposite poles. You notice that individual chromatids (not pairs of homologous chromosomes) are being pulled apart.',
        question: {
          text: 'During anaphase of mitosis, what exactly separates and moves to opposite poles?',
          options: [
            'Sister chromatids (identical copies of each chromosome)',
            'Homologous chromosome pairs',
            'Individual genes',
            'Centrioles',
          ],
          correctIndex: 0,
          explanation:
            'In mitotic anaphase, the enzyme separase cleaves the cohesin proteins holding sister chromatids together at the centromere. The now-separated chromatids (each considered an individual chromosome) are pulled to opposite poles by shortening kinetochore microtubules. This is different from meiosis I, where homologous chromosome pairs (not sister chromatids) separate. Understanding this distinction is critical: mitosis separates sisters; meiosis I separates homologs.',
        },
        reveal:
          'Sister chromatids separate — not homologs. This single distinction is the key difference between mitotic anaphase and anaphase I of meiosis. The Archive marks this as a "high-frequency error" in student records, emphasizing it with a red annotation.',
      },
      {
        title: 'The Checkpoint Guardian',
        story:
          'The Archive presents one final case: a patient whose cells are dividing uncontrollably. The cells bypass the G1 checkpoint without verifying proper growth signals. A protein called **p53** appears to be non-functional.',
        question: {
          text: 'What is the role of p53 in the cell cycle?',
          options: [
            'p53 is a tumor suppressor that halts the cell cycle at checkpoints when DNA is damaged or conditions are abnormal',
            'p53 promotes cell division by activating cyclin-dependent kinases',
            'p53 speeds up DNA replication during S phase',
            'p53 controls crossing over during meiosis',
          ],
          correctIndex: 0,
          explanation:
            'p53 is a tumor suppressor protein that acts as a checkpoint guardian. When DNA is damaged or conditions are not right, p53 halts the cell cycle (at the G1 checkpoint) or triggers apoptosis (programmed cell death). Without functional p53, damaged cells continue to divide uncontrollably, potentially leading to cancer. p53 mutations are found in over 50% of human cancers, making it the most commonly mutated gene in cancer.',
        },
        reveal:
          'p53 is the "guardian of the genome." When it fails, cells with damaged DNA slip through the checkpoint and divide, accumulating mutations. The Division Protocol is now fully restored, from the cell cycle phases through mitotic stages to the critical checkpoints that protect against uncontrolled growth.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Chromosomal Crossing
  // =======================================================================
  {
    id: 'chromosomal-crossing',
    name: 'Chromosomal Crossing',
    constellationId: 'nucleus-archive',
    order: 2,
    xp: 180,
    intro:
      'The Archive has received a request from the **Genetics Division**: a complete analysis of **meiosis**, the specialized cell division that produces gametes. Meiosis is where genetic diversity is generated through crossing over and independent assortment. As a **Meiosis Analyst**, you must guide the Archive through both meiotic divisions and explain how they differ from mitosis.',
    loreReward:
      'Your meiosis analysis is the most complete ever recorded in the Nucleus Archive. The **Crossing Over Atlas** you produced shows every possible recombination event for the human genome, a resource that will be invaluable for the Genetics Division\'s research into heredity and variation.',
    titleReward: 'Meiosis Analyst',
    badgeReward: 'crossing-over-expert',
    parts: [
      {
        title: 'Meiosis I — The Reduction Division',
        story:
          'Meiosis begins with a diploid cell (2n). Unlike mitosis, meiosis involves TWO successive divisions. The first division is called the **reduction division** because it halves the chromosome number. The Archive needs to know what happens to the chromosomes.',
        question: {
          text: 'In meiosis I, what separates during anaphase I?',
          options: [
            'Homologous chromosomes separate (one from each pair goes to each pole)',
            'Sister chromatids separate',
            'Individual genes separate',
            'The cell membrane separates first',
          ],
          correctIndex: 0,
          explanation:
            'In anaphase I of meiosis, HOMOLOGOUS CHROMOSOMES (not sister chromatids) separate and move to opposite poles. This is the reduction step: a cell that started with 2n chromosomes (e.g., 46 in humans = 23 pairs) ends meiosis I with two cells, each having n chromosomes (23 in humans). Each chromosome still consists of two sister chromatids at this point. Sister chromatids separate later, in meiosis II (which resembles mitosis).',
        },
        reveal:
          'Homologous pairs separate — this is the fundamental event that halves the chromosome number. After meiosis I, each daughter cell has 23 chromosomes (in humans), each consisting of two sister chromatids. The "reduction" is from 2n to n. This is why gametes (sperm and eggs) are haploid.',
      },
      {
        title: 'Crossing Over — The Genetic Shuffle',
        story:
          'During **prophase I**, something remarkable happens. Homologous chromosomes pair up tightly (synapsis), forming structures called **tetrads** (or bivalents). Non-sister chromatids of homologous pairs exchange segments of DNA at points called **chiasmata**.',
        question: {
          text: 'What is crossing over (recombination) in meiosis and when does it occur?',
          options: [
            'Exchange of DNA segments between non-sister chromatids of homologous pairs during prophase I',
            'Exchange of entire chromosomes between cells during metaphase II',
            'Duplication of DNA during S phase before meiosis',
            'Separation of sister chromatids during anaphase II',
          ],
          correctIndex: 0,
          explanation:
            'Crossing over occurs during prophase I when homologous chromosomes synapse (pair up). Non-sister chromatids (one from each homolog) exchange corresponding segments at chiasmata (crossover points). This creates recombinant chromosomes with new combinations of alleles. Crossing over is a major source of genetic variation because it shuffles alleles between maternal and paternal chromosomes. Without crossing over, all genes on the same chromosome would always be inherited together (complete linkage).',
        },
        reveal:
          'The chiasmata are visible under the microscope — X-shaped structures where chromatids have swapped segments. Each crossover event recombines maternal and paternal alleles on that chromosome, creating unique genetic combinations that did not exist in either parent. This is one of the two main sources of genetic diversity in meiosis.',
      },
      {
        title: 'Independent Assortment',
        story:
          'The second source of genetic diversity: **independent assortment**. During metaphase I, homologous pairs line up at the metaphase plate, but the orientation of each pair (which homolog faces which pole) is random and independent of other pairs.',
        question: {
          text: 'How many genetically different types of gametes can a human (2n = 46, i.e., 23 homologous pairs) produce through independent assortment alone (ignoring crossing over)?',
          options: [
            '2 to the power 23, which is about 8.4 million',
            '23',
            '46',
            '2 to the power 46, which is about 70 trillion',
          ],
          correctIndex: 0,
          explanation:
            'Each of the 23 homologous pairs independently orients at the metaphase plate with two possible orientations. By the rule of multiplication: 2 x 2 x 2 x ... (23 times) = 2 to the 23rd power = 8,388,608 possible combinations. This means one person can produce over 8 million genetically distinct gametes through independent assortment alone. When combined with crossing over, the number of possible genetic combinations becomes virtually infinite.',
        },
        reveal:
          'Over 8 million possible gamete types from independent assortment alone — and that is before accounting for crossing over. When two parents each produce 8.4 million gamete varieties, the number of possible offspring combinations is approximately 70 trillion. This is why every human (except identical twins) is genetically unique.',
      },
      {
        title: 'Meiosis II — The Equational Division',
        story:
          'After meiosis I produces two haploid cells, each undergoes **meiosis II**. This second division closely resembles mitosis. The Archive needs you to clarify what happens.',
        question: {
          text: 'What separates during anaphase II of meiosis, and how many total cells result from the complete meiotic process?',
          options: [
            'Sister chromatids separate; 4 haploid cells result',
            'Homologous chromosomes separate; 2 diploid cells result',
            'Sister chromatids separate; 2 haploid cells result',
            'Homologous chromosomes separate; 4 diploid cells result',
          ],
          correctIndex: 0,
          explanation:
            'Meiosis II is similar to mitosis: sister chromatids separate during anaphase II. Each of the two cells from meiosis I divides, producing 4 haploid cells total. The complete sequence: one diploid cell (2n) undergoes meiosis I to produce two haploid cells (n, each chromosome still has 2 chromatids), then meiosis II produces four haploid cells (n, each chromosome is a single chromatid). In males, all 4 become sperm. In females, only 1 becomes an egg (the other 3 become polar bodies).',
        },
        reveal:
          'Four haploid cells — the final products of meiosis. Meiosis I separates homologs (reduction); meiosis II separates sisters (equational). The key difference from mitosis: meiosis produces cells with HALF the chromosome number and genetically unique combinations. The Archive now has a complete, verified record of both meiotic divisions.',
      },
      {
        title: 'Nondisjunction — When Meiosis Goes Wrong',
        story:
          'The Archive presents a clinical case: a patient has 47 chromosomes instead of the normal 46, with three copies of chromosome 21. This condition, **trisomy 21 (Down syndrome)**, resulted from an error during meiosis in one of the parents.',
        question: {
          text: 'Trisomy 21 results from an error called nondisjunction. What does this mean?',
          options: [
            'Homologous chromosomes (or sister chromatids) fail to separate during meiosis, producing a gamete with an extra chromosome',
            'A mutation changes the DNA sequence on chromosome 21',
            'An extra round of DNA replication occurs in the embryo',
            'Crossing over deletes one copy of chromosome 21',
          ],
          correctIndex: 0,
          explanation:
            'Nondisjunction is the failure of chromosomes to separate properly during cell division. In meiosis I, if chromosome 21 homologs fail to separate, one gamete gets both copies (24 chromosomes) and the other gets none (22 chromosomes). When the gamete with 24 chromosomes is fertilized by a normal 23-chromosome gamete, the result is 47 chromosomes — trisomy 21. Nondisjunction can occur in meiosis I or II, and its frequency increases with maternal age.',
        },
        reveal:
          'Nondisjunction — a failure of separation. The consequences can be severe: trisomy 21 (Down syndrome), trisomy 18 (Edwards syndrome), or monosomy X (Turner syndrome). Most other trisomies and monosomies are lethal. The Chromosomal Crossing analysis is now complete, covering normal meiosis and its most important error mode.',
      },
    ],
  },
]
