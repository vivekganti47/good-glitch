// ---------------------------------------------------------------------------
// Bond Matrix — Side Quests (Chemical Bonding)
// Topics: Lewis structures, VSEPR theory, hybridization, molecular geometry,
//         intermolecular forces
// ---------------------------------------------------------------------------

export const bondMatrixQuests = [
  // =======================================================================
  // QUEST 1 — The Molecular Architect
  // =======================================================================
  {
    id: 'molecular-architect',
    name: 'The Molecular Architect',
    constellationId: 'bond-matrix',
    order: 1,
    xp: 170,
    intro:
      'Welcome to the **Molecular Forge**, a vast construction yard in the Bond Matrix where molecules are assembled atom by atom. As the newly appointed **Molecular Architect**, you must design stable molecules by drawing Lewis structures, predicting their 3D shapes using VSEPR theory, and assigning the correct hybridization to each central atom. Each molecule you build correctly activates a new section of the Forge.',
    loreReward:
      'The Molecular Forge hums with activity — five new molecules have been designed, built, and stored in the crystalline vaults. Your architectural blueprints (Lewis structures and VSEPR models) are preserved as reference templates in the Bond Matrix archives. The Forge can now produce these molecules on demand.',
    titleReward: 'Molecular Architect',
    badgeReward: 'forge-architect',
    parts: [
      {
        title: 'Blueprint 1 — Water',
        story:
          'Your first assignment is the simplest but most important molecule in the universe: **water (H₂O)**. The Forge needs you to determine its molecular geometry. Oxygen has 6 valence electrons, each hydrogen has 1. There are 2 bond pairs and 2 lone pairs around oxygen.',
        question: {
          text: 'What is the molecular geometry of water (H₂O)?',
          options: [
            'Bent (V-shaped), approximately 104.5°',
            'Linear, 180°',
            'Tetrahedral, 109.5°',
            'Trigonal planar, 120°',
          ],
          correctIndex: 0,
          explanation:
            'Oxygen in H₂O has 4 electron pairs: 2 bonding + 2 lone pairs. The electron geometry is tetrahedral (from VSEPR for 4 pairs), but the MOLECULAR geometry considers only the atoms. With 2 lone pairs pushing the bonds closer together, the shape is bent with a bond angle of about 104.5° (less than the ideal 109.5° due to lone pair-bond pair repulsion being greater than bond pair-bond pair repulsion).',
        },
        reveal:
          'The Forge assembles H₂O — a beautifully bent molecule. Those two lone pairs on oxygen are invisible to the eye but critically important. They compress the H-O-H angle from 109.5° to 104.5° and give water many of its remarkable properties, including its exceptional ability as a solvent.',
      },
      {
        title: 'Blueprint 2 — Boron Trifluoride',
        story:
          'Next, the Forge challenges you with **BF₃** (boron trifluoride). Boron has only 3 valence electrons and forms 3 bonds with fluorine. Notably, BF₃ has **no lone pairs on boron**. This gives it a geometry that many molecules aspire to but few achieve.',
        question: {
          text: 'What is the hybridization of boron in BF₃ and its molecular geometry?',
          options: [
            'sp² hybridization, trigonal planar',
            'sp³ hybridization, tetrahedral',
            'sp hybridization, linear',
            'sp³d hybridization, trigonal bipyramidal',
          ],
          correctIndex: 0,
          explanation:
            'Boron in BF₃ has 3 bond pairs and 0 lone pairs = 3 electron domains. This requires 3 hybrid orbitals → sp² hybridization. The molecular geometry is trigonal planar with 120° bond angles. BF₃ is an electron-deficient molecule (boron has only 6 electrons in its valence shell, not 8), making it a strong Lewis acid — it readily accepts an electron pair from a donor.',
        },
        reveal:
          'BF₃ materializes as a flat, symmetrical triangle. The empty p-orbital on boron stands perpendicular to the molecular plane, hungry for electrons. This makes BF₃ one of the strongest Lewis acids — it will bond eagerly with any molecule that can donate an electron pair.',
      },
      {
        title: 'Blueprint 3 — Methane to Ammonia',
        story:
          'The Forge presents two molecules side by side: **CH₄** (methane) and **NH₃** (ammonia). Both have the same electron geometry around the central atom, but their molecular geometries differ. You must explain why.',
        question: {
          text: 'CH₄ is tetrahedral (109.5°). NH₃ has the same electron geometry but a different molecular geometry. What is NH₃\'s molecular shape?',
          options: [
            'Trigonal pyramidal, approximately 107°',
            'Trigonal planar, 120°',
            'Tetrahedral, 109.5°',
            'Bent, 104.5°',
          ],
          correctIndex: 0,
          explanation:
            'NH₃ has 3 bond pairs + 1 lone pair = 4 electron domains → tetrahedral electron geometry (same as CH₄). However, the molecular geometry counts only atoms, not lone pairs. With 3 bonding pairs arranged around nitrogen, the shape is trigonal pyramidal. The lone pair compresses the bond angle from 109.5° to about 107°. The hierarchy of repulsion is: lone pair-lone pair > lone pair-bond pair > bond pair-bond pair.',
        },
        reveal:
          'The two molecules rotate side by side in the Forge\'s display. CH₄ is a perfect tetrahedron; NH₃ is a slightly squashed pyramid with the lone pair occupying the fourth corner. The lone pair is invisible but its influence on the geometry is profound.',
      },
      {
        title: 'Blueprint 4 — Sulfur Hexafluoride',
        story:
          'The Forge upgrades to hypervalent molecules. **SF₆** (sulfur hexafluoride) has 6 fluorine atoms bonded to a central sulfur. Sulfur uses d-orbitals to expand its octet. This molecule is used as an insulating gas in high-voltage equipment.',
        question: {
          text: 'What is the hybridization and molecular geometry of SF₆?',
          options: [
            'sp³d² hybridization, octahedral',
            'sp³d hybridization, trigonal bipyramidal',
            'sp³ hybridization, tetrahedral',
            'd²sp³ hybridization, square planar',
          ],
          correctIndex: 0,
          explanation:
            'SF₆ has 6 bond pairs and 0 lone pairs around sulfur = 6 electron domains. This requires 6 hybrid orbitals → sp³d² hybridization (one s + three p + two d orbitals). The molecular geometry is octahedral with 90° bond angles. Sulfur can expand its octet because it has accessible d-orbitals in the third shell. Elements in Period 3 and beyond can do this; Period 2 elements (like carbon, nitrogen, oxygen) cannot.',
        },
        reveal:
          'SF₆ assembles into a perfect octahedron — six fluorines at equal distances, 90° apart, surrounding the central sulfur. It is remarkably stable and non-toxic despite containing six highly reactive fluorine atoms. The symmetry of the octahedral geometry distributes electron density so evenly that the molecule is practically inert.',
      },
      {
        title: 'Blueprint 5 — Polarity Check',
        story:
          'The final challenge: the Forge needs you to determine which molecule is **polar** and which is **nonpolar**. Two molecules are presented: **CO₂** and **SO₂**. Both have two oxygen atoms bonded to a central atom, but their polarities are different.',
        question: {
          text: 'Which statement about CO₂ and SO₂ polarity is correct?',
          options: [
            'CO₂ is nonpolar (linear, dipoles cancel); SO₂ is polar (bent, dipoles do not cancel)',
            'Both are nonpolar because they contain symmetrical bonds',
            'Both are polar because C-O and S-O bonds are polar',
            'CO₂ is polar; SO₂ is nonpolar',
          ],
          correctIndex: 0,
          explanation:
            'CO₂ is linear (sp hybridized, no lone pairs on C, 180°). The two C=O bond dipoles point in exactly opposite directions and cancel out → nonpolar molecule. SO₂ is bent (sp² hybridized, one lone pair on S, ~119°). The two S=O dipoles do NOT cancel because of the bent geometry → polar molecule. A molecule is nonpolar only if the vector sum of all bond dipoles is zero. Geometry determines polarity, not just bond polarity.',
        },
        reveal:
          'The Forge\'s polarity scanner confirms: CO₂ shows zero net dipole (the arrows cancel perfectly in a line), while SO₂ shows a significant dipole moment pointing along the angle bisector. Same types of atoms, different geometries, opposite polarity outcomes. The Molecular Forge is complete — your architectural skills are certified.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Bond Breaking Challenge
  // =======================================================================
  {
    id: 'bond-breaking-challenge',
    name: 'Bond Breaking Challenge',
    constellationId: 'bond-matrix',
    order: 2,
    xp: 160,
    intro:
      'A section of the **Bond Matrix** has become unstable — molecular bonds are forming and breaking unpredictably. As a **Bond Engineer**, you must diagnose each unstable molecule by identifying the types of bonds, their relative strengths, and the intermolecular forces holding matter together. Stabilize the matrix before it collapses!',
    loreReward:
      'The Bond Matrix is stabilized. Your analysis revealed that the instability was caused by resonance structures competing for dominance in a crystalline lattice. By correctly identifying bond orders and intermolecular forces, you resolved the conflict. The **Matrix Stability Protocols** are now logged in the archive.',
    titleReward: 'Bond Engineer',
    badgeReward: 'matrix-stabilizer',
    parts: [
      {
        title: 'Sigma and Pi Bonds',
        story:
          'The first unstable region involves a triple bond. The Matrix asks you to analyze the bonding in **N₂** (molecular nitrogen). This molecule has one of the strongest bonds in nature — a triple bond between two nitrogen atoms.',
        question: {
          text: 'How many sigma (σ) and pi (π) bonds are in the N≡N triple bond?',
          options: [
            '1 sigma and 2 pi bonds',
            '3 sigma bonds',
            '2 sigma and 1 pi bond',
            '3 pi bonds',
          ],
          correctIndex: 0,
          explanation:
            'A triple bond consists of 1 σ (sigma) bond + 2 π (pi) bonds. The sigma bond is formed by head-on overlap of hybrid orbitals along the bond axis. The two pi bonds are formed by lateral overlap of unhybridized p-orbitals above and below (and in front of and behind) the bond axis. In general: single bond = 1σ, double bond = 1σ + 1π, triple bond = 1σ + 2π.',
        },
        reveal:
          'The triple bond stabilizes — 1 sigma + 2 pi, locked in perfect overlap. The N≡N bond energy is a massive 945 kJ/mol, which is why nitrogen gas is so unreactive. Breaking this bond requires enormous energy, which is why nitrogen fixation is one of the most important chemical processes on Earth.',
      },
      {
        title: 'Ionic vs Covalent Character',
        story:
          'The next region shows a bond between **sodium and chlorine** that is fluctuating between ionic and covalent character. The Matrix needs you to identify what determines the nature of a bond between two atoms.',
        question: {
          text: 'What primarily determines whether a bond is ionic or covalent?',
          options: [
            'The electronegativity difference between the two atoms',
            'The atomic number of the atoms',
            'The number of valence electrons',
            'The atomic radius of the atoms',
          ],
          correctIndex: 0,
          explanation:
            'The electronegativity difference (ΔEN) between two bonded atoms determines bond character. ΔEN > 1.7 generally indicates an ionic bond (electron transfer), ΔEN between 0.4 and 1.7 indicates a polar covalent bond (unequal sharing), and ΔEN < 0.4 indicates a nonpolar covalent bond (equal sharing). For NaCl: ΔEN = 3.0 − 0.9 = 2.1 → ionic. Note: these are guidelines, not rigid rules. Fajans\' rules provide additional criteria based on charge and size.',
        },
        reveal:
          'The NaCl bond settles into its ionic character — the electronegativity gap of 2.1 means chlorine pulls the electron away from sodium almost completely. The Matrix marks this region as stable: ionic bonds form crystal lattices, not discrete molecules.',
      },
      {
        title: 'Resonance Structures',
        story:
          'A critical instability: the **carbonate ion (CO₃²⁻)** is oscillating between three possible Lewis structures. Each structure shows a double bond to a different oxygen. The Matrix cannot decide which structure is "real" and is destabilizing.',
        question: {
          text: 'What is the actual C-O bond order in the carbonate ion CO₃²⁻?',
          options: [
            '4/3 (between single and double)',
            '2 (all double bonds)',
            '1 (all single bonds)',
            '3 (triple bond to one oxygen)',
          ],
          correctIndex: 0,
          explanation:
            'CO₃²⁻ has 3 resonance structures, each with one C=O double bond and two C-O single bonds. The real structure is a resonance hybrid — an average of all three. Total bond order = (1 double + 2 singles) / 3 bonds = (2 + 1 + 1) / 3 = 4/3 ≈ 1.33. All three C-O bonds are identical and equivalent in reality, with a bond order between 1 and 2. This is why resonance stabilization makes CO₃²⁻ especially stable.',
        },
        reveal:
          'The Matrix stabilizes as the three resonance structures merge into a single hybrid. The electron density is distributed evenly across all three C-O bonds, each with a bond order of 4/3. Resonance is not about bonds "switching" — the electrons are delocalized simultaneously across all positions.',
      },
      {
        title: 'Hydrogen Bonding',
        story:
          'The intermolecular force detector in the Matrix flags an anomaly: **HF has a much higher boiling point than HCl**, despite HCl having a higher molecular mass. The Matrix asks you to identify the dominant intermolecular force responsible.',
        question: {
          text: 'Why does HF (bp: 19.5°C) have a higher boiling point than HCl (bp: −85°C)?',
          options: [
            'HF forms strong hydrogen bonds; HCl has only dipole-dipole interactions',
            'HF has a higher molecular mass',
            'HF has stronger London dispersion forces',
            'HF has ionic bonds while HCl has covalent bonds',
          ],
          correctIndex: 0,
          explanation:
            'HF can form hydrogen bonds because fluorine is highly electronegative (EN = 4.0), small, and has lone pairs. Hydrogen bonding is a special, strong type of dipole-dipole interaction that occurs when H is bonded to F, O, or N. HCl has only regular dipole-dipole interactions because chlorine, despite being electronegative, is too large for effective hydrogen bonding. Hydrogen bonds in HF are roughly 5-10 times stronger than the dipole-dipole forces in HCl.',
        },
        reveal:
          'The intermolecular force map updates: HF molecules are linked by strong hydrogen bonds (shown as dashed lines), while HCl molecules interact through weaker dipole-dipole forces. The rule of three — F, O, N — marks the electronegative atoms that enable hydrogen bonding.',
      },
      {
        title: 'London Dispersion Forces',
        story:
          'The final unstable region involves noble gases. **Helium has a boiling point of −269°C** while **Xenon boils at −108°C**. Both are nonpolar monatomic gases with no permanent dipoles. Yet Xenon\'s boiling point is 161°C higher. The Matrix demands an explanation.',
        question: {
          text: 'Why does Xenon (nonpolar) have a much higher boiling point than Helium (also nonpolar)?',
          options: [
            'Xenon has stronger London dispersion forces due to its larger electron cloud and higher polarizability',
            'Xenon forms hydrogen bonds',
            'Xenon has a permanent dipole moment',
            'Xenon has metallic bonding',
          ],
          correctIndex: 0,
          explanation:
            'London dispersion forces (LDF) arise from temporary dipoles caused by fluctuations in electron distribution. Larger atoms like Xenon (54 electrons) have bigger, more polarizable electron clouds, leading to stronger temporary dipoles and therefore stronger LDF. Helium (2 electrons) has a tiny, tightly held electron cloud with very weak LDF. LDF are the only intermolecular forces available to nonpolar species and noble gases. They increase with molecular size, surface area, and number of electrons.',
        },
        reveal:
          'The Matrix stabilizes completely. Even "inert" noble gases attract each other through London dispersion forces — the universal intermolecular force. Larger electron clouds mean stronger attractions. This is why noble gases at the bottom of Group 18 are easier to liquefy than those at the top. The Bond Matrix is secure once more.',
      },
    ],
  },
]
