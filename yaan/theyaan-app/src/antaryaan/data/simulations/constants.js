// ===========================================================================
// Shared Scientific Constants for antarYaan Simulations
// ===========================================================================
// This file is the single source of truth for all scientific data used across
// the 27 interactive games. Values follow JEE / NEET conventions where
// applicable (e.g. g = 10 m/s^2).
// ===========================================================================

// ---------------------------------------------------------------------------
// Physics Constants
// ---------------------------------------------------------------------------

/** Acceleration due to gravity (m/s^2) - JEE/NEET convention */
export const GRAVITY = 10

/** Universal gravitational constant (N m^2 / kg^2) */
export const G_CONSTANT = 6.67e-11

/** Speed of light in vacuum (m/s) */
export const SPEED_OF_LIGHT = 3e8

/** Boltzmann constant (J/K) */
export const BOLTZMANN = 1.38e-23

/** Planck constant (J s) */
export const PLANCK = 6.626e-34

/** Elementary charge (C) */
export const ELEMENTARY_CHARGE = 1.6e-19

/** Coulomb constant (N m^2 / C^2) */
export const COULOMB_CONSTANT = 9e9

/** Universal gas constant (J / mol K) */
export const GAS_CONSTANT = 8.314

/** Standard atmospheric pressure (Pa) */
export const STANDARD_PRESSURE = 1.013e5

// ---------------------------------------------------------------------------
// Chemistry Constants
// ---------------------------------------------------------------------------

/** Avogadro's number (mol^-1) */
export const AVOGADRO = 6.022e23

/** Faraday constant (C/mol) */
export const FARADAY = 96485

/** Rydberg constant (m^-1) */
export const RYDBERG = 1.097e7

// ---------------------------------------------------------------------------
// Pauling Electronegativity (dimensionless)
// ---------------------------------------------------------------------------

export const PAULING_EN = {
  H: 2.20,
  He: 0,
  Li: 0.98,
  Be: 1.57,
  B: 2.04,
  C: 2.55,
  N: 3.04,
  O: 3.44,
  F: 3.98,
  Ne: 0,
  Na: 0.93,
  Mg: 1.31,
  Al: 1.61,
  Si: 1.90,
  P: 2.19,
  S: 2.58,
  Cl: 3.16,
  Ar: 0,
  K: 0.82,
  Ca: 1.00,
  Sc: 1.36,
  Ti: 1.54,
  V: 1.63,
  Cr: 1.66,
  Mn: 1.55,
  Fe: 1.83,
  Co: 1.88,
  Ni: 1.91,
  Cu: 1.90,
  Zn: 1.65,
  Ga: 1.81,
  Ge: 2.01,
  As: 2.18,
  Se: 2.55,
  Br: 2.96,
  Kr: 3.00,
  I: 2.66,
  Xe: 2.60,
}

// ---------------------------------------------------------------------------
// Atomic Radii (pm) - empirical / covalent values for rendering
// ---------------------------------------------------------------------------

export const ATOMIC_RADII = {
  H: 25,
  He: 31,
  Li: 145,
  Be: 105,
  B: 85,
  C: 77,
  N: 71,
  O: 66,
  F: 57,
  Ne: 58,
  Na: 180,
  Mg: 150,
  Al: 125,
  Si: 117,
  P: 110,
  S: 104,
  Cl: 99,
  Ar: 106,
  K: 220,
  Ca: 180,
  Sc: 160,
  Ti: 140,
  V: 135,
  Cr: 140,
  Mn: 140,
  Fe: 140,
  Co: 135,
  Ni: 135,
  Cu: 135,
  Zn: 135,
  Ga: 130,
  Ge: 125,
  As: 115,
  Se: 115,
  Br: 115,
  Kr: 116,
  I: 140,
}

// ---------------------------------------------------------------------------
// Ionic Radii (pm)
// ---------------------------------------------------------------------------

export const IONIC_RADII = {
  'Li+': 76,
  'Be2+': 45,
  'B3+': 27,
  'N3-': 146,
  'O2-': 140,
  'F-': 133,
  'Na+': 102,
  'Mg2+': 72,
  'Al3+': 53,
  'P3-': 212,
  'S2-': 184,
  'Cl-': 181,
  'K+': 138,
  'Ca2+': 100,
  'Sc3+': 75,
  'Ti4+': 61,
  'Cr3+': 62,
  'Mn2+': 83,
  'Fe2+': 78,
  'Fe3+': 65,
  'Co2+': 75,
  'Ni2+': 69,
  'Cu+': 77,
  'Cu2+': 73,
  'Zn2+': 74,
  'Br-': 196,
  'I-': 220,
}

// ---------------------------------------------------------------------------
// Valences (common / most-used valence per element)
// ---------------------------------------------------------------------------

export const VALENCES = {
  H: 1,
  He: 0,
  Li: 1,
  Be: 2,
  B: 3,
  C: 4,
  N: 3,
  O: 2,
  F: 1,
  Ne: 0,
  Na: 1,
  Mg: 2,
  Al: 3,
  Si: 4,
  P: 3,
  S: 2,
  Cl: 1,
  Ar: 0,
  K: 1,
  Ca: 2,
  Fe: 3,
  Cu: 2,
  Zn: 2,
  Br: 1,
  I: 1,
}

// ---------------------------------------------------------------------------
// Molar Masses (g/mol) - rounded to standard JEE/NEET values
// ---------------------------------------------------------------------------

export const MOLAR_MASSES = {
  H: 1,
  He: 4,
  Li: 7,
  Be: 9,
  B: 11,
  C: 12,
  N: 14,
  O: 16,
  F: 19,
  Ne: 20,
  Na: 23,
  Mg: 24,
  Al: 27,
  Si: 28,
  P: 31,
  S: 32,
  Cl: 35.5,
  Ar: 40,
  K: 39,
  Ca: 40,
  Sc: 45,
  Ti: 48,
  V: 51,
  Cr: 52,
  Mn: 55,
  Fe: 56,
  Co: 59,
  Ni: 59,
  Cu: 63.5,
  Zn: 65,
  Ga: 70,
  Ge: 73,
  As: 75,
  Se: 79,
  Br: 80,
  Kr: 84,
  I: 127,
  Xe: 131,
}

// ---------------------------------------------------------------------------
// Element Colors - CPK-inspired palette for atom rendering
// ---------------------------------------------------------------------------

export const ELEMENT_COLORS = {
  H: '#FFFFFF',
  He: '#D9FFFF',
  Li: '#CC80FF',
  Be: '#C2FF00',
  B: '#FFB5B5',
  C: '#6B7280',
  N: '#3B82F6',
  O: '#EF4444',
  F: '#22C55E',
  Ne: '#B3E3F5',
  Na: '#8B5CF6',
  Mg: '#22D3EE',
  Al: '#BFA6A6',
  Si: '#F0C8A0',
  P: '#F97316',
  S: '#EAB308',
  Cl: '#22C55E',
  Ar: '#80D1E3',
  K: '#8F40D4',
  Ca: '#3DFF00',
  Sc: '#E6E6E6',
  Ti: '#BFC2C7',
  V: '#A6A6AB',
  Cr: '#8A99C7',
  Mn: '#9C7AC7',
  Fe: '#D97706',
  Co: '#F090A0',
  Ni: '#50D050',
  Cu: '#C88033',
  Zn: '#7D80B0',
  Ga: '#C28F8F',
  Ge: '#668F8F',
  As: '#BD80E3',
  Se: '#FFA100',
  Br: '#A62929',
  Kr: '#5CB8D1',
  I: '#940094',
  Xe: '#429EB0',
}

// ---------------------------------------------------------------------------
// Electron Configuration (first 36 elements, Z = 1..36)
// Each entry is an array of [subshell, electronCount] pairs.
// ---------------------------------------------------------------------------

export const ELECTRON_CONFIG = {
  1:  [['1s', 1]],
  2:  [['1s', 2]],
  3:  [['1s', 2], ['2s', 1]],
  4:  [['1s', 2], ['2s', 2]],
  5:  [['1s', 2], ['2s', 2], ['2p', 1]],
  6:  [['1s', 2], ['2s', 2], ['2p', 2]],
  7:  [['1s', 2], ['2s', 2], ['2p', 3]],
  8:  [['1s', 2], ['2s', 2], ['2p', 4]],
  9:  [['1s', 2], ['2s', 2], ['2p', 5]],
  10: [['1s', 2], ['2s', 2], ['2p', 6]],
  11: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 1]],
  12: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2]],
  13: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 1]],
  14: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 2]],
  15: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 3]],
  16: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 4]],
  17: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 5]],
  18: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6]],
  19: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 1]],
  20: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2]],
  21: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 1]],
  22: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 2]],
  23: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 3]],
  24: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 1], ['3d', 5]],  // Cr exception
  25: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 5]],
  26: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 6]],
  27: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 7]],
  28: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 8]],
  29: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 1], ['3d', 10]], // Cu exception
  30: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10]],
  31: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 1]],
  32: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 2]],
  33: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 3]],
  34: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 4]],
  35: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 5]],
  36: [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]],
}

// ---------------------------------------------------------------------------
// Subshell Capacities
// ---------------------------------------------------------------------------

export const SUBSHELL_CAPACITY = {
  s: 2,
  p: 6,
  d: 10,
  f: 14,
}

// ---------------------------------------------------------------------------
// Aufbau Filling Order
// ---------------------------------------------------------------------------

export const FILLING_ORDER = [
  '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p',
  '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s',
  '5f', '6d', '7p',
]

// ---------------------------------------------------------------------------
// Element Metadata (symbol -> atomic number mapping for convenience)
// ---------------------------------------------------------------------------

export const ATOMIC_NUMBER = {
  H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
  Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18,
  K: 19, Ca: 20, Sc: 21, Ti: 22, V: 23, Cr: 24, Mn: 25, Fe: 26,
  Co: 27, Ni: 28, Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34,
  Br: 35, Kr: 36, I: 53, Xe: 54,
}

// ---------------------------------------------------------------------------
// Bond Data
// ---------------------------------------------------------------------------

/** Typical single-bond lengths in pm */
export const BOND_LENGTHS = {
  'C-C': 154,
  'C=C': 134,
  'C#C': 120,
  'C-H': 109,
  'C-N': 147,
  'C=N': 129,
  'C#N': 116,
  'C-O': 143,
  'C=O': 123,
  'C-F': 135,
  'C-Cl': 177,
  'C-S': 182,
  'N-H': 101,
  'N-N': 145,
  'N=N': 125,
  'N#N': 110,
  'O-H': 96,
  'O-O': 148,
  'O=O': 121,
  'H-H': 74,
  'H-F': 92,
  'H-Cl': 127,
  'H-Br': 141,
  'H-I': 161,
  'S-H': 134,
  'S-S': 205,
  'P-H': 142,
  'P-O': 163,
  'P=O': 150,
}

/** Bond energies in kJ/mol */
export const BOND_ENERGIES = {
  'C-C': 347,
  'C=C': 614,
  'C#C': 839,
  'C-H': 413,
  'C-N': 305,
  'C=N': 615,
  'C#N': 891,
  'C-O': 358,
  'C=O': 799,
  'C-F': 485,
  'C-Cl': 339,
  'C-Br': 276,
  'C-S': 259,
  'N-H': 391,
  'N-N': 163,
  'N=N': 418,
  'N#N': 941,
  'O-H': 463,
  'O-O': 146,
  'O=O': 498,
  'H-H': 436,
  'H-F': 567,
  'H-Cl': 431,
  'H-Br': 366,
  'H-I': 298,
  'S-H': 363,
  'S-S': 266,
}

// ---------------------------------------------------------------------------
// Cell Organelles (for CellExplorer)
// ---------------------------------------------------------------------------

export const CELL_ORGANELLES = [
  {
    id: 'nucleus',
    name: 'Nucleus',
    description: 'The control centre of the cell, containing DNA organized into chromosomes.',
    function: 'Stores genetic information; controls gene expression and cell division.',
    color: '#6366F1',
    size: 'large',
    membraneCount: 2,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    description: 'Double-membrane organelle known as the powerhouse of the cell.',
    function: 'Produces ATP via oxidative phosphorylation (aerobic respiration).',
    color: '#EF4444',
    size: 'medium',
    membraneCount: 2,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'rough-er',
    name: 'Rough Endoplasmic Reticulum',
    description: 'Membrane network studded with ribosomes for protein synthesis.',
    function: 'Synthesizes and folds secretory and membrane-bound proteins.',
    color: '#3B82F6',
    size: 'large',
    membraneCount: 1,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'smooth-er',
    name: 'Smooth Endoplasmic Reticulum',
    description: 'Membrane network without ribosomes involved in lipid metabolism.',
    function: 'Synthesizes lipids, detoxifies drugs, stores calcium ions.',
    color: '#60A5FA',
    size: 'medium',
    membraneCount: 1,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'golgi',
    name: 'Golgi Apparatus',
    description: 'Stack of flattened membrane sacs that process and package proteins.',
    function: 'Modifies, sorts, and packages proteins and lipids for transport.',
    color: '#F59E0B',
    size: 'medium',
    membraneCount: 1,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'lysosome',
    name: 'Lysosome',
    description: 'Membrane-bound vesicle containing hydrolytic enzymes.',
    function: 'Digests macromolecules, old organelles, and engulfed pathogens.',
    color: '#A855F7',
    size: 'small',
    membraneCount: 1,
    plantCell: false,
    animalCell: true,
  },
  {
    id: 'ribosome',
    name: 'Ribosome',
    description: 'Non-membrane-bound granules made of rRNA and protein.',
    function: 'Translates mRNA into polypeptide chains (protein synthesis).',
    color: '#6B7280',
    size: 'tiny',
    membraneCount: 0,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'chloroplast',
    name: 'Chloroplast',
    description: 'Double-membrane organelle containing chlorophyll for photosynthesis.',
    function: 'Converts light energy to chemical energy (glucose) via photosynthesis.',
    color: '#22C55E',
    size: 'large',
    membraneCount: 2,
    plantCell: true,
    animalCell: false,
  },
  {
    id: 'vacuole',
    name: 'Central Vacuole',
    description: 'Large membrane-bound sac filled with cell sap in plant cells.',
    function: 'Maintains turgor pressure; stores water, ions, pigments, and waste.',
    color: '#06B6D4',
    size: 'large',
    membraneCount: 1,
    plantCell: true,
    animalCell: false,
  },
  {
    id: 'cell-wall',
    name: 'Cell Wall',
    description: 'Rigid outer layer made of cellulose (plants), chitin (fungi), or peptidoglycan (bacteria).',
    function: 'Provides structural support, protection, and prevents over-expansion.',
    color: '#84CC16',
    size: 'large',
    membraneCount: 0,
    plantCell: true,
    animalCell: false,
  },
  {
    id: 'plasma-membrane',
    name: 'Plasma Membrane',
    description: 'Phospholipid bilayer with embedded proteins forming the cell boundary.',
    function: 'Controls substance entry/exit; maintains homeostasis via selective permeability.',
    color: '#F97316',
    size: 'large',
    membraneCount: 1,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'centrosome',
    name: 'Centrosome',
    description: 'Organelle containing two centrioles that organise microtubules.',
    function: 'Forms mitotic spindle during cell division; organises cytoskeleton.',
    color: '#EC4899',
    size: 'small',
    membraneCount: 0,
    plantCell: false,
    animalCell: true,
  },
  {
    id: 'peroxisome',
    name: 'Peroxisome',
    description: 'Small vesicle containing oxidative enzymes like catalase.',
    function: 'Breaks down fatty acids and detoxifies harmful substances (e.g. H2O2).',
    color: '#14B8A6',
    size: 'small',
    membraneCount: 1,
    plantCell: true,
    animalCell: true,
  },
  {
    id: 'cytoskeleton',
    name: 'Cytoskeleton',
    description: 'Network of microfilaments, intermediate filaments, and microtubules.',
    function: 'Maintains cell shape; enables movement, division, and intracellular transport.',
    color: '#78716C',
    size: 'large',
    membraneCount: 0,
    plantCell: true,
    animalCell: true,
  },
]

// ---------------------------------------------------------------------------
// Mitosis Stages
// ---------------------------------------------------------------------------

export const MITOSIS_STAGES = [
  {
    name: 'Interphase',
    phase: 'interphase',
    description: 'Cell grows, duplicates organelles, and replicates DNA during S phase. Not technically part of mitosis but prepares the cell for division.',
    keyEvents: [
      'G1: Cell growth and normal function',
      'S: DNA replication (2n -> 4n DNA content)',
      'G2: Further growth; centriole duplication',
    ],
    chromosomeState: 'Chromatin (decondensed)',
  },
  {
    name: 'Prophase',
    phase: 'prophase',
    description: 'Chromatin condenses into visible chromosomes. Each chromosome consists of two sister chromatids joined at the centromere. The mitotic spindle begins to form.',
    keyEvents: [
      'Chromatin condenses into chromosomes',
      'Each chromosome is two sister chromatids',
      'Centrioles move to opposite poles',
      'Spindle fibres begin forming',
      'Nucleolus disappears',
    ],
    chromosomeState: 'Condensed; sister chromatids joined',
  },
  {
    name: 'Metaphase',
    phase: 'metaphase',
    description: 'Chromosomes align at the metaphase plate (cell equator). Spindle fibres from opposite poles attach to kinetochores on each sister chromatid.',
    keyEvents: [
      'Nuclear envelope fully broken down',
      'Chromosomes align at metaphase plate',
      'Kinetochore fibres attach to centromeres',
      'Spindle assembly checkpoint ensures proper attachment',
    ],
    chromosomeState: 'Aligned at equator; maximum condensation',
  },
  {
    name: 'Anaphase',
    phase: 'anaphase',
    description: 'Sister chromatids separate and move to opposite poles. The cell elongates as non-kinetochore microtubules push the poles apart.',
    keyEvents: [
      'Centromeres split; sister chromatids separate',
      'Chromatids pulled to opposite poles by spindle fibres',
      'Cell elongates (anaphase B)',
      'Each pole now has a complete set of chromosomes',
    ],
    chromosomeState: 'Separated; moving to poles',
  },
  {
    name: 'Telophase',
    phase: 'telophase',
    description: 'Chromosomes arrive at poles and decondense. Nuclear envelopes reform around each set of chromosomes. The cell begins to pinch in the middle.',
    keyEvents: [
      'Chromosomes decondense back to chromatin',
      'Nuclear envelope reforms around each group',
      'Nucleolus reappears',
      'Spindle fibres disassemble',
      'Cytokinesis begins (cleavage furrow in animal cells, cell plate in plant cells)',
    ],
    chromosomeState: 'Decondensing at poles',
  },
]

// ---------------------------------------------------------------------------
// Meiosis Stages
// ---------------------------------------------------------------------------

export const MEIOSIS_STAGES = [
  // Meiosis I
  {
    name: 'Prophase I',
    division: 'meiosis-I',
    description: 'Homologous chromosomes pair up (synapsis) forming tetrads. Crossing over occurs at chiasmata, creating genetic recombination.',
    keyEvents: [
      'Chromosomes condense; homologous pairs synapse',
      'Crossing over occurs at chiasmata',
      'Recombination creates new allele combinations',
      'Nuclear envelope breaks down',
      'Spindle begins forming',
    ],
    chromosomeState: 'Tetrads (bivalents) with chiasmata',
    ploidy: '2n (diploid)',
  },
  {
    name: 'Metaphase I',
    division: 'meiosis-I',
    description: 'Homologous pairs (not individual chromosomes) align at the metaphase plate. Independent assortment occurs as orientation is random.',
    keyEvents: [
      'Bivalents align at metaphase plate',
      'Random orientation of homologous pairs (independent assortment)',
      'Kinetochore fibres from one pole attach to one homolog',
    ],
    chromosomeState: 'Bivalents at equator; random orientation',
    ploidy: '2n (diploid)',
  },
  {
    name: 'Anaphase I',
    division: 'meiosis-I',
    description: 'Homologous chromosomes separate (disjunction) and move to opposite poles. Sister chromatids remain attached at centromeres.',
    keyEvents: [
      'Homologous chromosomes separate (reduction division)',
      'Sister chromatids stay joined',
      'Chromosome number halved at each pole',
    ],
    chromosomeState: 'Homologs separating; chromatids joined',
    ploidy: '2n -> n at each pole',
  },
  {
    name: 'Telophase I',
    division: 'meiosis-I',
    description: 'Chromosomes arrive at poles. Nuclear envelopes may or may not reform. Cytokinesis produces two haploid cells.',
    keyEvents: [
      'Each pole has a haploid set of chromosomes',
      'Nuclear envelope may reform briefly',
      'Cytokinesis divides cell into two daughter cells',
      'Each daughter cell has n chromosomes (each with 2 chromatids)',
    ],
    chromosomeState: 'Haploid sets at poles',
    ploidy: 'n (haploid)',
  },
  // Meiosis II
  {
    name: 'Prophase II',
    division: 'meiosis-II',
    description: 'Similar to mitotic prophase. Chromosomes (still consisting of two sister chromatids) condense. New spindle forms.',
    keyEvents: [
      'Chromosomes condense again',
      'Spindle apparatus forms',
      'Nuclear envelope breaks down',
      'No further DNA replication occurs',
    ],
    chromosomeState: 'Condensed; sister chromatids joined',
    ploidy: 'n (haploid)',
  },
  {
    name: 'Metaphase II',
    division: 'meiosis-II',
    description: 'Individual chromosomes (each consisting of two sister chromatids) align at the metaphase plate, similar to mitosis.',
    keyEvents: [
      'Chromosomes align at metaphase plate',
      'Kinetochore fibres attach to centromeres of sister chromatids',
    ],
    chromosomeState: 'Aligned at equator',
    ploidy: 'n (haploid)',
  },
  {
    name: 'Anaphase II',
    division: 'meiosis-II',
    description: 'Sister chromatids finally separate and move to opposite poles, identical to mitotic anaphase.',
    keyEvents: [
      'Centromeres split',
      'Sister chromatids separate',
      'Individual chromatids move to opposite poles',
    ],
    chromosomeState: 'Separated chromatids moving to poles',
    ploidy: 'n',
  },
  {
    name: 'Telophase II',
    division: 'meiosis-II',
    description: 'Chromatids arrive at poles, nuclear envelopes reform, and cytokinesis produces four genetically unique haploid cells.',
    keyEvents: [
      'Chromosomes decondense',
      'Nuclear envelopes reform',
      'Cytokinesis produces four haploid daughter cells',
      'Each cell is genetically unique due to crossing over and independent assortment',
    ],
    chromosomeState: 'Decondensed at poles',
    ploidy: 'n (haploid)',
  },
]

// ---------------------------------------------------------------------------
// Cell Cycle Phases (for CellCycleClock)
// ---------------------------------------------------------------------------

export const CELL_CYCLE_PHASES = [
  { id: 'g1', name: 'G1 Phase', durationPercent: 40, description: 'Cell growth and normal metabolic activity. Cell prepares for DNA synthesis.', dnaContent: '2n' },
  { id: 's', name: 'S Phase', durationPercent: 30, description: 'DNA replication occurs. Each chromosome is duplicated into two sister chromatids.', dnaContent: '2n -> 4n' },
  { id: 'g2', name: 'G2 Phase', durationPercent: 15, description: 'Further cell growth. Proteins needed for division are synthesized. Centrioles replicate.', dnaContent: '4n' },
  { id: 'm', name: 'M Phase (Mitosis)', durationPercent: 10, description: 'Cell division: prophase, metaphase, anaphase, telophase.', dnaContent: '4n -> 2n' },
  { id: 'cytokinesis', name: 'Cytokinesis', durationPercent: 5, description: 'Physical division of the cytoplasm into two daughter cells.', dnaContent: '2n each' },
]

// ---------------------------------------------------------------------------
// Membrane Transport Types (for MembraneTransport game)
// ---------------------------------------------------------------------------

export const TRANSPORT_TYPES = [
  {
    id: 'simple-diffusion',
    name: 'Simple Diffusion',
    description: 'Small nonpolar molecules move down their concentration gradient through the lipid bilayer.',
    requiresEnergy: false,
    requiresProtein: false,
    examples: ['O2', 'CO2', 'N2', 'steroid hormones'],
    direction: 'high-to-low',
  },
  {
    id: 'facilitated-diffusion',
    name: 'Facilitated Diffusion',
    description: 'Polar or large molecules move down their concentration gradient through channel or carrier proteins.',
    requiresEnergy: false,
    requiresProtein: true,
    examples: ['glucose', 'amino acids', 'ions (Na+, K+, Ca2+)'],
    direction: 'high-to-low',
  },
  {
    id: 'osmosis',
    name: 'Osmosis',
    description: 'Water moves across a selectively permeable membrane from a region of lower solute concentration to higher solute concentration.',
    requiresEnergy: false,
    requiresProtein: false,
    examples: ['water (via aquaporins or lipid bilayer)'],
    direction: 'low-solute-to-high-solute',
  },
  {
    id: 'active-transport',
    name: 'Active Transport',
    description: 'Molecules move against their concentration gradient using ATP energy and carrier proteins (pumps).',
    requiresEnergy: true,
    requiresProtein: true,
    examples: ['Na+/K+ ATPase', 'Ca2+ pump', 'H+ pump'],
    direction: 'low-to-high',
  },
  {
    id: 'endocytosis',
    name: 'Endocytosis',
    description: 'Cell membrane engulfs extracellular material, forming a vesicle. Includes phagocytosis (solids) and pinocytosis (liquids).',
    requiresEnergy: true,
    requiresProtein: true,
    examples: ['phagocytosis of bacteria', 'pinocytosis of fluids', 'receptor-mediated endocytosis'],
    direction: 'into-cell',
  },
  {
    id: 'exocytosis',
    name: 'Exocytosis',
    description: 'Vesicles fuse with the plasma membrane and release their contents outside the cell.',
    requiresEnergy: true,
    requiresProtein: true,
    examples: ['neurotransmitter release', 'hormone secretion', 'enzyme secretion'],
    direction: 'out-of-cell',
  },
]

// ---------------------------------------------------------------------------
// Osmosis Solution Types (for OsmosisLab)
// ---------------------------------------------------------------------------

export const SOLUTION_TYPES = {
  hypotonic: {
    name: 'Hypotonic',
    description: 'Lower solute concentration outside the cell. Water enters by osmosis.',
    animalCellEffect: 'Cell swells and may lyse (burst)',
    plantCellEffect: 'Cell becomes turgid (firm) as vacuole fills',
    waterDirection: 'into-cell',
  },
  isotonic: {
    name: 'Isotonic',
    description: 'Equal solute concentration inside and outside. No net water movement.',
    animalCellEffect: 'Cell maintains normal shape',
    plantCellEffect: 'Cell is flaccid (limp)',
    waterDirection: 'balanced',
  },
  hypertonic: {
    name: 'Hypertonic',
    description: 'Higher solute concentration outside the cell. Water leaves by osmosis.',
    animalCellEffect: 'Cell shrinks (crenation)',
    plantCellEffect: 'Cell plasmolyses (membrane pulls away from wall)',
    waterDirection: 'out-of-cell',
  },
}

// ---------------------------------------------------------------------------
// Chromosome Numbers (for ChromosomeCounter)
// ---------------------------------------------------------------------------

export const CHROMOSOME_NUMBERS = {
  human: { name: 'Human', diploid: 46, haploid: 23 },
  fruit_fly: { name: 'Fruit Fly (Drosophila)', diploid: 8, haploid: 4 },
  pea_plant: { name: 'Pea Plant (Pisum sativum)', diploid: 14, haploid: 7 },
  onion: { name: 'Onion (Allium cepa)', diploid: 16, haploid: 8 },
  rice: { name: 'Rice (Oryza sativa)', diploid: 24, haploid: 12 },
  cat: { name: 'Cat', diploid: 38, haploid: 19 },
  dog: { name: 'Dog', diploid: 78, haploid: 39 },
  potato: { name: 'Potato', diploid: 48, haploid: 24 },
  wheat: { name: 'Wheat (hexaploid)', diploid: 42, haploid: 21 },
  maize: { name: 'Maize (Corn)', diploid: 20, haploid: 10 },
}

// ---------------------------------------------------------------------------
// Physics Simulation Defaults
// ---------------------------------------------------------------------------

export const PROJECTILE_DEFAULTS = {
  velocity: 20,        // m/s
  angle: 45,           // degrees
  height: 0,           // m (launch height)
  gravity: GRAVITY,
  airResistance: false,
  timeStep: 0.02,      // seconds per simulation tick
}

export const FRICTION_DEFAULTS = {
  mass: 2,             // kg
  mu_static: 0.5,
  mu_kinetic: 0.4,
  rampAngle: 30,       // degrees
  gravity: GRAVITY,
}

export const COLLISION_DEFAULTS = {
  ball1Mass: 1,        // kg
  ball2Mass: 1,        // kg
  ball1Velocity: 5,    // m/s
  ball2Velocity: 0,    // m/s
  restitution: 1,      // 1 = perfectly elastic, 0 = perfectly inelastic
}

export const ORBIT_DEFAULTS = {
  planetMass: 5.97e24, // kg (Earth-like)
  satelliteMass: 100,   // kg
  orbitRadius: 6.771e6, // m (Low Earth Orbit)
  G: G_CONSTANT,
}

// ---------------------------------------------------------------------------
// Utility: Get electron configuration string for an element
// ---------------------------------------------------------------------------

export function getElectronConfigString(atomicNumber) {
  const config = ELECTRON_CONFIG[atomicNumber]
  if (!config) return null
  return config.map(([subshell, count]) => `${subshell}${superscript(count)}`).join(' ')
}

function superscript(n) {
  const map = { 0: '\u2070', 1: '\u00B9', 2: '\u00B2', 3: '\u00B3', 4: '\u2074', 5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079' }
  return String(n).split('').map(d => map[d]).join('')
}

/**
 * Compute the valence electrons for a given atomic number.
 */
export function getValenceElectrons(atomicNumber) {
  const config = ELECTRON_CONFIG[atomicNumber]
  if (!config) return null

  const lastShell = Math.max(...config.map(([sub]) => parseInt(sub[0])))
  let valence = 0
  for (const [sub, count] of config) {
    const n = parseInt(sub[0])
    const l = sub[1]
    // Valence shell electrons (outermost principal quantum number)
    // For d-block, include both ns and (n-1)d electrons
    if (n === lastShell && (l === 's' || l === 'p')) {
      valence += count
    }
  }
  return valence
}
