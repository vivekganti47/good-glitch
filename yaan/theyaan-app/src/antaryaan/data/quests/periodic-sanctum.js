// ---------------------------------------------------------------------------
// Periodic Sanctum — Side Quests (Periodic Table & Electron Configuration)
// Topics: electron configuration, periodic trends, ionization energy,
//         electronegativity, atomic/ionic radius
// ---------------------------------------------------------------------------

export const periodicSanctumQuests = [
  // =======================================================================
  // QUEST 1 — The Element Identification Lab
  // =======================================================================
  {
    id: 'element-identification-lab',
    name: 'The Element Identification Lab',
    constellationId: 'periodic-sanctum',
    order: 1,
    xp: 150,
    intro:
      'You have been assigned to the **Sanctum Identification Wing**, an ancient laboratory where unknown elements are catalogued. Strange mineral samples have been recovered from a derelict alien vessel, and each must be identified by its electron configuration, quantum numbers, and chemical properties. The Sanctum\'s archive is incomplete — your analysis will fill in the missing entries.',
    loreReward:
      'All five unknown samples are now catalogued in the Sanctum Archive. The alien minerals turn out to be isotopes of familiar elements, but arranged in allotropes never seen before. Your electron configuration analysis has opened a new chapter in the Periodic Sanctum\'s records.',
    titleReward: 'Element Archivist',
    badgeReward: 'sanctum-identifier',
    parts: [
      {
        title: 'Sample Alpha — Quantum Numbers',
        story:
          'The first sample emits a characteristic spectrum. The Sanctum\'s spectrometer identifies an electron with quantum numbers **n = 3, l = 2, ml = −1, ms = +½**. You must determine which subshell this electron belongs to.',
        question: {
          text: 'An electron has quantum numbers n = 3, l = 2. Which subshell does it occupy?',
          options: ['3d', '3p', '3s', '3f'],
          correctIndex: 0,
          explanation:
            'The azimuthal quantum number l determines the subshell: l = 0 → s, l = 1 → p, l = 2 → d, l = 3 → f. With n = 3 and l = 2, the electron is in the 3d subshell. Note that l can range from 0 to (n−1), so for n = 3, l can be 0, 1, or 2 — making 3d the highest subshell in the third shell.',
        },
        reveal:
          'The electron is in the 3d subshell — this narrows the element down to a transition metal. The spectrometer begins scanning for more details as you move to the next analysis.',
      },
      {
        title: 'Sample Beta — Electron Configuration',
        story:
          'Sample Beta has atomic number **26**. The Sanctum\'s database asks you to provide the complete electron configuration. This element is crucial for the alien vessel\'s hull — it appears to be a magnetic metal.',
        question: {
          text: 'What is the electron configuration of the element with atomic number 26?',
          options: [
            '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s² (Iron)',
            '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸ (Iron)',
            '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 4p⁶ (Krypton)',
            '1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ (Zinc)',
          ],
          correctIndex: 0,
          explanation:
            'Z = 26 is Iron (Fe). Following the Aufbau principle: 1s²(2) 2s²(4) 2p⁶(10) 3s²(12) 3p⁶(18) 4s²(20) 3d⁶(26). Note that 4s fills before 3d due to the (n+l) rule, but 3d is written before 4s in the configuration by convention of principal quantum number ordering. Iron\'s [Ar] 3d⁶ 4s² configuration makes it a d-block transition metal.',
        },
        reveal:
          'Iron! The alien vessel was built with iron alloys, just like our own ships. The universe favors the same elements everywhere. Fe has 4 unpaired electrons in its 3d orbitals, explaining its magnetic properties.',
      },
      {
        title: 'Sample Gamma — The Anomaly',
        story:
          'Sample Gamma has an unexpected electron configuration. The Sanctum\'s analyzer shows the element has atomic number **29**. Standard Aufbau filling would predict [Ar] 3d⁹ 4s², but the actual configuration is different. This anomaly is well-known among Sanctum archivists.',
        question: {
          text: 'What is the actual electron configuration of element Z = 29 (Copper)?',
          options: [
            '[Ar] 3d¹⁰ 4s¹',
            '[Ar] 3d⁹ 4s²',
            '[Ar] 3d¹⁰ 4s²',
            '[Ar] 3d⁸ 4s²',
          ],
          correctIndex: 0,
          explanation:
            'Copper (Z = 29) is an anomalous configuration. Instead of the expected [Ar] 3d⁹ 4s², copper adopts [Ar] 3d¹⁰ 4s¹ because a completely filled d-subshell (d¹⁰) provides extra stability. Similarly, Chromium (Z = 24) is [Ar] 3d⁵ 4s¹ instead of [Ar] 3d⁴ 4s² because a half-filled d-subshell (d⁵) is also extra stable. These are the two most important exceptions to remember.',
        },
        reveal:
          'The anomaly is confirmed — Copper prefers a fully filled 3d¹⁰ configuration over the "expected" 3d⁹ 4s². Nature optimizes for stability, not for rigid rule-following. This principle applies to Cr and Cu in the first transition series.',
      },
      {
        title: 'Sample Delta — Isoelectronic Species',
        story:
          'Sample Delta appears to be an ion, not a neutral atom. The analyzer detects **10 electrons** in the sample. Multiple species can have 10 electrons — you need to identify which one based on additional data: the nuclear charge is **+11**.',
        question: {
          text: 'A species has 10 electrons and a nuclear charge of +11. What is it?',
          options: ['Na⁺', 'Ne', 'F⁻', 'O²⁻'],
          correctIndex: 0,
          explanation:
            'Nuclear charge of +11 means 11 protons, which is Sodium (Na). With 10 electrons, it has lost one electron: Na⁺. All of the options (Na⁺, Ne, F⁻, O²⁻) are isoelectronic — they all have 10 electrons. But only Na⁺ has 11 protons. Isoelectronic species have the same electron count but different nuclear charges.',
        },
        reveal:
          'Na⁺ is confirmed. The sample is a sodium ion — likely from the alien vessel\'s cooling salt solutions. The isoelectronic series Ne, Na⁺, Mg²⁺, F⁻, O²⁻ all share the stable 10-electron configuration of neon.',
      },
      {
        title: 'Sample Epsilon — Valence Electrons',
        story:
          'The final sample has the electron configuration **[Ne] 3s² 3p³**. The Sanctum needs to know its group, period, and number of valence electrons to complete the catalogue entry.',
        question: {
          text: 'An element has configuration [Ne] 3s² 3p³. How many valence electrons does it have, and which group/period is it in?',
          options: [
            '5 valence electrons; Group 15, Period 3 (Phosphorus)',
            '3 valence electrons; Group 13, Period 3 (Aluminium)',
            '5 valence electrons; Group 5, Period 3',
            '2 valence electrons; Group 2, Period 3 (Magnesium)',
          ],
          correctIndex: 0,
          explanation:
            'The configuration [Ne] 3s² 3p³ means the outermost shell is n = 3 (Period 3) with 2 + 3 = 5 valence electrons. For main group elements, the group number equals 10 + number of valence electrons for p-block, giving Group 15. This is Phosphorus (P, Z = 15). Valence electrons are those in the outermost shell and determine the element\'s chemical behavior.',
        },
        reveal:
          'Phosphorus — an essential element for life! Its five valence electrons allow it to form compounds like phosphates, which store energy in biological systems (ATP). The Sanctum Archive is now complete. All five samples are catalogued, and the alien vessel\'s composition is fully mapped.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Trend Mapping Mission
  // =======================================================================
  {
    id: 'trend-mapping-mission',
    name: 'Trend Mapping Mission',
    constellationId: 'periodic-sanctum',
    order: 2,
    xp: 160,
    intro:
      'The Sanctum\'s **Trend Map** — a holographic display showing how elemental properties change across the periodic table — has been corrupted by a power surge. As the newly appointed **Trend Cartographer**, you must restore the map by answering questions about atomic radius, ionization energy, electron affinity, and electronegativity. Each correct answer restores one section of the map.',
    loreReward:
      'The Trend Map is fully restored, glowing with color-coded gradients that show every periodic trend at a glance. The Sanctum Council awards you the title of Trend Cartographer and adds your restoration notes to the permanent archive. Future visitors will learn from the map you rebuilt.',
    titleReward: 'Trend Cartographer',
    badgeReward: 'trend-mapper',
    parts: [
      {
        title: 'Restoring the Radius Map',
        story:
          'The first corrupted section shows atomic radii. You need to arrange a set of elements in order of increasing atomic radius to restore this part of the map. The elements are: **Na, Mg, K, Ca**.',
        question: {
          text: 'Arrange Na, Mg, K, Ca in order of INCREASING atomic radius.',
          options: [
            'Mg < Na < Ca < K',
            'K < Ca < Na < Mg',
            'Na < Mg < Ca < K',
            'Ca < K < Mg < Na',
          ],
          correctIndex: 0,
          explanation:
            'Atomic radius decreases across a period (left to right) due to increasing nuclear charge pulling electrons closer. It increases down a group due to addition of new shells. Mg (Period 3, Group 2) < Na (Period 3, Group 1) because Na is further left. Ca (Period 4, Group 2) < K (Period 4, Group 1) for the same reason. Period 4 elements are larger than Period 3, so the order is Mg < Na < Ca < K.',
        },
        reveal:
          'The radius section of the Trend Map restores beautifully, showing atoms growing larger as you move down and to the left of the table. The gradient glows from blue (small) to red (large), and the pattern is unmistakable.',
      },
      {
        title: 'Ionization Energy Gradient',
        story:
          'The ionization energy section is next. The Sanctum asks you to identify which element in a set has the **highest first ionization energy**. The candidates are: **Li, Be, B, N, O**.',
        question: {
          text: 'Among Li, Be, B, N, and O, which has the highest first ionization energy?',
          options: ['N', 'O', 'Be', 'Li'],
          correctIndex: 0,
          explanation:
            'Generally, IE increases across a period. However, there are two exceptions in Period 2: (1) Be > B because B loses a 2p electron (easier to remove than 2s), and (2) N > O because N has a half-filled 2p³ configuration (extra stable), while O has one paired electron in 2p⁴ that experiences repulsion and is easier to remove. So the order is approximately Li < B < Be < O < N, making Nitrogen the highest.',
        },
        reveal:
          'Nitrogen\'s half-filled 2p³ configuration gives it exceptional stability. The ionization energy section lights up, revealing the zigzag pattern that trips up many students — it is not a perfectly smooth increase across a period. The exceptions at B and O are now clearly marked on the map.',
      },
      {
        title: 'The Electronegativity Scale',
        story:
          'The electronegativity section needs recalibration. You must identify the correct trend. The map shows elements from the halogen group: **F, Cl, Br, I**.',
        question: {
          text: 'Arrange the halogens F, Cl, Br, I in order of DECREASING electronegativity.',
          options: [
            'F > Cl > Br > I',
            'I > Br > Cl > F',
            'Cl > F > Br > I',
            'F > Br > Cl > I',
          ],
          correctIndex: 0,
          explanation:
            'Electronegativity decreases down a group because atomic radius increases, weakening the nucleus\'s ability to attract bonding electrons. Fluorine (EN ≈ 4.0) is the most electronegative element in the entire periodic table. Down Group 17: F (4.0) > Cl (3.0) > Br (2.8) > I (2.5) on the Pauling scale.',
        },
        reveal:
          'The electronegativity gradient cascades across the map — highest at the top-right corner (Fluorine) and lowest at the bottom-left (Francium/Caesium). The pattern mirrors ionization energy, which makes sense: atoms that hold their own electrons tightly also attract shared electrons strongly.',
      },
      {
        title: 'Ionic Radius Puzzle',
        story:
          'The final section involves ionic radii — how the size of an atom changes when it gains or loses electrons. The map asks you to compare: **Na⁺ vs Na** and **Cl⁻ vs Cl**.',
        question: {
          text: 'Which statement about ionic radii is correct?',
          options: [
            'Na⁺ is smaller than Na; Cl⁻ is larger than Cl',
            'Na⁺ is larger than Na; Cl⁻ is smaller than Cl',
            'Both Na⁺ and Cl⁻ are smaller than their neutral atoms',
            'Both Na⁺ and Cl⁻ are larger than their neutral atoms',
          ],
          correctIndex: 0,
          explanation:
            'When an atom loses an electron (forming a cation), the remaining electrons are pulled closer by the same nuclear charge, and often an entire shell is lost. Na → Na⁺ loses its only 3s electron, going from [Ne]3s¹ to [Ne], shrinking dramatically. When an atom gains an electron (forming an anion), the extra electron increases electron-electron repulsion. Cl → Cl⁻ adds one electron, going from [Ne]3s²3p⁵ to [Ne]3s²3p⁶, becoming larger. Cations are always smaller than their parent atoms; anions are always larger.',
        },
        reveal:
          'The ionic radius section snaps into place — cations shrink inward while anions expand outward. The Trend Map is now fully restored, a magnificent holographic display of all major periodic trends. The Sanctum Council is impressed: your cartography is precise and your understanding of the underlying electronic reasons is thorough.',
      },
    ],
  },
]
