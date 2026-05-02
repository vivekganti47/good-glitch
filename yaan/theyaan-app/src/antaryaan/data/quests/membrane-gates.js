// ---------------------------------------------------------------------------
// Membrane Gates — Side Quests (Biomolecules & Membrane Transport)
// Topics: proteins, enzymes, nucleic acids, membrane transport,
//         osmosis, active transport, cell signaling
// ---------------------------------------------------------------------------

export const membraneGatesQuests = [
  // =======================================================================
  // QUEST 1 — The Enzyme Engineering Lab
  // =======================================================================
  {
    id: 'enzyme-engineering-lab',
    name: 'The Enzyme Engineering Lab',
    constellationId: 'membrane-gates',
    order: 1,
    xp: 150,
    intro:
      'The **Membrane Gates Research Station** has a critical problem: the enzyme systems that regulate transport across cell membranes are malfunctioning. As a **Biomolecular Engineer**, you must demonstrate your knowledge of proteins, enzyme kinetics, and biomolecular structure to diagnose and fix the problem. Each phase tests a different aspect of biomolecular science.',
    loreReward:
      'The enzyme systems are repaired and membrane transport is restored. Your engineering notes are compiled into the **Biomolecular Manual**, a reference that explains how proteins fold, how enzymes catalyze reactions, and how nucleic acids encode the instructions for building both. The manual is stored permanently in the Membrane Gates archive.',
    titleReward: 'Enzyme Engineer',
    badgeReward: 'biomolecular-expert',
    parts: [
      {
        title: 'Protein Structure Levels',
        story:
          'The first malfunctioning enzyme has lost its 3D shape — it has been **denatured**. To repair it, you must understand the four levels of protein structure. The enzyme is a single polypeptide chain that normally folds into a specific globular shape stabilized by various bonds and interactions.',
        question: {
          text: 'Which level of protein structure refers to the specific 3D folding of a single polypeptide chain, stabilized by interactions between R-groups?',
          options: [
            'Tertiary structure',
            'Primary structure',
            'Secondary structure',
            'Quaternary structure',
          ],
          correctIndex: 0,
          explanation:
            'The four levels are: Primary — the linear amino acid sequence (peptide bonds). Secondary — local folding patterns like alpha-helices and beta-pleated sheets (hydrogen bonds between backbone atoms). Tertiary — the overall 3D shape of a single polypeptide, stabilized by R-group interactions (hydrophobic interactions, ionic bonds, disulfide bridges, hydrogen bonds). Quaternary — the arrangement of multiple polypeptide subunits (only in multi-subunit proteins like hemoglobin). Tertiary structure determines the enzyme\'s active site shape.',
        },
        reveal:
          'Tertiary structure is the key to enzyme function — it creates the precise 3D active site that binds substrates. When an enzyme is denatured (by heat, extreme pH, or heavy metals), the tertiary structure unfolds and the active site collapses. The enzyme loses its catalytic ability. Refolding can sometimes restore function, but severe denaturation is often irreversible.',
      },
      {
        title: 'Lock and Key vs Induced Fit',
        story:
          'The second enzyme shows unusual behavior: it changes shape slightly when its substrate binds. The traditional **lock-and-key model** cannot explain this. You need to identify the correct model of enzyme action.',
        question: {
          text: 'Which model of enzyme action explains how the enzyme\'s active site changes shape slightly upon substrate binding to achieve a tighter fit?',
          options: [
            'Induced fit model',
            'Lock and key model',
            'Allosteric model',
            'Competitive inhibition model',
          ],
          correctIndex: 0,
          explanation:
            'The induced fit model (proposed by Daniel Koshland) states that the active site is not a rigid "lock" — instead, it changes shape slightly when the substrate binds, molding around the substrate for an optimal fit. This is now considered more accurate than the original lock-and-key model (Emil Fischer). The shape change can also stress the substrate bonds, lowering the activation energy. Allosteric regulation is a separate concept where binding at a distant site affects the active site.',
        },
        reveal:
          'The enzyme flexes as the substrate docks — induced fit in action. This dynamic interaction is more energetically favorable than a rigid lock-and-key because it allows the enzyme to optimize contact with the substrate. The concept explains why enzymes are so remarkably specific yet adaptable.',
      },
      {
        title: 'Enzyme Inhibition',
        story:
          'A toxin from the environment is blocking one of the station\'s critical enzymes. Analysis shows the toxin molecule is structurally similar to the enzyme\'s normal substrate and is binding to the active site, preventing the real substrate from entering.',
        question: {
          text: 'A molecule that resembles the substrate and blocks the active site is called:',
          options: [
            'Competitive inhibitor',
            'Non-competitive inhibitor',
            'Uncompetitive inhibitor',
            'Allosteric activator',
          ],
          correctIndex: 0,
          explanation:
            'A competitive inhibitor has a shape similar to the substrate and competes for the active site. It can be overcome by increasing substrate concentration (which outcompetes the inhibitor). It increases the apparent Km but does not change Vmax. A non-competitive inhibitor binds to a different site (allosteric site), changing the enzyme\'s shape — it reduces Vmax but does not change Km. An uncompetitive inhibitor binds only to the enzyme-substrate complex.',
        },
        reveal:
          'Competitive inhibition — the toxin masquerades as the substrate. The fix: flood the system with excess real substrate to outcompete the toxin. This is the same principle behind antidotes like ethanol for methanol poisoning (ethanol competes for alcohol dehydrogenase, preventing toxic methanol metabolism).',
      },
      {
        title: 'DNA — The Blueprint',
        story:
          'To permanently fix the enzyme production system, you need to repair the **DNA** sequence that encodes the enzyme. The station\'s genetic database asks you to verify your knowledge of DNA structure before granting access.',
        question: {
          text: 'Which statement about DNA structure is correct?',
          options: [
            'DNA is a double helix with antiparallel strands; A pairs with T (2 H-bonds) and G pairs with C (3 H-bonds)',
            'DNA is a single-stranded molecule; A pairs with G and T pairs with C',
            'DNA has parallel strands; all base pairs have 2 hydrogen bonds',
            'DNA is a double helix where A pairs with C and G pairs with T',
          ],
          correctIndex: 0,
          explanation:
            'DNA is a double helix with two antiparallel strands (one runs 5\' to 3\', the other 3\' to 5\'). The base pairing rules are: Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds, and Guanine (G) pairs with Cytosine (C) via 3 hydrogen bonds. This complementary base pairing (Chargaff\'s rules) means the two strands carry equivalent information. The sugar-phosphate backbone is on the outside; the bases face inward. In RNA, Uracil (U) replaces Thymine.',
        },
        reveal:
          'A-T with 2 bonds, G-C with 3 bonds — the fundamental code of life. The extra hydrogen bond in G-C pairs makes GC-rich regions of DNA more thermally stable. You gain access to the genetic database and begin locating the enzyme gene.',
      },
      {
        title: 'From Gene to Protein',
        story:
          'The gene encoding the malfunctioning enzyme has been found. To repair it, you need to understand how DNA information flows to create a protein. The **central dogma of molecular biology** describes this flow.',
        question: {
          text: 'The central dogma describes information flow as:',
          options: [
            'DNA is transcribed to mRNA, then mRNA is translated to Protein',
            'Protein to RNA to DNA',
            'mRNA to DNA to Protein',
            'DNA to Protein to RNA',
          ],
          correctIndex: 0,
          explanation:
            'The central dogma (Francis Crick, 1958): DNA is transcribed into mRNA (in the nucleus, by RNA polymerase), and mRNA is translated into protein (at ribosomes, in the cytoplasm). The genetic code is read in triplets (codons): each 3-nucleotide codon specifies one amino acid. There are 64 possible codons coding for 20 amino acids, plus stop signals. Exceptions exist (reverse transcriptase in retroviruses converts RNA to DNA), but the general flow is DNA to RNA to Protein.',
        },
        reveal:
          'DNA to RNA to Protein — the central dogma is the foundation of molecular biology. The enzyme gene is transcribed into mRNA, which is translated by ribosomes into the polypeptide chain that folds into the functional enzyme. You repair the gene sequence, and the station\'s cells begin producing the correct enzyme. Membrane transport is restored.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — The Osmotic Emergency
  // =======================================================================
  {
    id: 'osmotic-emergency',
    name: 'The Osmotic Emergency',
    constellationId: 'membrane-gates',
    order: 2,
    xp: 170,
    intro:
      'A catastrophic hull breach has flooded the bio-lab of the Membrane Gates station with **distilled water**. The lab\'s cell cultures are in danger — different cell types respond very differently to changes in the osmotic environment. As the **Transport Specialist**, you must rapidly assess the threat to each culture and apply the correct interventions. Your knowledge of membrane transport — passive, active, and osmotic — will determine which cells survive.',
    loreReward:
      'All cell cultures are saved. The emergency response data is compiled into the **Transport Protocols Manual**, a comprehensive guide to membrane transport mechanisms. The manual includes flow diagrams for passive diffusion, facilitated diffusion, osmosis, and active transport, annotated with your real-time calculations.',
    titleReward: 'Transport Specialist',
    badgeReward: 'osmosis-expert',
    parts: [
      {
        title: 'The Membrane Model',
        story:
          'Before you can save the cultures, you need to understand the membrane itself. The station\'s training system asks you to identify the model that describes the cell membrane\'s structure: a mosaic of proteins floating in a fluid bilayer of phospholipids.',
        question: {
          text: 'What is the name of the model that describes the cell membrane as a fluid phospholipid bilayer with embedded and peripheral proteins?',
          options: [
            'Fluid mosaic model',
            'Lock and key model',
            'Sandwich model',
            'Unit membrane model',
          ],
          correctIndex: 0,
          explanation:
            'The fluid mosaic model (Singer and Nicolson, 1972) describes the cell membrane as a fluid phospholipid bilayer with a mosaic of proteins. "Fluid" because the phospholipids and many proteins can move laterally within the membrane. "Mosaic" because of the diverse collection of proteins (integral/transmembrane proteins spanning the bilayer, peripheral proteins on the surface). The bilayer is selectively permeable: small nonpolar molecules (O2, CO2) pass freely, but ions and large polar molecules need transport proteins.',
        },
        reveal:
          'The fluid mosaic model — the definitive description of membrane architecture. The bilayer\'s fluidity is essential for membrane function: it allows transport proteins to operate, receptors to cluster, and the membrane to self-seal after damage. Cholesterol molecules stabilize fluidity in animal cell membranes.',
      },
      {
        title: 'Osmosis and the Red Blood Cells',
        story:
          'The first endangered culture: **red blood cells (RBCs)**. They are currently in a normal isotonic saline solution (0.9% NaCl). The distilled water flooding in will make the environment hypotonic. You know that water moves from regions of low solute concentration to high solute concentration across a semipermeable membrane.',
        question: {
          text: 'What happens to red blood cells placed in a hypotonic solution (distilled water)?',
          options: [
            'Water enters the cells by osmosis; they swell and may burst (hemolysis)',
            'Water leaves the cells; they shrink (crenation)',
            'Nothing — the membrane is impermeable to water',
            'Solutes leave the cells to equalize concentration',
          ],
          correctIndex: 0,
          explanation:
            'In a hypotonic solution, the solute concentration outside the cell is lower than inside. Water moves by osmosis from the hypotonic environment (low solute, high water concentration) into the cell (high solute, low water concentration). RBCs lack a cell wall, so they swell and can burst (lyse) — this is called hemolysis. In a hypertonic solution, the opposite occurs: water leaves, and the cells shrink (crenation). In an isotonic solution, water movement is balanced.',
        },
        reveal:
          'The RBCs will burst if you do not act fast. You quickly add saline concentrate to the floodwater around the RBC culture, restoring isotonic conditions. The cells stabilize. But other cultures still need attention.',
      },
      {
        title: 'Plant Cells in Distilled Water',
        story:
          'The second culture: **plant cells**. Unlike animal cells, plant cells have a rigid **cell wall** outside their cell membrane. How will they respond to the same hypotonic distilled water?',
        question: {
          text: 'What happens to plant cells placed in a hypotonic (distilled water) environment?',
          options: [
            'Water enters by osmosis; the cell becomes turgid but does not burst because the cell wall provides structural support',
            'Water enters; the cell bursts like an animal cell',
            'Water leaves; the cell plasmolyzes',
            'Nothing happens — plant cells are impermeable to water',
          ],
          correctIndex: 0,
          explanation:
            'Like animal cells, water enters plant cells by osmosis in a hypotonic solution. However, plant cells have a rigid cell wall that resists expansion. As water enters, turgor pressure builds up inside the cell (the cell pushes against the wall). Eventually, the turgor pressure equals the osmotic pressure, and net water movement stops. The cell becomes turgid (firm) but does not burst. This turgor is actually the ideal state for plant cells — it keeps them firm and supports the plant\'s structure. Plasmolysis (cell shrinking away from the wall) occurs in HYPERtonic solutions.',
        },
        reveal:
          'The plant cells are actually HAPPY in distilled water — they become turgid, which is their optimal state. The cell wall saves them from lysis. You move on to the more vulnerable cultures. Turgor pressure is the same force that keeps non-woody plants upright; when they wilt, they have lost turgor.',
      },
      {
        title: 'Active Transport — The Sodium-Potassium Pump',
        story:
          'The flooding has also disrupted the ion gradients across cell membranes. The station\'s neural cell culture depends on the **sodium-potassium pump (Na+/K+ ATPase)** to maintain the resting membrane potential. This pump must work against concentration gradients, so it requires energy.',
        question: {
          text: 'The Na+/K+ ATPase pump moves 3 Na+ out of the cell and 2 K+ into the cell per ATP hydrolyzed. What type of transport is this?',
          options: [
            'Primary active transport (directly uses ATP energy)',
            'Passive transport (facilitated diffusion)',
            'Osmosis',
            'Secondary active transport (uses an ion gradient)',
          ],
          correctIndex: 0,
          explanation:
            'The Na+/K+ ATPase is the classic example of primary active transport — it directly hydrolyzes ATP to move ions AGAINST their concentration gradients. It pumps 3 Na+ out and 2 K+ in per cycle, creating a net positive charge outside the cell. This electrogenic pump establishes the resting membrane potential (~-70 mV in neurons) essential for nerve impulses. Active transport is any movement against the concentration gradient and always requires energy. Secondary active transport uses the gradient created by primary active transport (e.g., glucose symport with Na+).',
        },
        reveal:
          'The Na+/K+ pump is restored: 3 sodium ions out, 2 potassium ions in, 1 ATP spent per cycle. The unequal ion transport creates a net negative charge inside the cell, establishing the resting potential. Without this pump, neurons cannot fire action potentials and muscles cannot contract.',
      },
      {
        title: 'Facilitated Diffusion — The GLUT Transporter',
        story:
          'The final culture needs glucose. Glucose cannot cross the lipid bilayer on its own (it is too large and polar). It requires a specific transport protein. The culture\'s GLUT transporters (glucose transporters) are intact, and glucose concentration is higher outside the cell than inside.',
        question: {
          text: 'Glucose moves into cells via GLUT transporters, down its concentration gradient, without ATP. This is an example of:',
          options: [
            'Facilitated diffusion (passive transport via a protein channel or carrier)',
            'Active transport',
            'Simple diffusion directly through the lipid bilayer',
            'Endocytosis',
          ],
          correctIndex: 0,
          explanation:
            'Facilitated diffusion is passive transport that uses transport proteins (channels or carriers) to move molecules DOWN their concentration gradient. No ATP is required — the driving force is the concentration gradient itself. GLUT transporters are carrier proteins that bind glucose, change shape, and release it on the other side. Unlike active transport, facilitated diffusion cannot move molecules against their gradient. Simple diffusion (without proteins) is only possible for small, nonpolar molecules like O2, CO2, and steroid hormones.',
        },
        reveal:
          'Glucose flows into the cells via GLUT transporters — no energy needed, just a favorable concentration gradient. The key distinction: facilitated diffusion uses proteins but no ATP; active transport uses proteins AND ATP. Simple diffusion needs neither. All cell cultures are now stable. The Osmotic Emergency is resolved, and the Transport Protocols Manual is complete.',
      },
    ],
  },
]
