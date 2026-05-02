export const momentumForgeStars = [
  // ========== STAR 1: Impulse and Momentum ==========
  {
    id: 'impulse-momentum',
    name: 'Impulse and Momentum',
    constellationId: 'momentum-forge',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['linear-momentum', 'impulse', 'impulse-momentum-theorem'],
    blocks: [
      {
        type: 'text',
        content: 'What makes a moving truck more dangerous than a moving bicycle at the same speed? What makes a bullet deadly despite its tiny mass? The answer is **momentum**: the product of mass and velocity. It captures the "quantity of motion" an object possesses.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'impulse-catcher',
        title: 'Impulse Explorer',
        description: 'Catch incoming objects with different stopping methods. See how collision time affects the force experienced. Discover why airbags and helmets save lives.',
        controls: [
          { param: 'mass', label: 'Object Mass', min: 0.1, max: 10, step: 0.1, default: 1, unit: 'kg' },
          { param: 'velocity', label: 'Object Speed', min: 5, max: 50, step: 1, default: 20, unit: 'm/s' },
          { param: 'stoppingTime', label: 'Stopping Time', min: 0.01, max: 2, step: 0.01, default: 0.1, unit: 's' },
        ],
        discoveries: [
          { id: 'longer-time-less-force', label: 'Longer stopping time means less force', hint: 'Compare stopping in 0.05s vs 1s' },
          { id: 'same-impulse', label: 'Impulse stays the same regardless of stopping time', hint: 'Check the impulse value for different stopping times' },
          { id: 'heavy-fast-big-impulse', label: 'Heavier or faster objects need more impulse to stop', hint: 'Increase mass or speed and check the impulse' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 5 },
      },
      {
        type: 'keyInsight',
        content: 'Airbags, crumple zones, and helmets all work by increasing collision time. Same change in momentum, but over a longer time, so the force is smaller. J = F\u0394t: if \u0394t increases and J stays the same, F decreases.'
      },
      {
        type: 'formula',
        title: 'Momentum and Impulse',
        formulas: [
          { label: 'Linear Momentum', formula: 'p = mv', note: 'Vector quantity. Units: kg\u00B7m/s' },
          { label: 'Impulse', formula: 'J = F \u00D7 \u0394t', note: 'Force applied over time. Units: N\u00B7s = kg\u00B7m/s' },
          { label: 'Impulse-Momentum Theorem', formula: 'J = \u0394p = mv - mu', note: 'Impulse equals change in momentum' }
        ]
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 0.5 kg ball moving at 10 m/s is caught and brought to rest in 0.1 s. What is the average force on the ball?',
        correctAnswer: 50,
        unit: 'N',
        explanation: '\u0394p = mv - mu = 0 - 0.5(10) = -5 kg\u00B7m/s. F = \u0394p/\u0394t = 5/0.1 = 50 N (magnitude).'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 60 kg person jumps from a wall and lands, stopping in 0.5 s. If they were falling at 6 m/s, what is the average force on their legs?',
        correctAnswer: 720,
        unit: 'N',
        explanation: '\u0394p = 0 - 60(6) = -360 kg\u00B7m/s. F = 360/0.5 = 720 N. (This is in addition to their weight during the stop.)'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'im-q1',
            question: 'A 2 kg ball moving at 5 m/s bounces back at 3 m/s after hitting a wall. What is the impulse on the ball?',
            type: 'number',
            correctAnswer: -16,
            unit: 'kg\u00B7m/s',
            explanation: 'Taking initial direction as positive: \u0394p = m(v - u) = 2(-3 - 5) = 2(-8) = -16 kg\u00B7m/s.'
          },
          {
            id: 'im-q2',
            question: 'A force of 100 N acts on a 5 kg object for 2 seconds. What is the change in velocity?',
            type: 'number',
            correctAnswer: 40,
            unit: 'm/s',
            explanation: 'J = F\u0394t = 100 \u00D7 2 = 200 N\u00B7s. \u0394v = J/m = 200/5 = 40 m/s.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Conservation of Momentum ==========
  {
    id: 'conservation-law',
    name: 'The Conservation Law',
    constellationId: 'momentum-forge',
    order: 2,
    duration: 10,
    xp: 20,
    concepts: ['conservation-of-momentum', 'isolated-system', 'recoil'],
    blocks: [
      {
        type: 'text',
        content: 'One of the most powerful principles in all of physics: in an **isolated system** (no external forces), the total momentum before an event equals the total momentum after. Momentum is conserved. This works for collisions, explosions, and any internal interaction.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'newtons-cradle',
        title: 'Newton\'s Cradle Lab',
        description: 'Experiment with a Newton\'s Cradle. Pull back different numbers of balls and observe how momentum is transferred. See conservation of momentum in its most elegant form.',
        controls: [
          { param: 'ballsReleased', label: 'Balls Released', min: 1, max: 4, step: 1, default: 1, unit: '' },
          { param: 'releaseHeight', label: 'Release Height', min: 1, max: 10, step: 0.5, default: 5, unit: 'cm' },
          { param: 'totalBalls', label: 'Total Balls', min: 3, max: 7, step: 1, default: 5, unit: '' },
        ],
        discoveries: [
          { id: 'one-in-one-out', label: 'One ball in = one ball out at the same speed', hint: 'Release one ball and watch the other side' },
          { id: 'two-in-two-out', label: 'Two balls in = two balls out (momentum + energy both conserved)', hint: 'Release two balls and count how many swing out' },
          { id: 'height-determines-speed', label: 'Higher release = greater speed and momentum', hint: 'Compare different release heights' },
          { id: 'momentum-transfers-through', label: 'Momentum transfers through intermediate balls without moving them', hint: 'Watch the middle balls during a collision' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 4 },
      },
      {
        type: 'keyInsight',
        content: 'Conservation of momentum works even when forces are involved, as long as those forces are INTERNAL to the system. External forces change the total momentum. That is why we need an "isolated system" (or analyze only the brief collision interval when external forces are negligible).'
      },
      {
        type: 'formula',
        title: 'Conservation of Linear Momentum',
        formulas: [
          { label: 'General form', formula: 'm1\u00D7u1 + m2\u00D7u2 = m1\u00D7v1 + m2\u00D7v2', note: 'Total momentum before = Total momentum after' },
          { label: 'Recoil (from rest)', formula: '0 = m1\u00D7v1 + m2\u00D7v2', note: 'Objects initially at rest push apart' }
        ]
      },
      {
        type: 'text',
        content: '**Recoil:** When a gun fires a bullet, the initial momentum is zero (both at rest). After firing: momentum of bullet + momentum of gun = 0. The gun recoils backward. The heavier the gun, the slower the recoil.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 4 kg gun fires a 0.05 kg bullet at 400 m/s. What is the recoil speed of the gun?',
        correctAnswer: 5,
        unit: 'm/s',
        explanation: '0 = m_gun \u00D7 v_gun + m_bullet \u00D7 v_bullet. 0 = 4 \u00D7 v_gun + 0.05 \u00D7 400. v_gun = -20/4 = -5 m/s. The gun recoils at 5 m/s.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 70 kg astronaut in space throws a 5 kg tool at 6 m/s. How fast does the astronaut move in the opposite direction?',
        correctAnswer: 0.43,
        unit: 'm/s',
        tolerance: 0.02,
        explanation: '0 = 70 \u00D7 v + 5 \u00D7 6. v = -30/70 = -0.43 m/s. The astronaut drifts at 0.43 m/s opposite to the throw.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'cl-q1',
            question: 'Two ice skaters (50 kg and 70 kg) push off each other from rest. If the lighter one moves at 7 m/s, how fast does the heavier one move?',
            type: 'number',
            correctAnswer: 5,
            unit: 'm/s',
            explanation: '0 = 50(7) + 70(v). v = -350/70 = -5 m/s. The heavier skater moves at 5 m/s in the opposite direction.'
          },
          {
            id: 'cl-q2',
            question: 'A 10 kg bomb at rest explodes into two pieces (3 kg and 7 kg). If the 3 kg piece moves at 14 m/s, how fast does the 7 kg piece move?',
            type: 'number',
            correctAnswer: 6,
            unit: 'm/s',
            explanation: '0 = 3(14) + 7(v). v = -42/7 = -6 m/s. The 7 kg piece moves at 6 m/s opposite.'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Elastic Collisions ==========
  {
    id: 'elastic-collisions',
    name: 'Elastic Collisions',
    constellationId: 'momentum-forge',
    order: 3,
    duration: 10,
    xp: 25,
    concepts: ['elastic-collision', 'kinetic-energy-conservation', 'head-on-elastic'],
    blocks: [
      {
        type: 'text',
        content: 'In an **elastic collision**, both momentum AND kinetic energy are conserved. No energy is lost to deformation, heat, or sound. Perfect elastic collisions are rare in everyday life but common at the atomic scale (gas molecule collisions).',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'collision-lab',
        title: 'Elastic Collision Lab',
        description: 'Set up elastic collisions between two objects. Control their masses and velocities, then observe the outcomes. Verify momentum and kinetic energy conservation.',
        controls: [
          { param: 'mass1', label: 'Mass 1', min: 1, max: 20, step: 1, default: 5, unit: 'kg' },
          { param: 'velocity1', label: 'Velocity 1', min: 1, max: 30, step: 1, default: 10, unit: 'm/s' },
          { param: 'mass2', label: 'Mass 2', min: 1, max: 20, step: 1, default: 5, unit: 'kg' },
          { param: 'velocity2', label: 'Velocity 2', min: -15, max: 15, step: 1, default: 0, unit: 'm/s' },
        ],
        discoveries: [
          { id: 'equal-mass-exchange', label: 'Equal masses exchange velocities', hint: 'Set both masses equal with one at rest' },
          { id: 'heavy-hits-light', label: 'Heavy object barely slows when hitting a light one at rest', hint: 'Set mass1 = 10, mass2 = 1, velocity2 = 0' },
          { id: 'light-bounces-back', label: 'Light object bounces back from a heavy stationary one', hint: 'Set mass1 = 1, mass2 = 10, velocity2 = 0' },
          { id: 'ke-conserved', label: 'Total kinetic energy before equals total after', hint: 'Compare the KE values displayed before and after collision' },
        ],
        completionCriteria: { requiredDiscoveries: 3, requiredLaunches: 5 },
      },
      {
        type: 'keyInsight',
        content: 'Special cases of elastic collisions:\n1. Equal masses: objects exchange velocities (billiard balls)\n2. Heavy hits light at rest: heavy barely slows, light moves at ~2\u00D7 heavy\'s speed\n3. Light hits heavy at rest: light bounces back at nearly same speed, heavy barely moves'
      },
      {
        type: 'formula',
        title: 'Elastic Collision (1D, head-on)',
        formulas: [
          { label: 'Momentum conservation', formula: 'm1\u00D7u1 + m2\u00D7u2 = m1\u00D7v1 + m2\u00D7v2', note: '' },
          { label: 'KE conservation', formula: '\u00BDm1u1\u00B2 + \u00BDm2u2\u00B2 = \u00BDm1v1\u00B2 + \u00BDm2v2\u00B2', note: '' },
          { label: 'Velocity of m1', formula: 'v1 = ((m1-m2)u1 + 2m2\u00D7u2)/(m1+m2)', note: 'Derived from both conservation laws' },
          { label: 'Velocity of m2', formula: 'v2 = ((m2-m1)u2 + 2m1\u00D7u1)/(m1+m2)', note: '' }
        ]
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 2 kg ball moving at 6 m/s hits a stationary 2 kg ball elastically. What is the velocity of the first ball after collision?',
        correctAnswer: 0,
        unit: 'm/s',
        explanation: 'Equal masses, elastic collision, target at rest: the first ball stops and the second moves at 6 m/s. They exchange velocities.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 1 kg ball moving at 10 m/s hits a stationary 3 kg ball elastically. What is the velocity of the 1 kg ball after collision?',
        correctAnswer: -5,
        unit: 'm/s',
        explanation: 'v1 = (m1-m2)u1/(m1+m2) = (1-3)(10)/(1+3) = -20/4 = -5 m/s. It bounces back at 5 m/s.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'In the same collision, what is the velocity of the 3 kg ball after?',
        correctAnswer: 5,
        unit: 'm/s',
        explanation: 'v2 = 2m1\u00D7u1/(m1+m2) = 2(1)(10)/4 = 5 m/s.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ec-q1',
            question: 'In an elastic collision, which quantities are conserved?',
            type: 'mcq',
            options: ['Only momentum', 'Only kinetic energy', 'Both momentum and kinetic energy', 'Neither'],
            correctAnswer: 2,
            explanation: 'Elastic collisions conserve both momentum and kinetic energy. This is what makes them "elastic."'
          },
          {
            id: 'ec-q2',
            question: 'A ball bounces off a wall elastically. If it hits at 5 m/s, it rebounds at:',
            type: 'number',
            correctAnswer: 5,
            unit: 'm/s',
            explanation: 'Wall is effectively infinite mass. Light hits heavy: bounces back at same speed. v1 = -u1 when m2 >> m1.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Inelastic Collisions ==========
  {
    id: 'inelastic-collisions',
    name: 'Inelastic Collisions',
    constellationId: 'momentum-forge',
    order: 4,
    duration: 10,
    xp: 25,
    concepts: ['inelastic-collision', 'perfectly-inelastic', 'coefficient-of-restitution', 'energy-loss'],
    blocks: [
      {
        type: 'text',
        content: 'Most real collisions are **inelastic**: momentum is conserved but kinetic energy is NOT. Some energy converts to heat, sound, or deformation. In a **perfectly inelastic** collision, the objects stick together, losing the maximum possible kinetic energy.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'collision-lab',
        title: 'Inelastic Collision Lab',
        description: 'Set up inelastic collisions and compare with elastic ones. Observe how kinetic energy is lost while momentum is still conserved. Explore the coefficient of restitution.',
        controls: [
          { param: 'mass1', label: 'Mass 1', min: 1, max: 20, step: 1, default: 5, unit: 'kg' },
          { param: 'velocity1', label: 'Velocity 1', min: 1, max: 30, step: 1, default: 8, unit: 'm/s' },
          { param: 'mass2', label: 'Mass 2', min: 1, max: 20, step: 1, default: 3, unit: 'kg' },
          { param: 'velocity2', label: 'Velocity 2', min: -15, max: 15, step: 1, default: 0, unit: 'm/s' },
          { param: 'restitution', label: 'Coefficient of Restitution (e)', min: 0, max: 1, step: 0.1, default: 0, unit: '' },
        ],
        discoveries: [
          { id: 'e-zero-stick-together', label: 'e = 0 means objects stick together (perfectly inelastic)', hint: 'Set e = 0 and observe both objects move with the same velocity after' },
          { id: 'e-one-elastic', label: 'e = 1 means no kinetic energy is lost (elastic)', hint: 'Set e = 1 and compare KE before and after' },
          { id: 'energy-loss-increases', label: 'Lower e means more kinetic energy is lost', hint: 'Compare KE loss at e = 0, e = 0.5, and e = 1' },
          { id: 'momentum-always-conserved', label: 'Momentum is conserved for all values of e', hint: 'Check total momentum before and after for different e values' },
        ],
        completionCriteria: { requiredDiscoveries: 3, requiredLaunches: 5 },
      },
      {
        type: 'challenge',
        simType: 'collision-challenge',
        title: 'Collision Outcome Predictor',
        description: 'Given the masses, velocities, and collision type, predict the final velocities and energy loss. Test your understanding of elastic vs inelastic collisions.',
        objective: 'Correctly predict collision outcomes for 5 different scenarios',
        targetScore: 70,
        config: { rounds: 5, includeElastic: true, includeInelastic: true },
      },
      {
        type: 'keyInsight',
        content: 'In a perfectly inelastic collision, the maximum possible fraction of KE lost is m2/(m1+m2) when m2 is at rest. For equal masses sticking together, exactly 50% of KE is lost.'
      },
      {
        type: 'formula',
        title: 'Perfectly Inelastic Collision',
        formulas: [
          { label: 'Objects stick together', formula: 'm1\u00D7u1 + m2\u00D7u2 = (m1+m2)\u00D7v', note: 'Both move with same velocity v after collision' },
          { label: 'Final velocity', formula: 'v = (m1\u00D7u1 + m2\u00D7u2) / (m1+m2)', note: '' }
        ]
      },
      {
        type: 'text',
        content: '**Coefficient of Restitution (e):** Measures the "bounciness" of a collision.\n- e = 1: perfectly elastic (no energy loss)\n- 0 < e < 1: inelastic (some energy lost)\n- e = 0: perfectly inelastic (objects stick together)\n\nFormula: e = (relative speed after) / (relative speed before) = (v2 - v1) / (u1 - u2)',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 5 kg ball moving at 8 m/s collides with a stationary 3 kg ball and they stick together. What is their common velocity?',
        correctAnswer: 5,
        unit: 'm/s',
        explanation: 'v = (m1\u00D7u1 + m2\u00D7u2)/(m1+m2) = (5\u00D78 + 3\u00D70)/(5+3) = 40/8 = 5 m/s.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'What fraction of kinetic energy is lost in the above collision?',
        correctAnswer: 37.5,
        unit: '%',
        explanation: 'KE_i = \u00BD(5)(64) = 160 J. KE_f = \u00BD(8)(25) = 100 J. Lost = 60 J. Fraction = 60/160 = 0.375 = 37.5%.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ic-q1',
            question: 'A 10 g bullet embeds in a 2 kg wooden block at rest. The bullet\'s speed was 400 m/s. What is the block+bullet speed?',
            type: 'number',
            correctAnswer: 1.99,
            unit: 'm/s',
            tolerance: 0.05,
            explanation: 'v = (0.01 \u00D7 400)/(0.01 + 2) = 4/2.01 \u2248 1.99 m/s.'
          },
          {
            id: 'ic-q2',
            question: 'What is the coefficient of restitution for a perfectly elastic collision?',
            type: 'number',
            correctAnswer: 1,
            unit: '',
            explanation: 'e = 1 for perfectly elastic. Objects bounce apart with no energy loss.'
          },
          {
            id: 'ic-q3',
            question: 'Two equal mass balls collide. Ball 1 moves at 10 m/s, Ball 2 at rest. After collision, Ball 1 moves at 3 m/s in the same direction. What is e?',
            type: 'number',
            correctAnswer: 0.7,
            unit: '',
            explanation: 'By momentum: m(10) = m(3) + m(v2) \u2192 v2 = 7 m/s. e = (v2-v1)/(u1-u2) = (7-3)/(10-0) = 4/10 = 0.4. Wait: e = (separation speed)/(approach speed) = (7-3)/10 = 0.4. Hmm let me recalculate: relative velocity of separation = v2-v1 = 7-3 = 4. Relative velocity of approach = u1-u2 = 10-0 = 10. e = 4/10 = 0.4.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Center of Mass ==========
  {
    id: 'center-of-mass',
    name: 'Center of Mass',
    constellationId: 'momentum-forge',
    order: 5,
    duration: 10,
    xp: 25,
    concepts: ['center-of-mass', 'com-velocity', 'com-motion', 'internal-forces'],
    blocks: [
      {
        type: 'text',
        content: 'Every system of particles has a special point called the **Center of Mass (COM)**. It is the average position of all the mass in the system. The beauty of COM: it moves as if ALL the system\'s mass were concentrated there and ALL external forces acted on it.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'collision-lab',
        title: 'Center of Mass Tracker',
        description: 'Watch two objects collide while tracking their center of mass. See that the COM velocity stays constant through any collision, proving momentum conservation.',
        controls: [
          { param: 'mass1', label: 'Mass 1', min: 1, max: 15, step: 1, default: 3, unit: 'kg' },
          { param: 'velocity1', label: 'Velocity 1', min: -20, max: 20, step: 1, default: 6, unit: 'm/s' },
          { param: 'mass2', label: 'Mass 2', min: 1, max: 15, step: 1, default: 5, unit: 'kg' },
          { param: 'velocity2', label: 'Velocity 2', min: -20, max: 20, step: 1, default: -3, unit: 'm/s' },
        ],
        discoveries: [
          { id: 'com-constant-velocity', label: 'COM velocity stays constant through a collision', hint: 'Watch the COM marker before, during, and after collision' },
          { id: 'com-closer-to-heavy', label: 'COM is always closer to the heavier object', hint: 'Set very different masses and observe COM position' },
          { id: 'com-stationary-possible', label: 'COM can be stationary if momenta are equal and opposite', hint: 'Set m1*v1 = -m2*v2' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 4 },
      },
      {
        type: 'keyInsight',
        content: 'Internal forces (like forces between colliding objects) do NOT affect the motion of the COM. If no external forces act, the COM velocity is constant. This is just conservation of momentum stated differently: p_total = M \u00D7 v_cm = constant.'
      },
      {
        type: 'formula',
        title: 'Center of Mass',
        formulas: [
          { label: 'Position (2 objects)', formula: 'x_cm = (m1\u00D7x1 + m2\u00D7x2) / (m1 + m2)', note: 'Weighted average of positions' },
          { label: 'Velocity of COM', formula: 'v_cm = (m1\u00D7v1 + m2\u00D7v2) / (m1 + m2)', note: 'Also: v_cm = p_total / M_total' },
          { label: 'Acceleration of COM', formula: 'a_cm = F_external / M_total', note: 'Only external forces affect COM motion' }
        ]
      },
      {
        type: 'text',
        content: '**Application:** A bomb explodes in midair. Even though the pieces fly apart, the COM of all the pieces continues on the same parabolic path the bomb was following (gravity is the only external force). Internal explosion forces don\'t change COM motion.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 3 kg mass is at x = 2m and a 5 kg mass is at x = 6m. Where is the center of mass?',
        correctAnswer: 4.5,
        unit: 'm',
        explanation: 'x_cm = (3\u00D72 + 5\u00D76)/(3+5) = (6+30)/8 = 36/8 = 4.5m. The COM is closer to the heavier mass.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 2 kg object moves at 6 m/s right and a 4 kg object moves at 3 m/s left. What is the COM velocity? (Right = positive)',
        correctAnswer: 0,
        unit: 'm/s',
        explanation: 'v_cm = (2\u00D76 + 4\u00D7(-3))/(2+4) = (12-12)/6 = 0 m/s. The COM is stationary.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'com-q1',
            question: 'Two objects (1 kg at origin, 4 kg at x = 10m) are connected by a spring on a frictionless surface. Where is the COM?',
            type: 'number',
            correctAnswer: 8,
            unit: 'm',
            explanation: 'x_cm = (1\u00D70 + 4\u00D710)/(1+4) = 40/5 = 8m.'
          },
          {
            id: 'com-q2',
            question: 'A firecracker (5 kg) is thrown up and explodes into two pieces at its highest point. If the COM was at height 20m at that instant, what is the COM height 1s later? (g = 10 m/s\u00B2)',
            type: 'number',
            correctAnswer: 15,
            unit: 'm',
            explanation: 'COM continues as if no explosion. At highest point, v_cm = 0. After 1s: h = 20 + 0 - \u00BD(10)(1) = 20 - 5 = 15m.'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Momentum Forge Mastery ==========
  {
    id: 'momentum-mastery',
    name: 'Momentum Forge Mastery',
    constellationId: 'momentum-forge',
    order: 6,
    duration: 8,
    xp: 30,
    concepts: ['momentum-review', 'combined-problems', 'ballistic-pendulum'],
    blocks: [
      {
        type: 'text',
        content: 'The final forge. Here we combine impulse, conservation of momentum, elastic and inelastic collisions, and center of mass into complex, multi-step problems. The ballistic pendulum is a classic example that uses both collision physics and energy conservation.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'impulse-catcher',
        title: 'Impulse Catcher Challenge',
        description: 'Incoming projectiles of different masses and speeds. Adjust your catching mechanism to minimize the force experienced. Prove you understand the impulse-momentum theorem.',
        objective: 'Keep peak force below the damage threshold for 5 consecutive catches',
        targetScore: 75,
        config: { rounds: 5, maxForceThreshold: 100 },
      },
      {
        type: 'simulation',
        simType: 'newtons-cradle',
        title: 'Momentum Mastery Cradle',
        description: 'A final Newton\'s Cradle experiment combining everything: conservation of momentum, elastic collisions, and energy transfer. Predict outcomes before running each trial.',
        controls: [
          { param: 'ballsReleased', label: 'Balls Released', min: 1, max: 4, step: 1, default: 2, unit: '' },
          { param: 'releaseHeight', label: 'Release Height', min: 1, max: 10, step: 0.5, default: 5, unit: 'cm' },
          { param: 'totalBalls', label: 'Total Balls', min: 3, max: 7, step: 1, default: 5, unit: '' },
        ],
        discoveries: [
          { id: 'n-in-n-out', label: 'n balls in always gives n balls out at the same speed', hint: 'Try releasing 1, 2, and 3 balls' },
          { id: 'energy-and-momentum-both-required', label: 'Both momentum AND energy conservation explain why n-in gives n-out', hint: 'Think: could 1 ball go out at double speed instead of 2 balls? Check if that conserves both.' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 4 },
      },
      {
        type: 'formula',
        title: 'Ballistic Pendulum',
        formulas: [
          { label: 'Step 1: Collision', formula: 'm\u00D7v = (m+M)\u00D7V', note: 'm = bullet, M = block, V = speed after embedding' },
          { label: 'Step 2: Swing', formula: '\u00BD(m+M)V\u00B2 = (m+M)gh', note: 'KE converts to PE at max height' },
          { label: 'Combined', formula: 'v = ((m+M)/m) \u00D7 \u221A(2gh)', note: 'Find bullet speed from measured height' }
        ]
      },
      {
        type: 'text',
        content: '**Ballistic Pendulum:** A bullet embeds in a block suspended by strings. The block+bullet swings upward. Step 1: Collision (conserve momentum, not energy). Step 2: Swing upward (conserve energy, not momentum, since gravity acts).',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 10 g bullet embeds in a 2 kg pendulum block. The block swings up 0.2m. What was the bullet speed? (g = 10 m/s\u00B2)',
        correctAnswer: 402,
        unit: 'm/s',
        tolerance: 2,
        explanation: 'V = \u221A(2gh) = \u221A(2\u00D710\u00D70.2) = \u221A4 = 2 m/s. v = ((0.01+2)/0.01) \u00D7 2 = 201 \u00D7 2 = 402 m/s.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A 3 kg ball moving at 4 m/s collides elastically with a 1 kg ball at rest. What is the speed of the 1 kg ball after collision?',
        correctAnswer: 6,
        unit: 'm/s',
        explanation: 'v2 = 2m1\u00D7u1/(m1+m2) = 2(3)(4)/(3+1) = 24/4 = 6 m/s.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mm-q1',
            question: 'A 1000 kg car at 20 m/s rear-ends a 2000 kg truck at 10 m/s (same direction). They lock together. What is their common speed?',
            type: 'number',
            correctAnswer: 13.33,
            unit: 'm/s',
            tolerance: 0.05,
            explanation: 'v = (1000\u00D720 + 2000\u00D710)/(1000+2000) = (20000+20000)/3000 = 40000/3000 = 13.33 m/s.'
          },
          {
            id: 'mm-q2',
            question: 'In the above collision, how much kinetic energy was lost?',
            type: 'number',
            correctAnswer: 33333,
            unit: 'J',
            tolerance: 100,
            explanation: 'KE_i = \u00BD(1000)(400) + \u00BD(2000)(100) = 200000 + 100000 = 300000 J. KE_f = \u00BD(3000)(177.78) = 266667 J. Lost \u2248 33333 J.'
          },
          {
            id: 'mm-q3',
            question: 'A rocket (1000 kg) ejects 10 kg of gas at 500 m/s relative to the rocket. What is the change in rocket speed?',
            type: 'number',
            correctAnswer: 5.05,
            unit: 'm/s',
            tolerance: 0.1,
            explanation: 'By momentum conservation: 0 = (1000-10)\u0394v - 10\u00D7500. 990\u0394v = 5000. \u0394v = 5000/990 \u2248 5.05 m/s.'
          }
        ]
      }
    ]
  }
];
