// ===========================================================================
// Discovery Check Functions for antarYaan Simulations
// ===========================================================================
// Each check function receives (state, history) and returns a boolean
// indicating whether the player has made the scientific discovery.
//
//   state   - current simulation state snapshot
//   history - array of past state snapshots / event log
//
// The simulation engine calls these after every significant parameter change
// or at regular intervals to award discovery badges and XP.
// ===========================================================================

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Compute projectile range for a given velocity, angle (deg), and gravity.
 */
function projectileRange(v, angleDeg, g = 10) {
  const rad = (angleDeg * Math.PI) / 180
  return (v * v * Math.sin(2 * rad)) / g
}

/**
 * Check if two values are approximately equal within a tolerance.
 */
function approxEqual(a, b, tolerance = 0.05) {
  if (b === 0) return Math.abs(a) < tolerance
  return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b)) < tolerance
}

/**
 * Find all launches in history that have a recorded range.
 */
function getLaunches(history) {
  if (!Array.isArray(history)) return []
  return history.filter(
    (entry) => entry.type === 'launch' && typeof entry.range === 'number'
  )
}

/**
 * Find all parameter-change events in history.
 */
function getParamChanges(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'param-change')
}

/**
 * Get recorded orbit entries from history.
 */
function getOrbitEntries(history) {
  if (!Array.isArray(history)) return []
  return history.filter(
    (entry) => entry.type === 'orbit' && typeof entry.radius === 'number' && typeof entry.speed === 'number'
  )
}

/**
 * Get collision events from history.
 */
function getCollisions(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'collision')
}

/**
 * Get concentration snapshots from history.
 */
function getConcentrationSnapshots(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'concentration-snapshot')
}

/**
 * Get ramp experiments from history.
 */
function getRampExperiments(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'ramp-experiment')
}

/**
 * Get periodic trend observations from history.
 */
function getTrendObservations(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'trend-observation')
}

/**
 * Get osmosis experiment records from history.
 */
function getOsmosisExperiments(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'osmosis-experiment')
}

/**
 * Get cell cycle observations from history.
 */
function getCellCycleObservations(history) {
  if (!Array.isArray(history)) return []
  return history.filter((entry) => entry.type === 'cell-cycle-observation')
}

// ===========================================================================
// Discovery Checks
// ===========================================================================

export const discoveryChecks = {
  // -------------------------------------------------------------------------
  // Projectile Launcher Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player discovered that 45 degrees gives maximum range.
   * Requires at least 3 launches at different angles, one of which is near
   * 45 degrees and has the greatest range.
   */
  angle_at_max_range: (state, history) => {
    const launches = getLaunches(history)
    if (launches.length < 3) return false

    // Need launches at meaningfully different angles
    const angles = launches.map((l) => l.angle)
    const uniqueAngles = new Set(angles.map((a) => Math.round(a / 5) * 5))
    if (uniqueAngles.size < 3) return false

    // Find the launch with maximum range
    const maxRangeLaunch = launches.reduce((best, l) =>
      l.range > best.range ? l : best
    )

    // The max-range launch should be near 45 degrees
    return Math.abs(maxRangeLaunch.angle - 45) <= 3
  },

  /**
   * Player discovered complementary angles give equal range.
   * Two launches with angles summing to ~90 degrees produced approximately
   * equal range values.
   */
  complementary_equal_range: (state, history) => {
    const launches = getLaunches(history)
    if (launches.length < 2) return false

    for (let i = 0; i < launches.length; i++) {
      for (let j = i + 1; j < launches.length; j++) {
        const a = launches[i]
        const b = launches[j]

        // Angles must sum to approximately 90 degrees
        const angleSum = a.angle + b.angle
        if (Math.abs(angleSum - 90) > 3) continue

        // Angles must be different (not both ~45)
        if (Math.abs(a.angle - b.angle) < 5) continue

        // Must use the same velocity and gravity
        if (a.velocity !== b.velocity) continue

        // Ranges must be approximately equal
        if (approxEqual(a.range, b.range, 0.08)) return true
      }
    }
    return false
  },

  /**
   * Player discovered that reducing gravity increases range.
   * At least two launches with the same angle and velocity but different
   * gravity values, where lower gravity gave higher range.
   */
  low_gravity_high_range: (state, history) => {
    const launches = getLaunches(history)
    if (launches.length < 2) return false

    for (let i = 0; i < launches.length; i++) {
      for (let j = i + 1; j < launches.length; j++) {
        const a = launches[i]
        const b = launches[j]

        // Same angle and velocity
        if (Math.abs(a.angle - b.angle) > 2) continue
        if (Math.abs(a.velocity - b.velocity) > 0.5) continue

        // Different gravities
        if (!a.gravity || !b.gravity) continue
        if (Math.abs(a.gravity - b.gravity) < 0.5) continue

        // Lower gravity should give greater range
        const lowerG = a.gravity < b.gravity ? a : b
        const higherG = a.gravity < b.gravity ? b : a
        if (lowerG.range > higherG.range) return true
      }
    }
    return false
  },

  // -------------------------------------------------------------------------
  // Friction Ramp Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player found the critical angle where the block starts sliding.
   * The history must contain at least one experiment where the block was
   * stationary and one where it started sliding, with angles close together.
   */
  critical_angle_found: (state, history) => {
    const experiments = getRampExperiments(history)
    if (experiments.length < 2) return false

    const stationary = experiments.filter((e) => e.sliding === false)
    const sliding = experiments.filter((e) => e.sliding === true)

    if (stationary.length === 0 || sliding.length === 0) return false

    // Find the highest stationary angle and lowest sliding angle
    const maxStationary = Math.max(...stationary.map((e) => e.angle))
    const minSliding = Math.min(...sliding.map((e) => e.angle))

    // They should be close together (within 5 degrees) indicating the
    // player zeroed in on the critical angle
    return Math.abs(minSliding - maxStationary) <= 5
  },

  /**
   * Player observed that normal force decreases as ramp angle increases.
   * At least 3 experiments at different angles where the recorded normal
   * force strictly decreased with increasing angle.
   */
  normal_decreases_with_angle: (state, history) => {
    const experiments = getRampExperiments(history)
    if (experiments.length < 3) return false

    // Filter experiments that have normal force recorded
    const withNormal = experiments.filter(
      (e) => typeof e.normalForce === 'number' && typeof e.angle === 'number'
    )
    if (withNormal.length < 3) return false

    // Sort by angle ascending
    const sorted = [...withNormal].sort((a, b) => a.angle - b.angle)

    // Need at least 3 distinct angles
    const uniqueAngles = new Set(sorted.map((e) => Math.round(e.angle)))
    if (uniqueAngles.size < 3) return false

    // Check that normal force generally decreases as angle increases
    let decreaseCount = 0
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].angle > sorted[i - 1].angle + 1) {
        if (sorted[i].normalForce < sorted[i - 1].normalForce) {
          decreaseCount++
        }
      }
    }
    return decreaseCount >= 2
  },

  // -------------------------------------------------------------------------
  // Circular Orbit Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player discovered that larger orbits have slower orbital speed.
   * Two stable orbits at different radii where the larger orbit has the
   * lower speed.
   */
  larger_orbit_slower: (state, history) => {
    const orbits = getOrbitEntries(history)
    if (orbits.length < 2) return false

    // Only consider stable orbits
    const stable = orbits.filter((o) => o.stable === true)
    if (stable.length < 2) return false

    for (let i = 0; i < stable.length; i++) {
      for (let j = i + 1; j < stable.length; j++) {
        const a = stable[i]
        const b = stable[j]

        // Radii must be meaningfully different (at least 10%)
        if (approxEqual(a.radius, b.radius, 0.1)) continue

        // Must use same planet mass
        if (a.planetMass && b.planetMass && !approxEqual(a.planetMass, b.planetMass, 0.05)) continue

        const larger = a.radius > b.radius ? a : b
        const smaller = a.radius > b.radius ? b : a

        // Larger orbit should have slower speed
        if (larger.speed < smaller.speed) return true
      }
    }
    return false
  },

  /**
   * Player discovered that a more massive planet requires faster orbital speed.
   * Two stable orbits at the same radius but different planet masses.
   */
  more_mass_faster: (state, history) => {
    const orbits = getOrbitEntries(history)
    if (orbits.length < 2) return false

    const stable = orbits.filter((o) => o.stable === true)
    if (stable.length < 2) return false

    for (let i = 0; i < stable.length; i++) {
      for (let j = i + 1; j < stable.length; j++) {
        const a = stable[i]
        const b = stable[j]

        if (!a.planetMass || !b.planetMass) continue

        // Same radius (within 10%)
        if (!approxEqual(a.radius, b.radius, 0.1)) continue

        // Different planet masses (at least 20% different)
        if (approxEqual(a.planetMass, b.planetMass, 0.2)) continue

        const heavier = a.planetMass > b.planetMass ? a : b
        const lighter = a.planetMass > b.planetMass ? b : a

        // More massive planet requires faster orbit
        if (heavier.speed > lighter.speed) return true
      }
    }
    return false
  },

  // -------------------------------------------------------------------------
  // Collision Lab Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player discovered that in an elastic collision between equal masses,
   * the first ball stops and the second ball takes all the velocity.
   */
  equal_mass_transfer: (state, history) => {
    const collisions = getCollisions(history)

    for (const c of collisions) {
      // Must be elastic (restitution ~1)
      if (c.restitution !== undefined && Math.abs(c.restitution - 1) > 0.05) continue

      // Equal masses
      if (!approxEqual(c.mass1, c.mass2, 0.05)) continue

      // Ball 2 initially stationary
      if (Math.abs(c.v2Before || 0) > 0.1) continue

      // After collision: ball 1 should be nearly stopped
      if (typeof c.v1After === 'number' && Math.abs(c.v1After) < 0.5) {
        // Ball 2 should have approximately the original velocity of ball 1
        if (typeof c.v2After === 'number' && approxEqual(Math.abs(c.v2After), Math.abs(c.v1Before), 0.1)) {
          return true
        }
      }
    }
    return false
  },

  /**
   * Player verified conservation of momentum: total momentum before equals
   * total momentum after for at least one collision.
   */
  momentum_conserved: (state, history) => {
    const collisions = getCollisions(history)

    for (const c of collisions) {
      if (
        typeof c.mass1 !== 'number' ||
        typeof c.mass2 !== 'number' ||
        typeof c.v1Before !== 'number' ||
        typeof c.v2Before !== 'number' ||
        typeof c.v1After !== 'number' ||
        typeof c.v2After !== 'number'
      ) continue

      const pBefore = c.mass1 * c.v1Before + c.mass2 * (c.v2Before || 0)
      const pAfter = c.mass1 * c.v1After + c.mass2 * c.v2After

      if (approxEqual(pBefore, pAfter, 0.05)) return true
    }
    return false
  },

  /**
   * Player observed kinetic energy is conserved in elastic collisions.
   */
  kinetic_energy_conserved: (state, history) => {
    const collisions = getCollisions(history)

    for (const c of collisions) {
      if (c.restitution !== undefined && Math.abs(c.restitution - 1) > 0.05) continue
      if (
        typeof c.mass1 !== 'number' ||
        typeof c.mass2 !== 'number' ||
        typeof c.v1Before !== 'number' ||
        typeof c.v1After !== 'number' ||
        typeof c.v2After !== 'number'
      ) continue

      const keBefore =
        0.5 * c.mass1 * c.v1Before ** 2 +
        0.5 * c.mass2 * (c.v2Before || 0) ** 2
      const keAfter =
        0.5 * c.mass1 * c.v1After ** 2 +
        0.5 * c.mass2 * c.v2After ** 2

      if (approxEqual(keBefore, keAfter, 0.08)) return true
    }
    return false
  },

  /**
   * Player observed that in perfectly inelastic collisions, objects stick
   * together and move with a common velocity.
   */
  inelastic_stick_together: (state, history) => {
    const collisions = getCollisions(history)

    for (const c of collisions) {
      // Perfectly inelastic (restitution ~0)
      if (c.restitution === undefined || Math.abs(c.restitution) > 0.05) continue

      // After collision, both should have same velocity
      if (typeof c.v1After === 'number' && typeof c.v2After === 'number') {
        if (approxEqual(c.v1After, c.v2After, 0.05)) return true
      }
    }
    return false
  },

  // -------------------------------------------------------------------------
  // Periodic Trends Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player observed that atomic radius decreases across a period.
   * History must contain observations of at least 3 consecutive elements in
   * the same period with decreasing radius.
   */
  radius_decreases_across: (state, history) => {
    const observations = getTrendObservations(history)
    const radiusObs = observations.filter(
      (o) => o.property === 'atomic-radius' && typeof o.value === 'number' && typeof o.period === 'number'
    )

    if (radiusObs.length < 3) return false

    // Group by period
    const byPeriod = {}
    for (const o of radiusObs) {
      if (!byPeriod[o.period]) byPeriod[o.period] = []
      byPeriod[o.period].push(o)
    }

    // Check any period for a decreasing sequence of length >= 3
    for (const period of Object.values(byPeriod)) {
      if (period.length < 3) continue
      const sorted = [...period].sort((a, b) => a.group - b.group)

      let decreasingRun = 1
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value < sorted[i - 1].value) {
          decreasingRun++
          if (decreasingRun >= 3) return true
        } else {
          decreasingRun = 1
        }
      }
    }
    return false
  },

  /**
   * Player observed that ionization energy generally increases across a period.
   */
  ie_increases_across: (state, history) => {
    const observations = getTrendObservations(history)
    const ieObs = observations.filter(
      (o) => o.property === 'ionization-energy' && typeof o.value === 'number' && typeof o.period === 'number'
    )

    if (ieObs.length < 3) return false

    const byPeriod = {}
    for (const o of ieObs) {
      if (!byPeriod[o.period]) byPeriod[o.period] = []
      byPeriod[o.period].push(o)
    }

    for (const period of Object.values(byPeriod)) {
      if (period.length < 3) continue
      const sorted = [...period].sort((a, b) => a.group - b.group)

      let increasingRun = 1
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value > sorted[i - 1].value) {
          increasingRun++
          if (increasingRun >= 3) return true
        } else {
          increasingRun = 1
        }
      }
    }
    return false
  },

  /**
   * Player observed that electronegativity generally increases across a period.
   */
  en_increases_across: (state, history) => {
    const observations = getTrendObservations(history)
    const enObs = observations.filter(
      (o) => o.property === 'electronegativity' && typeof o.value === 'number' && typeof o.period === 'number'
    )

    if (enObs.length < 3) return false

    const byPeriod = {}
    for (const o of enObs) {
      if (!byPeriod[o.period]) byPeriod[o.period] = []
      byPeriod[o.period].push(o)
    }

    for (const period of Object.values(byPeriod)) {
      if (period.length < 3) continue
      const sorted = [...period].sort((a, b) => a.group - b.group)

      let increasingRun = 1
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value > sorted[i - 1].value) {
          increasingRun++
          if (increasingRun >= 3) return true
        } else {
          increasingRun = 1
        }
      }
    }
    return false
  },

  /**
   * Player observed that atomic radius increases down a group.
   */
  radius_increases_down_group: (state, history) => {
    const observations = getTrendObservations(history)
    const radiusObs = observations.filter(
      (o) => o.property === 'atomic-radius' && typeof o.value === 'number' && typeof o.group === 'number'
    )

    if (radiusObs.length < 3) return false

    const byGroup = {}
    for (const o of radiusObs) {
      if (!byGroup[o.group]) byGroup[o.group] = []
      byGroup[o.group].push(o)
    }

    for (const group of Object.values(byGroup)) {
      if (group.length < 3) continue
      const sorted = [...group].sort((a, b) => a.period - b.period)

      let increasingRun = 1
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value > sorted[i - 1].value) {
          increasingRun++
          if (increasingRun >= 3) return true
        } else {
          increasingRun = 1
        }
      }
    }
    return false
  },

  /**
   * Player observed that IE decreases down a group.
   */
  ie_decreases_down_group: (state, history) => {
    const observations = getTrendObservations(history)
    const ieObs = observations.filter(
      (o) => o.property === 'ionization-energy' && typeof o.value === 'number' && typeof o.group === 'number'
    )

    if (ieObs.length < 3) return false

    const byGroup = {}
    for (const o of ieObs) {
      if (!byGroup[o.group]) byGroup[o.group] = []
      byGroup[o.group].push(o)
    }

    for (const group of Object.values(byGroup)) {
      if (group.length < 3) continue
      const sorted = [...group].sort((a, b) => a.period - b.period)

      let decreasingRun = 1
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value < sorted[i - 1].value) {
          decreasingRun++
          if (decreasingRun >= 3) return true
        } else {
          decreasingRun = 1
        }
      }
    }
    return false
  },

  // -------------------------------------------------------------------------
  // Membrane Transport Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player observed that particles diffuse from high to low concentration.
   * Needs at least 2 concentration snapshots showing the gradient decreasing.
   */
  diffusion_high_to_low: (state, history) => {
    const snapshots = getConcentrationSnapshots(history)
    if (snapshots.length < 2) return false

    // Filter for simple diffusion experiments
    const diffusion = snapshots.filter(
      (s) => s.transportType === 'simple-diffusion' || s.transportType === 'diffusion'
    )
    if (diffusion.length < 2) return false

    // Sort by time
    const sorted = [...diffusion].sort((a, b) => (a.time || 0) - (b.time || 0))

    // Check that concentration gradient decreased over time
    // (difference between high-side and low-side diminished)
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const curr = sorted[i]

      if (
        typeof prev.highSide === 'number' &&
        typeof prev.lowSide === 'number' &&
        typeof curr.highSide === 'number' &&
        typeof curr.lowSide === 'number'
      ) {
        const prevGradient = Math.abs(prev.highSide - prev.lowSide)
        const currGradient = Math.abs(curr.highSide - curr.lowSide)

        if (currGradient < prevGradient) return true
      }
    }

    // Alternative: state directly records the observation
    if (state.observedDiffusionDirection === 'high-to-low') return true

    return false
  },

  /**
   * Player discovered that large or polar molecules need channel proteins.
   * They attempted to move a large molecule without a channel (failed) and
   * then with a channel (succeeded).
   */
  channels_needed_for_large: (state, history) => {
    if (!Array.isArray(history)) return false

    const transportAttempts = history.filter((e) => e.type === 'transport-attempt')

    // Need at least one failed attempt without channel and one success with channel
    const failedWithoutChannel = transportAttempts.some(
      (t) => t.moleculeSize === 'large' && !t.channelPresent && !t.success
    )
    const succeededWithChannel = transportAttempts.some(
      (t) => t.moleculeSize === 'large' && t.channelPresent && t.success
    )

    // Alternative: check for polar molecule transport
    const failedPolarNaked = transportAttempts.some(
      (t) => t.polar === true && !t.channelPresent && !t.success
    )
    const succeededPolarChannel = transportAttempts.some(
      (t) => t.polar === true && t.channelPresent && t.success
    )

    return (failedWithoutChannel && succeededWithChannel) || (failedPolarNaked && succeededPolarChannel)
  },

  /**
   * Player observed equilibrium: concentrations on both sides became
   * approximately equal.
   */
  equilibrium_reached: (state, history) => {
    // Direct state check
    if (state.equilibriumReached === true) return true

    const snapshots = getConcentrationSnapshots(history)
    if (snapshots.length < 2) return false

    // Check if any snapshot shows near-equal concentrations
    for (const snap of snapshots) {
      if (
        typeof snap.highSide === 'number' &&
        typeof snap.lowSide === 'number'
      ) {
        if (approxEqual(snap.highSide, snap.lowSide, 0.1)) return true
      }
    }

    // Check for equal sides in state
    if (
      typeof state.concentrationLeft === 'number' &&
      typeof state.concentrationRight === 'number'
    ) {
      return approxEqual(state.concentrationLeft, state.concentrationRight, 0.1)
    }

    return false
  },

  /**
   * Player observed that active transport moves molecules against the
   * concentration gradient (requires ATP).
   */
  active_transport_against_gradient: (state, history) => {
    if (!Array.isArray(history)) return false

    const transportAttempts = history.filter((e) => e.type === 'transport-attempt')

    // Successful transport against gradient with ATP
    const activeSuccess = transportAttempts.some(
      (t) => t.transportType === 'active' && t.againstGradient === true && t.success === true && t.atpUsed === true
    )

    // Failed transport against gradient without ATP
    const passiveFail = transportAttempts.some(
      (t) => t.againstGradient === true && t.atpUsed === false && t.success === false
    )

    return activeSuccess || (activeSuccess && passiveFail)
  },

  // -------------------------------------------------------------------------
  // Osmosis Lab Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player observed that a cell swells in a hypotonic solution.
   */
  hypotonic_swelling: (state, history) => {
    const experiments = getOsmosisExperiments(history)

    for (const exp of experiments) {
      // Hypotonic: external solute < internal solute (water moves in)
      if (exp.solutionType === 'hypotonic' && exp.cellSizeChange > 0) return true
      if (
        typeof exp.externalConcentration === 'number' &&
        typeof exp.internalConcentration === 'number' &&
        exp.externalConcentration < exp.internalConcentration &&
        exp.cellSizeChange > 0
      ) return true
    }

    // State-level check
    if (state.solutionType === 'hypotonic' && state.cellSwelling === true) return true

    return false
  },

  /**
   * Player observed that a cell shrinks in a hypertonic solution.
   */
  hypertonic_shrinking: (state, history) => {
    const experiments = getOsmosisExperiments(history)

    for (const exp of experiments) {
      if (exp.solutionType === 'hypertonic' && exp.cellSizeChange < 0) return true
      if (
        typeof exp.externalConcentration === 'number' &&
        typeof exp.internalConcentration === 'number' &&
        exp.externalConcentration > exp.internalConcentration &&
        exp.cellSizeChange < 0
      ) return true
    }

    // State-level check
    if (state.solutionType === 'hypertonic' && state.cellShrinking === true) return true

    return false
  },

  /**
   * Player observed that in an isotonic solution, there is no net change in
   * cell size.
   */
  isotonic_no_change: (state, history) => {
    const experiments = getOsmosisExperiments(history)

    for (const exp of experiments) {
      if (exp.solutionType === 'isotonic' && Math.abs(exp.cellSizeChange || 0) < 0.05) return true
    }

    if (state.solutionType === 'isotonic' && state.cellStable === true) return true

    return false
  },

  /**
   * Player observed plasmolysis in a plant cell placed in hypertonic solution.
   */
  plasmolysis_observed: (state, history) => {
    const experiments = getOsmosisExperiments(history)

    for (const exp of experiments) {
      if (
        exp.cellType === 'plant' &&
        exp.solutionType === 'hypertonic' &&
        exp.plasmolysis === true
      ) return true
    }

    if (state.cellType === 'plant' && state.plasmolysis === true) return true

    return false
  },

  // -------------------------------------------------------------------------
  // Cell Cycle Clock Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player observed that DNA content doubles during S phase.
   */
  dna_doubles_in_s: (state, history) => {
    const observations = getCellCycleObservations(history)

    // Check for explicit S-phase DNA observation
    const sPhaseObs = observations.filter((o) => o.phase === 's' || o.phase === 'S')
    for (const obs of sPhaseObs) {
      if (obs.dnaContentBefore && obs.dnaContentAfter) {
        if (approxEqual(obs.dnaContentAfter, obs.dnaContentBefore * 2, 0.1)) return true
      }
      if (obs.dnaDoubled === true) return true
    }

    // State-level check
    if (state.currentPhase === 's' && state.dnaContent >= 3.8 && state.initialDnaContent <= 2.2) return true
    if (state.discoveredDnaDoubling === true) return true

    return false
  },

  /**
   * Player observed that G1 is the longest phase of the cell cycle.
   */
  g1_is_longest: (state, history) => {
    const observations = getCellCycleObservations(history)

    // Need observations from at least 3 different phases
    const phases = new Set(observations.map((o) => o.phase))
    if (phases.size < 3) return false

    // Check if player recorded phase durations
    const durations = {}
    for (const obs of observations) {
      if (obs.phase && typeof obs.duration === 'number') {
        durations[obs.phase] = obs.duration
      }
    }

    if (Object.keys(durations).length >= 3 && durations.g1) {
      const maxDuration = Math.max(...Object.values(durations))
      return durations.g1 === maxDuration
    }

    if (state.phaseDurations && state.phaseDurations.g1) {
      const maxDuration = Math.max(...Object.values(state.phaseDurations))
      return state.phaseDurations.g1 === maxDuration
    }

    return false
  },

  /**
   * Player observed that mitosis (M phase) is the shortest phase.
   */
  m_phase_is_shortest: (state, history) => {
    const observations = getCellCycleObservations(history)

    const durations = {}
    for (const obs of observations) {
      if (obs.phase && typeof obs.duration === 'number') {
        durations[obs.phase] = obs.duration
      }
    }

    if (Object.keys(durations).length >= 3 && durations.m) {
      const minDuration = Math.min(...Object.values(durations))
      return durations.m === minDuration
    }

    return false
  },

  // -------------------------------------------------------------------------
  // Electron Shell Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player correctly filled electron shells following the Aufbau principle
   * for at least one transition metal (Z >= 21).
   */
  aufbau_transition_metal: (state, history) => {
    if (!Array.isArray(history)) return false

    const shellBuilds = history.filter((e) => e.type === 'shell-build-complete')
    return shellBuilds.some(
      (b) => b.atomicNumber >= 21 && b.correct === true
    )
  },

  /**
   * Player discovered the Cr or Cu exception to the Aufbau filling order.
   * (Cr: [Ar] 4s1 3d5 instead of [Ar] 4s2 3d4;
   *  Cu: [Ar] 4s1 3d10 instead of [Ar] 4s2 3d9)
   */
  aufbau_exception_found: (state, history) => {
    if (!Array.isArray(history)) return false

    const shellBuilds = history.filter((e) => e.type === 'shell-build-complete')
    return shellBuilds.some(
      (b) => (b.atomicNumber === 24 || b.atomicNumber === 29) && b.correct === true
    )
  },

  // -------------------------------------------------------------------------
  // Bond Polarity Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player observed that greater electronegativity difference means greater
   * bond polarity.
   */
  en_difference_polarity: (state, history) => {
    if (!Array.isArray(history)) return false

    const bondObs = history.filter((e) => e.type === 'bond-observation')
    if (bondObs.length < 2) return false

    // Sort by EN difference
    const sorted = [...bondObs]
      .filter((b) => typeof b.enDifference === 'number' && typeof b.polarity === 'number')
      .sort((a, b) => a.enDifference - b.enDifference)

    if (sorted.length < 2) return false

    // Check correlation: larger EN diff -> larger polarity
    let correctOrder = 0
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].polarity >= sorted[i - 1].polarity) correctOrder++
    }

    return correctOrder >= Math.floor(sorted.length * 0.7)
  },

  // -------------------------------------------------------------------------
  // Mole Converter Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player successfully converted between at least 3 different unit pairs
   * (moles <-> grams, moles <-> particles, grams <-> particles).
   */
  mole_conversions_mastered: (state, history) => {
    if (!Array.isArray(history)) return false

    const conversions = history.filter(
      (e) => e.type === 'conversion' && e.correct === true
    )

    const pairsCompleted = new Set()
    for (const c of conversions) {
      if (c.fromUnit && c.toUnit) {
        const pair = [c.fromUnit, c.toUnit].sort().join('-')
        pairsCompleted.add(pair)
      }
    }

    return pairsCompleted.size >= 3
  },

  // -------------------------------------------------------------------------
  // Motion Grapher Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player matched a velocity-time graph that corresponds to constant
   * acceleration (straight line with non-zero slope).
   */
  constant_acceleration_graphed: (state, history) => {
    if (!Array.isArray(history)) return false

    const graphAttempts = history.filter((e) => e.type === 'graph-match')
    return graphAttempts.some(
      (g) => g.graphType === 'v-t' && g.motionType === 'constant-acceleration' && g.correct === true
    )
  },

  /**
   * Player realized that displacement is the area under a v-t graph.
   */
  area_under_vt_is_displacement: (state, history) => {
    if (!Array.isArray(history)) return false

    const areaCalcs = history.filter((e) => e.type === 'area-calculation')
    return areaCalcs.some(
      (a) => a.graphType === 'v-t' && a.resultType === 'displacement' && a.correct === true
    )
  },

  // -------------------------------------------------------------------------
  // Velocity Racer Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player achieved the target velocity within time using the right
   * combination of force and mass.
   */
  target_velocity_reached: (state, history) => {
    if (state.targetReached === true) return true

    if (!Array.isArray(history)) return false
    return history.some(
      (e) => e.type === 'race-complete' && e.success === true
    )
  },

  // -------------------------------------------------------------------------
  // Impulse Catcher Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player observed that extending collision time reduces peak force
   * (impulse = F * dt = delta-p).
   */
  longer_time_less_force: (state, history) => {
    if (!Array.isArray(history)) return false

    const catches = history.filter(
      (e) => e.type === 'catch' && typeof e.peakForce === 'number' && typeof e.catchDuration === 'number'
    )
    if (catches.length < 2) return false

    // Find two catches with similar momentum change but different durations
    for (let i = 0; i < catches.length; i++) {
      for (let j = i + 1; j < catches.length; j++) {
        const a = catches[i]
        const b = catches[j]

        // Similar impulse (momentum change)
        const impulseA = a.impulse || a.peakForce * a.catchDuration
        const impulseB = b.impulse || b.peakForce * b.catchDuration
        if (!approxEqual(impulseA, impulseB, 0.2)) continue

        // Different durations
        if (approxEqual(a.catchDuration, b.catchDuration, 0.15)) continue

        const longer = a.catchDuration > b.catchDuration ? a : b
        const shorter = a.catchDuration > b.catchDuration ? b : a

        // Longer duration should have lower peak force
        if (longer.peakForce < shorter.peakForce) return true
      }
    }
    return false
  },

  // -------------------------------------------------------------------------
  // Chromosome Counter Discoveries
  // -------------------------------------------------------------------------

  /**
   * Player correctly identified haploid and diploid numbers for at least
   * 3 organisms.
   */
  chromosome_numbers_known: (state, history) => {
    if (!Array.isArray(history)) return false

    const correct = history.filter(
      (e) => e.type === 'chromosome-identification' && e.correct === true
    )

    const organisms = new Set(correct.map((c) => c.organism))
    return organisms.size >= 3
  },

  /**
   * Player recognised that gametes are haploid (n) while somatic cells
   * are diploid (2n).
   */
  haploid_diploid_understood: (state, history) => {
    if (!Array.isArray(history)) return false

    const identifications = history.filter(
      (e) => e.type === 'chromosome-identification' && e.correct === true
    )

    const haploidCorrect = identifications.some((i) => i.cellType === 'gamete' && i.ploidyLabel === 'haploid')
    const diploidCorrect = identifications.some((i) => i.cellType === 'somatic' && i.ploidyLabel === 'diploid')

    return haploidCorrect && diploidCorrect
  },

  // -------------------------------------------------------------------------
  // Generic Discoveries (applicable to all simulations)
  // -------------------------------------------------------------------------

  /**
   * Player has spent at least 30 seconds exploring the simulation.
   */
  time_explored: (state, _history) => {
    return (state.timeSpent || 0) >= 30
  },

  /**
   * Player has varied at least 3 parameters, indicating active exploration.
   */
  params_varied: (state, history) => {
    // Direct state check
    if ((state.paramChanges || 0) >= 3) return true

    // History-based check
    if (!Array.isArray(history)) return false
    const paramChanges = getParamChanges(history)

    // Count unique parameters changed
    const uniqueParams = new Set(paramChanges.map((p) => p.param))
    return uniqueParams.size >= 3
  },

  /**
   * Player has run at least 5 experiments / trials.
   */
  multiple_trials: (state, history) => {
    if ((state.trialCount || 0) >= 5) return true
    if (!Array.isArray(history)) return false

    const trials = history.filter(
      (e) => e.type === 'launch' || e.type === 'collision' || e.type === 'experiment' || e.type === 'trial'
    )
    return trials.length >= 5
  },

  /**
   * Player reset the simulation and re-ran with different parameters
   * (shows systematic investigation).
   */
  systematic_investigation: (state, history) => {
    if (!Array.isArray(history)) return false

    const resets = history.filter((e) => e.type === 'reset')
    const paramChanges = getParamChanges(history)

    // Player reset at least twice and changed parameters at least 3 times
    return resets.length >= 2 && paramChanges.length >= 3
  },
}

// ---------------------------------------------------------------------------
// Helper: Run all applicable checks for a given simulation
// ---------------------------------------------------------------------------

/**
 * Run a set of discovery checks against the current state and history.
 * @param {string[]} checkNames - Array of check names to run
 * @param {object} state - Current simulation state
 * @param {Array} history - Event history array
 * @returns {object} Map of check name -> boolean result
 */
export function runChecks(checkNames, state, history) {
  const results = {}
  for (const name of checkNames) {
    const fn = discoveryChecks[name]
    if (typeof fn === 'function') {
      try {
        results[name] = fn(state, history)
      } catch (err) {
        console.warn(`Discovery check "${name}" threw an error:`, err)
        results[name] = false
      }
    } else {
      console.warn(`Discovery check "${name}" not found in registry.`)
      results[name] = false
    }
  }
  return results
}

/**
 * Return only the checks that passed.
 */
export function getDiscoveries(checkNames, state, history) {
  const results = runChecks(checkNames, state, history)
  return Object.entries(results)
    .filter(([, passed]) => passed)
    .map(([name]) => name)
}

/**
 * Map of simulation type to the check names relevant for that simulation.
 */
export const simulationChecks = {
  'projectile-launcher': [
    'angle_at_max_range',
    'complementary_equal_range',
    'low_gravity_high_range',
    'time_explored',
    'params_varied',
    'multiple_trials',
    'systematic_investigation',
  ],
  'friction-ramp': [
    'critical_angle_found',
    'normal_decreases_with_angle',
    'time_explored',
    'params_varied',
    'systematic_investigation',
  ],
  'circular-orbit': [
    'larger_orbit_slower',
    'more_mass_faster',
    'time_explored',
    'params_varied',
  ],
  'collision-lab': [
    'equal_mass_transfer',
    'momentum_conserved',
    'kinetic_energy_conserved',
    'inelastic_stick_together',
    'time_explored',
    'params_varied',
    'multiple_trials',
  ],
  'periodic-trends': [
    'radius_decreases_across',
    'ie_increases_across',
    'en_increases_across',
    'radius_increases_down_group',
    'ie_decreases_down_group',
    'time_explored',
    'params_varied',
  ],
  'membrane-transport': [
    'diffusion_high_to_low',
    'channels_needed_for_large',
    'equilibrium_reached',
    'active_transport_against_gradient',
    'time_explored',
    'params_varied',
  ],
  'osmosis-lab': [
    'hypotonic_swelling',
    'hypertonic_shrinking',
    'isotonic_no_change',
    'plasmolysis_observed',
    'time_explored',
    'params_varied',
  ],
  'cell-cycle-clock': [
    'dna_doubles_in_s',
    'g1_is_longest',
    'm_phase_is_shortest',
    'time_explored',
  ],
  'electron-shell': [
    'aufbau_transition_metal',
    'aufbau_exception_found',
    'time_explored',
    'params_varied',
  ],
  'bond-polarity': [
    'en_difference_polarity',
    'time_explored',
    'params_varied',
  ],
  'mole-converter': [
    'mole_conversions_mastered',
    'time_explored',
  ],
  'motion-grapher': [
    'constant_acceleration_graphed',
    'area_under_vt_is_displacement',
    'time_explored',
    'params_varied',
  ],
  'velocity-racer': [
    'target_velocity_reached',
    'time_explored',
    'params_varied',
  ],
  'impulse-catcher': [
    'longer_time_less_force',
    'time_explored',
    'multiple_trials',
  ],
  'chromosome-counter': [
    'chromosome_numbers_known',
    'haploid_diploid_understood',
    'time_explored',
  ],
}
