// ---------------------------------------------------------------------------
// Mole Nebula — Side Quests (Mole Concept & Stoichiometry)
// Topics: mole concept, molar mass, stoichiometry, limiting reagent,
//         percent composition, empirical/molecular formula
// ---------------------------------------------------------------------------

export const moleNebulaQuests = [
  // =======================================================================
  // QUEST 1 — The Fuel Synthesis Mission
  // =======================================================================
  {
    id: 'fuel-synthesis-mission',
    name: 'The Fuel Synthesis Mission',
    constellationId: 'mole-nebula',
    order: 1,
    xp: 160,
    intro:
      'Your ship\'s fuel reserves are critically low. The only way to survive is to synthesize fuel at the **Nebula Refinery**, an abandoned chemical plant drifting in the Mole Nebula. Raw materials are available, but you must calculate exact quantities — waste nothing, because every gram counts. Stoichiometry is the difference between reaching port and drifting forever.',
    loreReward:
      'The fuel synthesis is complete and your tanks are full. The Nebula Refinery\'s automated systems record your calculations into the **Stoichiometry Codex**, a reference guide now added to the Mole Nebula archives. Your efficiency rating: 100% — zero waste.',
    titleReward: 'Fuel Chemist',
    badgeReward: 'nebula-refiner',
    parts: [
      {
        title: 'Counting Molecules',
        story:
          'The refinery\'s first module requires you to calibrate the molecular counter. You have exactly **1 mole of water (H₂O)**. The calibration sequence asks you for the total number of atoms in this sample.',
        question: {
          text: 'How many total atoms are in 1 mole of H₂O? (Avogadro\'s number = 6.022 × 10²³)',
          options: [
            '1.8066 × 10²⁴ atoms',
            '6.022 × 10²³ atoms',
            '1.2044 × 10²⁴ atoms',
            '3.0 × 10²³ atoms',
          ],
          correctIndex: 0,
          explanation:
            'One mole of H₂O contains 6.022 × 10²³ molecules. Each molecule has 3 atoms (2H + 1O). Total atoms = 3 × 6.022 × 10²³ = 1.8066 × 10²⁴. Be careful: "1 mole of water" means 1 mole of molecules, but each molecule contains multiple atoms.',
        },
        reveal:
          'The molecular counter calibrates perfectly at 1.8066 × 10²⁴ atoms. The distinction between moles of molecules and moles of atoms is crucial — the refinery\'s systems now correctly count individual atoms for the synthesis ahead.',
      },
      {
        title: 'Molar Mass Calculation',
        story:
          'The fuel is **methanol (CH₃OH)**. Before you can synthesize it, the refinery needs its molar mass for the mass-flow controllers. You look up the atomic masses: **C = 12 g/mol, H = 1 g/mol, O = 16 g/mol**.',
        question: {
          text: 'What is the molar mass of methanol, CH₃OH?',
          options: ['32 g/mol', '30 g/mol', '34 g/mol', '28 g/mol'],
          correctIndex: 0,
          explanation:
            'Molar mass of CH₃OH = C + 4H + O = 12 + 4(1) + 16 = 32 g/mol. Count all atoms carefully: the molecular formula CH₃OH contains 1 carbon, 4 hydrogens (3 + 1), and 1 oxygen. Always expand condensed formulas to count atoms correctly.',
        },
        reveal:
          'The mass-flow controllers lock in 32 g/mol for methanol. The refinery\'s display shows the molecular structure: a carbon bonded to three hydrogens and one OH group. Every 32 grams you produce contains exactly one mole — 6.022 × 10²³ molecules of fuel.',
      },
      {
        title: 'Stoichiometry of Synthesis',
        story:
          'The fuel synthesis reaction is: **CO + 2H₂ → CH₃OH**. You have **280 g of CO** available (molar mass CO = 28 g/mol). The refinery asks how much hydrogen gas you need to react with all the CO.',
        questionContext: 'First find moles of CO, then use the stoichiometric ratio to find moles of H₂ needed.',
        question: {
          text: 'How many grams of H₂ are needed to react completely with 280 g of CO? (CO + 2H₂ → CH₃OH)',
          options: ['40 g', '20 g', '4 g', '80 g'],
          correctIndex: 0,
          explanation:
            'Moles of CO = 280/28 = 10 mol. From the balanced equation, 1 mol CO requires 2 mol H₂. So you need 2 × 10 = 20 mol H₂. Mass of H₂ = 20 × 2 = 40 g (molar mass of H₂ = 2 g/mol). The stoichiometric ratio from the balanced equation is the key — it tells you the exact mole ratio of reactants.',
        },
        reveal:
          'Exactly 40 g of hydrogen gas are loaded into the reactor alongside the CO. The 1:2 mole ratio from the balanced equation ensures nothing is wasted. The synthesis chamber hums to life.',
      },
      {
        title: 'The Limiting Reagent',
        story:
          'A second batch uses a different fuel reaction: **N₂ + 3H₂ → 2NH₃** (ammonia as backup fuel). You have **56 g of N₂** and **9 g of H₂**. One of these will run out first, limiting how much ammonia you can produce.',
        question: {
          text: 'In the reaction N₂ + 3H₂ → 2NH₃, with 56 g N₂ and 9 g H₂, which is the limiting reagent?',
          options: [
            'H₂ is limiting; 51 g NH₃ is the maximum yield',
            'N₂ is limiting; 68 g NH₃ is the maximum yield',
            'Neither — they are in exact stoichiometric ratio',
            'H₂ is limiting; 34 g NH₃ is the maximum yield',
          ],
          correctIndex: 0,
          explanation:
            'Moles of N₂ = 56/28 = 2 mol. Moles of H₂ = 9/2 = 4.5 mol. The reaction needs 3 mol H₂ per 1 mol N₂. For 2 mol N₂, you would need 6 mol H₂ — but only 4.5 mol is available. H₂ runs out first, so H₂ is the limiting reagent. NH₃ produced from H₂: 4.5 mol H₂ × (2 mol NH₃ / 3 mol H₂) = 3 mol NH₃ = 3 × 17 = 51 g. Excess N₂ = 2 − 1.5 = 0.5 mol remains unreacted.',
        },
        reveal:
          'Hydrogen is the limiting reagent — it runs out first, capping the ammonia production at 51 g (3 mol). Half a mole of nitrogen sits unreacted. The limiting reagent always determines the maximum yield, regardless of how much excess reagent is available.',
      },
      {
        title: 'Percent Yield',
        story:
          'The final synthesis run produces **51 g of NH₃** from the reaction. Based on the reactants loaded, the **theoretical yield** should have been **68 g**. Quality control needs the percent yield before approving the fuel for use.',
        question: {
          text: 'If the theoretical yield is 68 g NH₃ and the actual yield is 51 g, what is the percent yield?',
          options: ['75%', '133%', '50%', '25%'],
          correctIndex: 0,
          explanation:
            'Percent yield = (actual yield / theoretical yield) × 100 = (51/68) × 100 = 75%. The percent yield is always ≤ 100% in practice because some product is lost to side reactions, incomplete reactions, or transfer losses. A yield of 75% is quite good for industrial synthesis.',
        },
        reveal:
          'A 75% yield is approved — well within acceptable parameters for space-based synthesis. The refinery logs the efficiency and stores the excess reactants. Your fuel tanks are full, and the ship is ready to continue its journey through the Mole Nebula.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Quantitative Analysis Quest
  // =======================================================================
  {
    id: 'quantitative-analysis',
    name: 'Quantitative Analysis Quest',
    constellationId: 'mole-nebula',
    order: 2,
    xp: 170,
    intro:
      'The Nebula\'s deep-scan probes have detected an unknown compound on a nearby asteroid. Your mission: travel to the asteroid, collect samples, and use **quantitative chemical analysis** to determine the compound\'s identity. You will calculate empirical formulas, molecular formulas, and percent composition — the detective tools of chemistry.',
    loreReward:
      'The unknown compound is identified and catalogued. It turns out to be a new crystalline form of a known substance, stable only in the low-gravity environment of the asteroid. Your quantitative analysis is recorded in the **Nebula Compound Registry**, expanding the known chemistry of the Mole Nebula.',
    titleReward: 'Compound Detective',
    badgeReward: 'quantitative-analyst',
    parts: [
      {
        title: 'Percent Composition',
        story:
          'Your first task is to determine the percent composition of **glucose (C₆H₁₂O₆)**. The molecular analysis chamber needs this data to calibrate its detectors before analyzing the unknown sample.',
        questionContext: 'Molar mass of glucose: 6(12) + 12(1) + 6(16) = 72 + 12 + 96 = 180 g/mol.',
        question: {
          text: 'What is the percent composition of carbon in glucose (C₆H₁₂O₆)?',
          options: ['40%', '33.3%', '50%', '6.67%'],
          correctIndex: 0,
          explanation:
            'Molar mass of C₆H₁₂O₆ = 6(12) + 12(1) + 6(16) = 72 + 12 + 96 = 180 g/mol. Mass of carbon = 6 × 12 = 72 g/mol. Percent C = (72/180) × 100 = 40%. Similarly: %H = (12/180) × 100 = 6.67%, %O = (96/180) × 100 = 53.33%. These must add up to 100%.',
        },
        reveal:
          'The chamber calibrates: 40% carbon, 6.67% hydrogen, 53.33% oxygen. These percentages are the chemical fingerprint of glucose. Now the chamber can identify glucose in any sample by matching this composition.',
      },
      {
        title: 'Empirical Formula from Composition',
        story:
          'The unknown asteroid compound is analyzed: it contains **40% carbon, 6.7% hydrogen, and 53.3% oxygen** by mass. To identify it, you first need to determine its empirical formula — the simplest whole-number ratio of atoms.',
        questionContext: 'Assume 100 g of sample. Convert mass percentages to grams, then to moles, then find the simplest ratio.',
        question: {
          text: 'A compound has 40% C, 6.7% H, and 53.3% O. What is its empirical formula?',
          options: ['CH₂O', 'C₂H₄O₂', 'CHO', 'C₂H₆O'],
          correctIndex: 0,
          explanation:
            'In 100 g: 40 g C, 6.7 g H, 53.3 g O. Moles: C = 40/12 = 3.33, H = 6.7/1 = 6.7, O = 53.3/16 = 3.33. Dividing by the smallest (3.33): C = 1, H = 2.01 ≈ 2, O = 1. Empirical formula = CH₂O. This is the simplest ratio. The actual molecular formula could be CH₂O, C₂H₄O₂, C₃H₆O₃, etc. — any multiple of CH₂O.',
        },
        reveal:
          'The empirical formula CH₂O is established. Interestingly, this is the same empirical formula as glucose (C₆H₁₂O₆), formaldehyde (CH₂O), and acetic acid (C₂H₄O₂). To distinguish between them, you need the molecular mass.',
      },
      {
        title: 'Molecular Formula',
        story:
          'Mass spectrometry reveals the unknown compound has a **molar mass of 180 g/mol**. Combined with the empirical formula CH₂O, you can now determine the true molecular formula.',
        question: {
          text: 'The empirical formula is CH₂O (empirical mass = 30 g/mol) and the molar mass is 180 g/mol. What is the molecular formula?',
          options: ['C₆H₁₂O₆', 'C₃H₆O₃', 'C₂H₄O₂', 'C₄H₈O₄'],
          correctIndex: 0,
          explanation:
            'The multiplication factor n = molar mass / empirical mass = 180/30 = 6. Molecular formula = 6 × (CH₂O) = C₆H₁₂O₆. This is glucose! The empirical formula gives only the ratio; the molecular formula gives the actual number of atoms. You always need the molar mass (from mass spectrometry or other methods) to find the molecular formula.',
        },
        reveal:
          'C₆H₁₂O₆ — glucose! The asteroid contains crystalline glucose, likely deposited by organic material from cometary impacts. This is a remarkable find — evidence of organic chemistry in deep space. The compound is catalogued.',
      },
      {
        title: 'Balancing the Combustion',
        story:
          'To confirm the identification, you burn a sample of the compound in pure oxygen and analyze the products. The combustion of glucose follows: **C₆H₁₂O₆ + O₂ → CO₂ + H₂O** (unbalanced). You must balance this equation.',
        question: {
          text: 'What is the balanced equation for the combustion of glucose?',
          options: [
            'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O',
            'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 12H₂O',
            'C₆H₁₂O₆ + 12O₂ → 6CO₂ + 6H₂O',
            'C₆H₁₂O₆ + 3O₂ → 6CO₂ + 6H₂O',
          ],
          correctIndex: 0,
          explanation:
            'Balance C: 6 carbons → 6CO₂. Balance H: 12 hydrogens → 6H₂O. Balance O: Left side has 6 (from glucose) + 2x (from O₂). Right side has 12 (from CO₂) + 6 (from H₂O) = 18. So 6 + 2x = 18, x = 6. Balanced: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. Check: C: 6 = 6, H: 12 = 12, O: 6 + 12 = 18 = 12 + 6. Balanced!',
        },
        reveal:
          'The combustion products match perfectly: 6 moles of CO₂ and 6 moles of H₂O for every mole of glucose burned. This confirms the molecular formula beyond any doubt. The unknown compound is definitively identified as glucose.',
      },
    ],
  },
]
