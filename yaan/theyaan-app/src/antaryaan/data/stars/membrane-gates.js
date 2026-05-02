export const membraneGatesStars = [
  // ========== STAR 1: Membrane Structure ==========
  {
    id: 'membrane-structure',
    name: 'Membrane Structure',
    constellationId: 'membrane-gates',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['phospholipid-bilayer', 'fluid-mosaic-model', 'membrane-proteins', 'cholesterol'],
    blocks: [
      {
        type: 'text',
        content: 'The cell membrane is only 7-8 nanometers thick, yet it is the boundary between life and non-life. It controls what enters and exits, receives signals, and maintains the cell\'s identity. Understanding its structure is key to understanding its function.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'membrane-transport',
        title: 'Membrane Structure Explorer',
        description: 'Explore the fluid mosaic model up close. Click on phospholipids, cholesterol, integral proteins, and glycoproteins to learn their roles. Drag molecules toward the membrane to see which can pass through and which are blocked.',
        controls: [],
        discoveries: [
          { id: 'phospholipid-bilayer', label: 'Understood the phospholipid arrangement', hint: 'Click on the bilayer to see head and tail orientation' },
          { id: 'cholesterol-role', label: 'Discovered cholesterol\'s role in fluidity', hint: 'Click on cholesterol molecules between the phospholipids' },
          { id: 'selective-permeability', label: 'Tested which molecules can cross', hint: 'Drag different molecules toward the membrane' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'The membrane is selectively permeable. Small nonpolar molecules (O\u2082, CO\u2082) pass freely. Water passes slowly through the bilayer but much faster through aquaporin channels. Ions and large molecules need specific transport proteins.'
      },
      {
        type: 'text',
        content: '**The Fluid Mosaic Model** (Singer and Nicolson, 1972):\n- "Fluid": phospholipids and proteins can move laterally within the membrane (like boats on a sea)\n- "Mosaic": membrane is studded with a variety of proteins\n\n**Membrane Components:**\n- Integral proteins: embedded in the bilayer (channels, transporters)\n- Peripheral proteins: attached to the surface\n- Cholesterol: stabilizes membrane fluidity (prevents too rigid or too fluid)\n- Glycoproteins/glycolipids: carbohydrate chains on the outer surface (cell recognition)',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What makes the cell membrane "fluid"?',
        options: [
          'It is made of water',
          'Phospholipids and proteins can move laterally',
          'It is very thin',
          'It has pores'
        ],
        correctAnswer: 1,
        explanation: 'The "fluid" in Fluid Mosaic Model refers to the ability of phospholipids and proteins to move laterally within the plane of the membrane.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Which molecule freely crosses the phospholipid bilayer WITHOUT a transport protein?',
        options: ['Na\u207A ions', 'Glucose', 'O\u2082', 'Amino acids'],
        correctAnswer: 2,
        explanation: 'O\u2082 is small and nonpolar, so it diffuses directly through the hydrophobic interior. Ions and large polar molecules need help.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ms-q1',
            question: 'What is the role of cholesterol in the membrane?',
            type: 'mcq',
            options: [
              'Provides energy',
              'Stabilizes fluidity across temperature changes',
              'Transports ions',
              'Stores genetic information'
            ],
            correctAnswer: 1,
            explanation: 'Cholesterol acts as a fluidity buffer: prevents the membrane from becoming too fluid at high temperatures or too rigid at low temperatures.'
          },
          {
            id: 'ms-q2',
            question: 'Glycoproteins on the cell surface function in:',
            type: 'mcq',
            options: ['Energy storage', 'Cell recognition and signaling', 'DNA replication', 'Lipid synthesis'],
            correctAnswer: 1,
            explanation: 'Carbohydrate chains on glycoproteins serve as identity markers for cell recognition, immune response, and signaling.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Passive Transport ==========
  {
    id: 'passive-transport',
    name: 'Passive Transport',
    constellationId: 'membrane-gates',
    order: 2,
    duration: 10,
    xp: 20,
    concepts: ['diffusion', 'facilitated-diffusion', 'concentration-gradient', 'channel-proteins'],
    blocks: [
      {
        type: 'text',
        content: 'Molecules are in constant random motion. Given time, they naturally spread from areas of HIGH concentration to LOW concentration. This is **diffusion**, and it requires NO energy from the cell. Transport that uses diffusion is called **passive transport**.',
        subtype: 'hook'
      },
      {
        type: 'sandbox',
        simType: 'membrane-transport',
        title: 'Passive Transport Lab',
        description: 'Adjust solute concentrations on each side of the membrane and watch molecules move by diffusion. Add or remove channel proteins to see how facilitated diffusion works. Observe how changing the gradient affects the rate of transport.',
        controls: [
          { id: 'molecule-type', label: 'Molecule', type: 'select', options: ['O2 (nonpolar)', 'Glucose (polar)', 'Na+ (ion)', 'H2O'] },
          { id: 'concentration-left', label: 'Left Concentration', type: 'slider', min: 0, max: 100, step: 10 },
          { id: 'concentration-right', label: 'Right Concentration', type: 'slider', min: 0, max: 100, step: 10 },
          { id: 'channels', label: 'Channel Proteins', type: 'toggle', options: ['None', 'Present'] },
        ],
        discoveries: [
          { id: 'simple-diffusion', label: 'Watched O2 diffuse without channel proteins', hint: 'Select O2 and create a concentration gradient' },
          { id: 'facilitated-needed', label: 'Discovered glucose needs channels to cross', hint: 'Try glucose without channels, then add them' },
          { id: 'equilibrium', label: 'Reached equilibrium (net movement stops)', hint: 'Wait until concentrations equalize' },
        ],
        completionCriteria: { requiredDiscoveries: 2 },
      },
      {
        type: 'keyInsight',
        content: 'Both simple and facilitated diffusion are PASSIVE (no energy). The difference is the pathway: simple diffusion goes through the lipid bilayer; facilitated diffusion goes through proteins. Both follow the concentration gradient.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'Glucose enters most cells by:',
        options: ['Simple diffusion', 'Facilitated diffusion', 'Active transport', 'Endocytosis'],
        correctAnswer: 1,
        explanation: 'Glucose is large and polar, so it cannot cross the bilayer directly. It uses carrier proteins (GLUT transporters) to move down its concentration gradient: facilitated diffusion.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'What would happen to the rate of diffusion if you doubled the concentration difference?',
        options: ['Rate halves', 'Rate doubles', 'Rate stays the same', 'Rate quadruples'],
        correctAnswer: 1,
        explanation: 'Rate of diffusion is proportional to the concentration gradient. Double the gradient, double the rate.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'pt-q1',
            question: 'Which does NOT affect the rate of diffusion?',
            type: 'mcq',
            options: ['Temperature', 'Concentration gradient', 'ATP availability', 'Membrane thickness'],
            correctAnswer: 2,
            explanation: 'Diffusion is passive and does not use ATP. Temperature, gradient, and membrane properties all affect the rate.'
          },
          {
            id: 'pt-q2',
            question: 'Ion channels in the membrane allow:',
            type: 'mcq',
            options: [
              'Any molecule to pass',
              'Specific ions to move down their gradient',
              'Ions to move against their gradient',
              'Large proteins to cross'
            ],
            correctAnswer: 1,
            explanation: 'Ion channels are selective (specific to certain ions) and allow facilitated diffusion (down the gradient, no energy).'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Osmosis ==========
  {
    id: 'osmosis',
    name: 'Osmosis: Water on the Move',
    constellationId: 'membrane-gates',
    order: 3,
    duration: 10,
    xp: 20,
    concepts: ['osmosis', 'tonicity', 'hypertonic', 'hypotonic', 'isotonic', 'water-potential'],
    blocks: [
      {
        type: 'text',
        content: '**Osmosis** is the diffusion of water across a selectively permeable membrane. Water moves from regions of LOW solute concentration (high water concentration) to HIGH solute concentration (low water concentration).',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'osmosis-lab',
        title: 'Osmosis Lab',
        description: 'Place animal and plant cells in solutions of different tonicities. Watch what happens to each cell in real time as water moves by osmosis. Predict whether cells will swell, shrink, or stay the same.',
        controls: [
          { id: 'cell-type', label: 'Cell Type', type: 'toggle', options: ['Animal (RBC)', 'Plant'] },
          { id: 'solution', label: 'Solution', type: 'select', options: ['Hypotonic', 'Isotonic', 'Hypertonic'] },
        ],
        discoveries: [
          { id: 'lysis', label: 'Observed an animal cell burst in hypotonic solution', hint: 'Place a red blood cell in hypotonic solution' },
          { id: 'turgid', label: 'Saw a plant cell become turgid (not burst)', hint: 'Place a plant cell in hypotonic solution' },
          { id: 'plasmolysis', label: 'Witnessed plasmolysis in a plant cell', hint: 'Place a plant cell in hypertonic solution' },
          { id: 'crenation', label: 'Observed animal cell crenation', hint: 'Place a red blood cell in hypertonic solution' },
        ],
        completionCriteria: { requiredDiscoveries: 3 },
      },
      {
        type: 'keyInsight',
        content: 'Water moves toward the higher solute concentration (toward the "saltier" side). Think: "water follows solute." In a hypotonic solution, there are more solutes INSIDE the cell, so water rushes IN.'
      },
      {
        type: 'text',
        content: '**Osmotic Pressure:** The pressure needed to stop osmosis across a membrane. Solutions with more solute have higher osmotic pressure. IV fluids must be isotonic to blood to prevent cell damage.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A red blood cell is placed in pure water (hypotonic). What happens?',
        options: [
          'It shrivels',
          'It swells and may burst (lyse)',
          'Nothing happens',
          'It divides'
        ],
        correctAnswer: 1,
        explanation: 'Pure water is hypotonic to the cell. Water enters by osmosis, causing the cell to swell. Without a cell wall, it can burst (hemolysis).'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A plant cell in a hypotonic solution:',
        options: [
          'Bursts',
          'Becomes turgid (firm) due to the cell wall',
          'Plasmolyzes',
          'Shrivels'
        ],
        correctAnswer: 1,
        explanation: 'Water enters the plant cell, pushing the membrane against the cell wall. The rigid wall prevents bursting. The cell becomes turgid (firm), which is actually the ideal state for plant cells.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'os-q1',
            question: 'Wilting in plants is caused by:',
            type: 'mcq',
            options: [
              'Too much water (hypotonic)',
              'Loss of turgor pressure (hypertonic or not enough water)',
              'Too much sunlight',
              'Excess nutrients'
            ],
            correctAnswer: 1,
            explanation: 'When a plant cell loses water (hypertonic environment or drought), it loses turgor pressure. Without the internal water pushing against the wall, the plant wilts.'
          },
          {
            id: 'os-q2',
            question: 'Why must IV fluids be isotonic?',
            type: 'mcq',
            options: [
              'To provide nutrients',
              'To prevent red blood cells from swelling or shrinking',
              'To kill bacteria',
              'To maintain body temperature'
            ],
            correctAnswer: 1,
            explanation: 'If IV fluid is hypotonic, cells swell and burst. If hypertonic, cells shrink. Isotonic fluid causes no net water movement.'
          },
          {
            id: 'os-q3',
            question: 'In which direction does water move during osmosis?',
            type: 'mcq',
            options: [
              'From high solute to low solute',
              'From low solute to high solute',
              'Always into the cell',
              'Always out of the cell'
            ],
            correctAnswer: 1,
            explanation: 'Water moves from low solute concentration (high water) to high solute concentration (low water). Water follows solute.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Active Transport ==========
  {
    id: 'active-transport',
    name: 'Active Transport',
    constellationId: 'membrane-gates',
    order: 4,
    duration: 10,
    xp: 25,
    concepts: ['active-transport', 'sodium-potassium-pump', 'endocytosis', 'exocytosis', 'bulk-transport'],
    blocks: [
      {
        type: 'text',
        content: 'Sometimes cells need to move molecules AGAINST their concentration gradient, from low to high concentration. This is like pushing a ball uphill: it requires energy. **Active transport** uses ATP to move molecules against the gradient.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'pump-simulator',
        title: 'Sodium-Potassium Pump Challenge',
        description: 'Operate the Na+/K+-ATPase pump manually. Bind 3 Na+ ions inside the cell, hydrolyze ATP to change the pump shape, release Na+ outside, bind 2 K+ ions, and release them inside. Complete multiple pump cycles to build the electrochemical gradient.',
        objective: 'Complete 5 full pump cycles maintaining the correct 3 Na+ out / 2 K+ in ratio',
        targetScore: 75,
      },
      {
        type: 'keyInsight',
        content: 'Passive transport: down gradient, no ATP. Active transport: against gradient, uses ATP. Both are essential. The Na/K pump creates the gradient that nerve cells use to send signals, which is then "spent" through passive ion flow during a nerve impulse.'
      },
      {
        type: 'text',
        content: '**Bulk Transport (for large molecules):**\n\n**Endocytosis** (into the cell):\n- Phagocytosis: "cell eating" - engulfs large particles (e.g., white blood cells engulfing bacteria)\n- Pinocytosis: "cell drinking" - takes in dissolved substances in small vesicles\n- Receptor-mediated: specific molecules bind receptors, triggering vesicle formation (e.g., LDL cholesterol uptake)\n\n**Exocytosis** (out of the cell):\n- Vesicles fuse with the membrane and release contents outside\n- Used for secretion of hormones, neurotransmitters, mucus',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'The Na\u207A/K\u207A pump moves per cycle:',
        options: [
          '2 Na\u207A out, 3 K\u207A in',
          '3 Na\u207A out, 2 K\u207A in',
          '3 Na\u207A in, 2 K\u207A out',
          'Equal Na\u207A and K\u207A'
        ],
        correctAnswer: 1,
        explanation: 'The pump exports 3 Na\u207A and imports 2 K\u207A per ATP hydrolyzed. This creates a net positive charge outside the cell.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A white blood cell engulfing a bacterium is an example of:',
        options: ['Exocytosis', 'Pinocytosis', 'Phagocytosis', 'Facilitated diffusion'],
        correctAnswer: 2,
        explanation: 'Phagocytosis ("cell eating"): the cell extends pseudopods around the bacterium and engulfs it into a vesicle.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'at-q1',
            question: 'Which requires ATP?',
            type: 'mcq',
            options: ['Osmosis', 'Facilitated diffusion', 'Active transport', 'Simple diffusion'],
            correctAnswer: 2,
            explanation: 'Only active transport requires energy (ATP). All forms of diffusion and osmosis are passive.'
          },
          {
            id: 'at-q2',
            question: 'Neurotransmitter release from a nerve cell occurs by:',
            type: 'mcq',
            options: ['Endocytosis', 'Exocytosis', 'Diffusion', 'Active transport'],
            correctAnswer: 1,
            explanation: 'Neurotransmitters are stored in vesicles that fuse with the membrane (exocytosis) to release them into the synapse.'
          },
          {
            id: 'at-q3',
            question: 'Receptor-mediated endocytosis is used by cells to take in:',
            type: 'mcq',
            options: [
              'Water',
              'Specific molecules like LDL cholesterol',
              'Oxygen',
              'Carbon dioxide'
            ],
            correctAnswer: 1,
            explanation: 'Specific molecules (like LDL cholesterol) bind to receptors on the cell surface, triggering the membrane to form a vesicle around them.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Gates Mastery ==========
  {
    id: 'gates-mastery',
    name: 'Membrane Gates Mastery',
    constellationId: 'membrane-gates',
    order: 5,
    duration: 8,
    xp: 30,
    concepts: ['membrane-review', 'transport-comparison', 'clinical-applications'],
    blocks: [
      {
        type: 'text',
        content: 'The Membrane Gates mastery integrates everything: membrane structure, passive transport, osmosis, and active transport. A master understands how the cell controls its internal environment.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'pump-simulator',
        title: 'Transport Master Challenge',
        description: 'A cell needs to maintain its internal environment. Manage all transport types simultaneously: keep the Na+/K+ gradient running, allow glucose in via facilitated diffusion, and handle osmotic balance. Each round increases difficulty with more molecules to manage.',
        objective: 'Keep the cell alive for 5 rounds by maintaining proper ion gradients and molecular balance',
        targetScore: 80,
      },
      {
        type: 'keyInsight',
        content: 'Transport summary:\n- Simple diffusion: small nonpolar, no protein, no ATP\n- Facilitated diffusion: ions/polar molecules, through proteins, no ATP\n- Osmosis: water, through membrane/aquaporins, no ATP\n- Active transport: against gradient, through proteins, uses ATP\n- Endocytosis/Exocytosis: bulk transport of large molecules, uses ATP'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'A cell is placed in a solution and water enters the cell. The solution is:',
        options: ['Hypertonic', 'Hypotonic', 'Isotonic', 'Cannot determine'],
        correctAnswer: 1,
        explanation: 'If water enters the cell, there is more solute inside (more water outside). The solution is hypotonic to the cell.'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'If you block all ATP production in a cell, which transport continues?',
        options: ['Na\u207A/K\u207A pump', 'Phagocytosis', 'Osmosis', 'Receptor-mediated endocytosis'],
        correctAnswer: 2,
        explanation: 'Osmosis is passive (no ATP needed). All active transport, endocytosis, and exocytosis would stop without ATP.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'gm-q1',
            question: 'A cell needs to concentrate iodine inside itself (against gradient). It uses:',
            type: 'mcq',
            options: ['Simple diffusion', 'Osmosis', 'Active transport', 'Facilitated diffusion'],
            correctAnswer: 2,
            explanation: 'Moving against the concentration gradient requires active transport (ATP).'
          },
          {
            id: 'gm-q2',
            question: 'Cystic fibrosis involves a defective chloride channel protein. This affects:',
            type: 'mcq',
            options: [
              'Simple diffusion of Cl\u207B',
              'Facilitated diffusion of Cl\u207B',
              'Active transport of Cl\u207B',
              'Osmosis'
            ],
            correctAnswer: 2,
            explanation: 'The CFTR protein is an ATP-gated chloride channel that uses active transport. Its malfunction causes thick mucus due to disrupted salt and water balance.'
          },
          {
            id: 'gm-q3',
            question: 'A 0.9% NaCl solution is isotonic to human blood. A 5% NaCl solution would cause red blood cells to:',
            type: 'mcq',
            options: ['Swell', 'Shrink (crenate)', 'Stay the same', 'Divide'],
            correctAnswer: 1,
            explanation: '5% NaCl is hypertonic. Water leaves cells by osmosis, causing them to shrink (crenation).'
          },
          {
            id: 'gm-q4',
            question: 'Why does the phospholipid bilayer form spontaneously in water?',
            type: 'mcq',
            options: [
              'ATP drives the process',
              'Hydrophobic tails avoid water, hydrophilic heads face water',
              'Enzymes assemble it',
              'Ionic bonds hold it together'
            ],
            correctAnswer: 1,
            explanation: 'The bilayer forms due to the hydrophobic effect: nonpolar tails are excluded from water and cluster together, while polar heads interact with water. No energy input needed.'
          }
        ]
      }
    ]
  }
];
