import { lazy } from 'react'

// ---------------------------------------------------------------------------
// Simulation Registry
// Maps simulation type strings to lazy-loaded React components.
// Used by the SimulationLoader to render the correct interactive simulation.
// ---------------------------------------------------------------------------

export const simulationRegistry = {
  // Physics - Kinematics & Dynamics
  'projectile-launcher': lazy(() => import('../../components/games/physics/ProjectileLauncher')),
  'motion-grapher': lazy(() => import('../../components/games/physics/MotionGrapher')),
  'velocity-racer': lazy(() => import('../../components/games/physics/VelocityRacer')),
  'friction-ramp': lazy(() => import('../../components/games/physics/FrictionRamp')),
  'circular-orbit': lazy(() => import('../../components/games/physics/CircularOrbit')),

  // Physics - Momentum & Collisions
  'collision-lab': lazy(() => import('../../components/games/physics/CollisionLab')),
  'impulse-catcher': lazy(() => import('../../components/games/physics/ImpulseCatcher')),
  'newtons-cradle': lazy(() => import('../../components/games/physics/NewtonsCradle')),

  // Chemistry - Atomic Structure & Periodicity
  'electron-shell': lazy(() => import('../../components/games/chemistry/ElectronShellBuilder')),
  'periodic-trends': lazy(() => import('../../components/games/chemistry/PeriodicTrendExplorer')),
  'atom-sizer': lazy(() => import('../../components/games/chemistry/AtomSizer')),
  'bond-polarity': lazy(() => import('../../components/games/chemistry/BondPolarity')),
  'vsepr-explorer': lazy(() => import('../../components/games/chemistry/VSEPRExplorer')),
  'mole-converter': lazy(() => import('../../components/games/chemistry/MoleConverter')),

  // Biology - Cell Biology
  'cell-explorer': lazy(() => import('../../components/games/biology/CellExplorer')),
  'cell-cycle-clock': lazy(() => import('../../components/games/biology/CellCycleClock')),
  'chromosome-counter': lazy(() => import('../../components/games/biology/ChromosomeCounter')),
  'membrane-transport': lazy(() => import('../../components/games/biology/MembraneTransport')),
  'osmosis-lab': lazy(() => import('../../components/games/biology/OsmosisLab')),
}

// ---------------------------------------------------------------------------
// Sandbox Registry
// Open-ended exploration tools without scoring. Players build and experiment
// freely, reinforcing concepts through creative play.
// ---------------------------------------------------------------------------

export const sandboxRegistry = {
  'molecule-builder': lazy(() => import('../../components/games/chemistry/MoleculeBuilder')),
  'fbd-builder': lazy(() => import('../../components/games/physics/ForceDiagramBuilder')),
  'electron-shell-builder': lazy(() => import('../../components/games/chemistry/ElectronShellBuilder')),
  'vsepr-sandbox': lazy(() => import('../../components/games/chemistry/VSEPRExplorer')),
}

// ---------------------------------------------------------------------------
// Challenge Registry
// Timed / scored versions of simulations used in quests, boss fights, and
// leaderboard challenges. Components receive a `challengeMode` prop.
// ---------------------------------------------------------------------------

export const challengeRegistry = {
  // Physics Challenges
  'motion-grapher': lazy(() => import('../../components/games/physics/MotionGrapher')),
  'velocity-racer': lazy(() => import('../../components/games/physics/VelocityRacer')),
  'collision-challenge': lazy(() => import('../../components/games/physics/CollisionLab')),
  'impulse-catcher': lazy(() => import('../../components/games/physics/ImpulseCatcher')),

  // Chemistry Challenges
  'reaction-balancer': lazy(() => import('../../components/games/chemistry/ReactionBalancer')),
  'stoichiometry-factory': lazy(() => import('../../components/games/chemistry/StoichiometryFactory')),

  // Biology Challenges
  'organelle-assembler': lazy(() => import('../../components/games/biology/OrganelleAssembler')),
  'endomembrane-tracer': lazy(() => import('../../components/games/biology/EndomembraneTracer')),
  'mitosis-sorter': lazy(() => import('../../components/games/biology/MitosisSorter')),
  'pump-simulator': lazy(() => import('../../components/games/biology/PumpSimulator')),
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a component from any registry by type key.
 * Falls back through simulation -> sandbox -> challenge registries.
 * Returns `null` if no match is found.
 */
export function resolveComponent(type) {
  return simulationRegistry[type] || sandboxRegistry[type] || challengeRegistry[type] || null
}

/**
 * Check whether a given type key exists in any registry.
 */
export function isRegistered(type) {
  return !!(simulationRegistry[type] || sandboxRegistry[type] || challengeRegistry[type])
}

/**
 * Return the registry name ('simulation' | 'sandbox' | 'challenge') for a
 * given type key, or null if not found.
 */
export function getRegistryType(type) {
  if (simulationRegistry[type]) return 'simulation'
  if (sandboxRegistry[type]) return 'sandbox'
  if (challengeRegistry[type]) return 'challenge'
  return null
}
