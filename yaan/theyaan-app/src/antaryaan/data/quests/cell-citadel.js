// ---------------------------------------------------------------------------
// Cell Citadel — Side Quests (Cell Biology)
// Topics: cell organelles, membrane structure, prokaryotic vs eukaryotic,
//         endomembrane system, transport mechanisms
// ---------------------------------------------------------------------------

export const cellCitadelQuests = [
  // =======================================================================
  // QUEST 1 — Journey Inside the Cell
  // =======================================================================
  {
    id: 'journey-inside-cell',
    name: 'Journey Inside the Cell',
    constellationId: 'cell-citadel',
    order: 1,
    xp: 150,
    intro:
      'You have been miniaturized and injected into a living **eukaryotic cell** aboard Station Bio-7. Your mission: navigate through the cell\'s interior, identify each organelle you encounter, and document their functions. The cell is under attack from a viral agent, and understanding its defenses is critical. Every organelle you correctly identify strengthens the cell\'s immune response.',
    loreReward:
      'Your journey through the cell is recorded as a complete **Organelle Atlas** — the most detailed map of a eukaryotic cell ever compiled. The atlas is stored in the Cell Citadel archives and will be used to train the next generation of cellular biologists aboard Station Bio-7.',
    titleReward: 'Cellular Explorer',
    badgeReward: 'organelle-mapper',
    parts: [
      {
        title: 'The Outer Wall',
        story:
          'You enter the cell through the **plasma membrane** — a flexible boundary made of a phospholipid bilayer studded with proteins. Inside, you notice the cell has a clearly defined nucleus enclosed in a double membrane. This immediately tells you something about the type of cell you are in.',
        question: {
          text: 'A cell has a membrane-bound nucleus and membrane-bound organelles. What type of cell is this?',
          options: [
            'Eukaryotic cell',
            'Prokaryotic cell',
            'Virus',
            'Prion',
          ],
          correctIndex: 0,
          explanation:
            'Eukaryotic cells have a membrane-bound nucleus and membrane-bound organelles (mitochondria, ER, Golgi, etc.). Prokaryotic cells (bacteria, archaea) lack a membrane-bound nucleus — their DNA is in a nucleoid region. Viruses are not cells at all, and prions are misfolded proteins. The presence of a nuclear envelope is the defining feature of eukaryotes (eu = true, karyon = nucleus).',
        },
        reveal:
          'Confirmed: eukaryotic. The nuclear envelope with its double membrane and nuclear pores is clearly visible. You swim deeper into the cytoplasm, dodging cytoskeletal filaments, heading toward the first major organelle.',
      },
      {
        title: 'The Power Plant',
        story:
          'You encounter a large, oblong organelle with a **double membrane**. The inner membrane is deeply folded into structures called **cristae**. The space inside smells of ATP — this is where the cell generates most of its energy.',
        question: {
          text: 'Which organelle has a double membrane with inner folds (cristae) and is the primary site of ATP production via aerobic respiration?',
          options: [
            'Mitochondrion',
            'Chloroplast',
            'Endoplasmic reticulum',
            'Golgi apparatus',
          ],
          correctIndex: 0,
          explanation:
            'The mitochondrion is the "powerhouse of the cell." It has an outer membrane and a highly folded inner membrane (cristae) that increases surface area for the electron transport chain. The matrix (interior) contains enzymes for the Krebs cycle. Mitochondria produce most of the cell\'s ATP through oxidative phosphorylation. They also have their own circular DNA and ribosomes, supporting the endosymbiotic theory — they were once free-living bacteria.',
        },
        reveal:
          'The mitochondrion hums with activity. Along the cristae, you can see the electron transport chain proteins pumping protons, creating the gradient that drives ATP synthase. This single organelle produces about 34-36 ATP molecules per glucose molecule through aerobic respiration, compared to just 2 from glycolysis alone.',
      },
      {
        title: 'The Factory Floor',
        story:
          'Moving deeper, you find an extensive network of membranes connected to the nuclear envelope. Part of this network is studded with tiny dark granules on its surface; another part is smooth. This is the largest organelle system in the cell by membrane area.',
        question: {
          text: 'The rough endoplasmic reticulum (RER) is studded with ribosomes. What is its primary function?',
          options: [
            'Synthesis and modification of proteins destined for secretion or membrane insertion',
            'Lipid synthesis and detoxification',
            'ATP production',
            'DNA replication',
          ],
          correctIndex: 0,
          explanation:
            'The rough ER (RER) is studded with ribosomes that synthesize proteins. Specifically, RER handles proteins that will be secreted from the cell, inserted into membranes, or sent to lysosomes. The proteins are threaded into the ER lumen, folded, and modified (e.g., glycosylation). The smooth ER (SER) lacks ribosomes and is involved in lipid synthesis, steroid hormone production, and detoxification of drugs/toxins. Together, the ER is the cell\'s primary manufacturing and processing center.',
        },
        reveal:
          'Ribosomes dot the RER surface like tiny factories, each one translating mRNA into protein chains that snake into the ER lumen. You watch a newly synthesized protein being folded by chaperone molecules — quality control at the molecular level. Misfolded proteins are tagged for destruction. The cell wastes nothing.',
      },
      {
        title: 'The Shipping Department',
        story:
          'Next to the ER, you spot a stack of flattened, disc-like membrane sacs — like a pile of deflated balloons. Small vesicles bud off from one side and larger vesicles emerge from the other. This organelle receives products from the ER and processes, sorts, and ships them to their final destinations.',
        question: {
          text: 'Which organelle receives proteins from the ER, modifies them further, sorts them, and packages them into vesicles for transport?',
          options: [
            'Golgi apparatus (Golgi body)',
            'Lysosome',
            'Peroxisome',
            'Vacuole',
          ],
          correctIndex: 0,
          explanation:
            'The Golgi apparatus (discovered by Camillo Golgi) is the cell\'s post office and shipping center. It receives transport vesicles from the ER at its cis face (receiving side), modifies proteins (further glycosylation, phosphorylation, sulfation), sorts them by destination, and packages them into vesicles that bud off from the trans face (shipping side). Destinations include: the plasma membrane (secretion), lysosomes, or back to the ER.',
        },
        reveal:
          'The Golgi stacks pulse rhythmically as vesicles arrive and depart. On the cis face, ER-derived vesicles merge in; on the trans face, labeled packages head to their destinations. Molecular "address tags" (like mannose-6-phosphate for lysosomal enzymes) ensure every package reaches the right location.',
      },
      {
        title: 'The Recycling Center',
        story:
          'You notice a round, single-membrane organelle approaching a damaged mitochondrion. It fuses with the damaged organelle and begins breaking it down. Inside this organelle, you detect highly acidic conditions (pH ~5) and dozens of hydrolytic enzymes.',
        question: {
          text: 'Which organelle contains hydrolytic enzymes at acidic pH and is responsible for intracellular digestion and recycling?',
          options: [
            'Lysosome',
            'Peroxisome',
            'Ribosome',
            'Centriole',
          ],
          correctIndex: 0,
          explanation:
            'Lysosomes are the cell\'s recycling centers, containing about 50 different hydrolytic enzymes (lipases, proteases, nucleases, etc.) that work optimally at pH ~5 (maintained by proton pumps). They digest: (1) damaged organelles (autophagy), (2) engulfed bacteria/debris (phagocytosis), (3) old cellular components. Lysosomes are formed from the Golgi apparatus. Lysosomal storage diseases (e.g., Tay-Sachs) occur when specific lysosomal enzymes are missing or defective.',
        },
        reveal:
          'The lysosome engulfs the damaged mitochondrion completely, breaking it down into recyclable amino acids, lipids, and nucleotides. Nothing is wasted — the building blocks are released back into the cytoplasm for reuse. This process, autophagy, is essential for cellular health and was the subject of a Nobel Prize.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — The Organelle Detective
  // =======================================================================
  {
    id: 'organelle-detective',
    name: 'The Organelle Detective',
    constellationId: 'cell-citadel',
    order: 2,
    xp: 160,
    intro:
      'A mysterious disease has struck the crew of Station Bio-7. Cells are malfunctioning across multiple organ systems. As the **Organelle Detective**, you must diagnose which organelle is affected in each patient by interpreting symptoms and cellular evidence. Each correct diagnosis unlocks a treatment protocol that saves the patient.',
    loreReward:
      'All five patients are treated successfully. Your diagnostic records are compiled into the **Citadel Disease Atlas**, a reference that links organelle dysfunction to clinical symptoms. The atlas becomes required reading for all Bio-7 medical personnel.',
    titleReward: 'Organelle Detective',
    badgeReward: 'citadel-diagnostician',
    parts: [
      {
        title: 'Patient 1 — The Energy Crisis',
        story:
          'Patient 1 presents with extreme fatigue, muscle weakness, and lactic acid buildup despite adequate oxygen supply. Muscle biopsy shows cells with abnormally shaped organelles that have disrupted inner membranes. The patient\'s cells seem unable to perform aerobic respiration efficiently.',
        question: {
          text: 'Which organelle dysfunction best explains these symptoms: fatigue, muscle weakness, lactic acid buildup, and disrupted cristae?',
          options: [
            'Mitochondrial dysfunction',
            'Ribosomal dysfunction',
            'Golgi apparatus dysfunction',
            'Nuclear envelope breakdown',
          ],
          correctIndex: 0,
          explanation:
            'The disrupted cristae (inner mitochondrial membrane folds) directly impair the electron transport chain and oxidative phosphorylation. Without efficient aerobic respiration, cells rely on anaerobic glycolysis, producing lactic acid and only 2 ATP per glucose instead of ~36-38. This causes fatigue and muscle weakness. Mitochondrial diseases are often inherited maternally (since mitochondrial DNA comes from the egg cell) and can affect high-energy tissues like muscles and nerves most severely.',
        },
        reveal:
          'Mitochondrial dysfunction confirmed. The treatment: a cocktail of CoQ10 and riboflavin to support the remaining functional electron transport chain components. The patient\'s energy levels begin improving within days. The lesson: when the powerhouse fails, the whole cell suffers.',
      },
      {
        title: 'Patient 2 — The Protein Pileup',
        story:
          'Patient 2\'s cells show a strange buildup of unfolded proteins in the cytoplasm. Normally, these proteins should be folded and processed before being shipped out of the cell. Electron microscopy reveals a collapsed and fragmented membrane network that should be continuous with the nuclear envelope.',
        question: {
          text: 'Protein accumulation with a collapsed membrane network continuous with the nuclear envelope points to dysfunction of which organelle?',
          options: [
            'Endoplasmic reticulum (ER)',
            'Lysosome',
            'Plasma membrane',
            'Cytoskeleton',
          ],
          correctIndex: 0,
          explanation:
            'The ER is continuous with the nuclear envelope and is responsible for protein folding (rough ER) and lipid synthesis (smooth ER). When the ER collapses or malfunctions, proteins cannot be properly folded, triggering the "unfolded protein response" (UPR). Chronic ER stress can lead to cell death (apoptosis). Many diseases involve ER stress, including certain forms of diabetes and neurodegenerative disorders.',
        },
        reveal:
          'ER dysfunction confirmed. The unfolded protein response has been activated, but the ER is too damaged to recover normally. Chemical chaperones are administered to help stabilize protein folding outside the ER. Patient stabilizes.',
      },
      {
        title: 'Patient 3 — The Storage Disease',
        story:
          'Patient 3 is a child with progressive neurological deterioration. Cell samples show massive accumulation of undigested lipids (specifically GM2 gangliosides) inside membrane-bound vesicles. The enzyme hexosaminidase A is absent.',
        question: {
          text: 'Accumulation of undigested material inside cells due to a missing enzyme suggests dysfunction of which organelle?',
          options: [
            'Lysosomes (lysosomal storage disease)',
            'Mitochondria',
            'Golgi apparatus',
            'Smooth ER',
          ],
          correctIndex: 0,
          explanation:
            'This is a lysosomal storage disease — specifically, Tay-Sachs disease (absence of hexosaminidase A leading to GM2 ganglioside accumulation). Lysosomes contain hydrolytic enzymes that break down macromolecules. When a specific enzyme is missing (due to genetic mutation), its substrate accumulates inside lysosomes, swelling the cell and causing tissue damage. Over 50 lysosomal storage diseases are known, each caused by a different missing enzyme.',
        },
        reveal:
          'Tay-Sachs disease — a devastating lysosomal storage disorder. Without hexosaminidase A, GM2 gangliosides pile up in neurons, destroying them. Current treatments focus on enzyme replacement therapy and gene therapy research. The diagnosis is logged in the Disease Atlas.',
      },
      {
        title: 'Patient 4 — The Sorting Error',
        story:
          'Patient 4\'s cells are secreting enzymes that should remain inside the cell. Lysosomal enzymes are being released into the bloodstream instead of being delivered to lysosomes. The mannose-6-phosphate tagging system appears to be broken.',
        question: {
          text: 'Mannose-6-phosphate tags are added in which organelle to direct enzymes to lysosomes?',
          options: [
            'Golgi apparatus',
            'Rough ER',
            'Nucleus',
            'Plasma membrane',
          ],
          correctIndex: 0,
          explanation:
            'The Golgi apparatus adds mannose-6-phosphate (M6P) tags to lysosomal enzymes in the cis-Golgi. These tags are recognized by M6P receptors in the trans-Golgi network, which sort the tagged enzymes into vesicles destined for lysosomes. Without proper tagging, lysosomal enzymes are secreted outside the cell by default. This is the basis of I-cell disease (mucolipidosis II), where the enzyme that adds the M6P tag is defective.',
        },
        reveal:
          'Golgi tagging failure confirmed — the M6P pathway is disrupted. Without the molecular "address label," lysosomal enzymes take the default secretory pathway out of the cell. This explains both the enzyme leakage into blood and the buildup of undigested material in lysosomes (which no longer receive their enzymes).',
      },
      {
        title: 'Patient 5 — The Structural Collapse',
        story:
          'Patient 5\'s cells have lost their shape — normally columnar epithelial cells have become rounded blobs. Cell motility has ceased, and cell division is arrested. Fluorescence microscopy reveals that the internal protein filament network has depolymerized.',
        question: {
          text: 'Which cellular structure, composed of protein filaments (microfilaments, microtubules, and intermediate filaments), maintains cell shape and enables movement?',
          options: [
            'Cytoskeleton',
            'Cell wall',
            'Extracellular matrix only',
            'Nuclear lamina only',
          ],
          correctIndex: 0,
          explanation:
            'The cytoskeleton is a network of protein filaments: (1) Microfilaments (actin) — maintain cell shape, enable contraction and crawling. (2) Microtubules (tubulin) — form the mitotic spindle, tracks for vesicle transport, and cilia/flagella. (3) Intermediate filaments (keratin, vimentin, etc.) — provide tensile strength. Loss of the cytoskeleton causes cells to lose shape, stop dividing (no spindle), and become immobile. Drugs like colchicine (disrupts microtubules) and cytochalasin (disrupts actin) are used in research to study cytoskeletal function.',
        },
        reveal:
          'The cytoskeleton has collapsed — all three filament systems are compromised. Without microtubules, vesicle transport halts and cell division stops. Without actin, cells cannot move or maintain shape. Stabilizing agents are administered to promote repolymerization. All five patients are now diagnosed and treated. The Organelle Detective case files are closed.',
      },
    ],
  },
]
