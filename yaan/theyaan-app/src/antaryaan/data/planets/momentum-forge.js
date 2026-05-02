// Momentum Forge - Work, Energy, Power, Momentum & Collisions practice planets
// Topics: work-energy theorem, conservation of energy, power, impulse, momentum, collisions
// g = 10 m/s² for all calculations

export const momentumForgePlanets = [
  // ==================== PLANET 1: Collision Arena ====================
  {
    id: 'collision-arena',
    name: 'Collision Arena',
    constellationId: 'momentum-forge',
    order: 1,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'mf1-1',
        type: 'numerical',
        difficulty: 2,
        text: 'A force of 10 N displaces a block by 5 m along the direction of the force. What is the work done by the force?',
        correctAnswer: 50,
        unit: 'J',
        hint: 'Work = Force x displacement x cos\u03B8, where \u03B8 is the angle between force and displacement.',
        steps: [
          'Force F = 10 N, displacement s = 5 m',
          'Force is along displacement, so \u03B8 = 0\u00B0',
          'W = Fs cos 0\u00B0 = 10 x 5 x 1 = 50 J'
        ],
        solution: 'W = Fd cos\u03B8 = 10 x 5 x cos 0\u00B0 = 50 J.',
        concepts: ['work']
      },
      {
        id: 'mf1-2',
        type: 'mcq',
        difficulty: 2,
        text: 'A ball of mass 0.5 kg moving at 4 m/s collides head-on with a stationary ball of mass 0.5 kg. If the collision is perfectly elastic, what happens?',
        options: [
          'Both balls move at 2 m/s in the same direction',
          'The first ball stops and the second moves at 4 m/s',
          'Both balls move at 4 m/s in opposite directions',
          'The first ball bounces back at 4 m/s and the second remains at rest'
        ],
        correctIndex: 1,
        hint: 'In a perfectly elastic collision between equal masses, the velocities are exchanged.',
        steps: [
          'For elastic collision between equal masses (m\u2081 = m\u2082):',
          'v\u2081 = u\u2082 (first ball takes the velocity of the second)',
          'v\u2082 = u\u2081 (second ball takes the velocity of the first)',
          'Since u\u2082 = 0: v\u2081 = 0, v\u2082 = 4 m/s'
        ],
        solution: 'In a head-on elastic collision between equal masses, velocities are exchanged. The moving ball stops, and the stationary ball moves with the original velocity.',
        concepts: ['elastic-collisions', 'conservation-of-momentum']
      },
      {
        id: 'mf1-3',
        type: 'numerical',
        difficulty: 3,
        text: 'A 2 kg block slides down a frictionless incline from a height of 5 m. What is its speed at the bottom? (g = 10 m/s\u00B2)',
        correctAnswer: 10,
        unit: 'm/s',
        hint: 'Use conservation of energy: potential energy at top = kinetic energy at bottom.',
        steps: [
          'At the top: KE = 0, PE = mgh = 2(10)(5) = 100 J',
          'At the bottom: PE = 0, KE = (1/2)mv\u00B2',
          'By conservation: 100 = (1/2)(2)v\u00B2 = v\u00B2',
          'v = 10 m/s'
        ],
        solution: 'mgh = (1/2)mv\u00B2. v = \u221A(2gh) = \u221A(2 x 10 x 5) = \u221A100 = 10 m/s. Note: the answer is independent of mass!',
        similarExample: 'From height 20 m: v = \u221A(2 x 10 x 20) = 20 m/s.',
        concepts: ['conservation-of-energy']
      },
      {
        id: 'mf1-4',
        type: 'numerical',
        difficulty: 3,
        text: 'A bullet of mass 20 g moving at 200 m/s embeds itself in a stationary wooden block of mass 980 g. What is the velocity of the block-bullet system after the collision?',
        correctAnswer: 4,
        unit: 'm/s',
        hint: 'This is a perfectly inelastic collision (bullet embeds). Use conservation of momentum.',
        steps: [
          'Convert: m_bullet = 0.02 kg, m_block = 0.98 kg',
          'Initial momentum = 0.02 x 200 + 0.98 x 0 = 4 kg\u00B7m/s',
          'After collision (combined): (0.02 + 0.98) x v = 4',
          '1.0 x v = 4',
          'v = 4 m/s'
        ],
        solution: 'By conservation of momentum: 0.02(200) = (0.02 + 0.98)v. So v = 4/1 = 4 m/s.',
        concepts: ['inelastic-collisions', 'conservation-of-momentum']
      },
      {
        id: 'mf1-5',
        type: 'mcq',
        difficulty: 3,
        text: 'In which type of collision is kinetic energy conserved?',
        options: [
          'Perfectly inelastic collision only',
          'Perfectly elastic collision only',
          'Both elastic and inelastic collisions',
          'Neither elastic nor inelastic collisions'
        ],
        correctIndex: 1,
        hint: 'Momentum is conserved in ALL collisions. But kinetic energy is only conserved in a special type.',
        solution: 'Kinetic energy is conserved ONLY in perfectly elastic collisions. In inelastic collisions, some KE is converted to heat, sound, or deformation. Momentum is conserved in all collisions (when no external force acts).',
        concepts: ['elastic-collisions', 'inelastic-collisions']
      },
      {
        id: 'mf1-6',
        type: 'numerical',
        difficulty: 3,
        text: 'A force is applied on a 4 kg object initially at rest. If the object attains a velocity of 6 m/s in 3 seconds, what is the impulse delivered to the object?',
        correctAnswer: 24,
        unit: 'N\u00B7s',
        hint: 'Impulse = change in momentum = final momentum - initial momentum.',
        steps: [
          'Initial momentum = 4 x 0 = 0 kg\u00B7m/s',
          'Final momentum = 4 x 6 = 24 kg\u00B7m/s',
          'Impulse = \u0394p = 24 - 0 = 24 N\u00B7s'
        ],
        solution: 'Impulse = \u0394p = mv - mu = 4(6) - 4(0) = 24 N\u00B7s. Alternatively, impulse = F\u0394t = ma\u0394t = 4(2)(3) = 24 N\u00B7s.',
        concepts: ['impulse', 'momentum']
      },
      {
        id: 'mf1-7',
        type: 'match',
        difficulty: 2,
        text: 'Match each collision type with its defining property.',
        leftColumn: [
          'Perfectly elastic collision',
          'Perfectly inelastic collision',
          'Inelastic collision (general)',
          'Explosion (reverse collision)'
        ],
        rightColumn: [
          'Objects stick together; maximum KE loss',
          'Both momentum and KE are conserved',
          'Total momentum is zero before, objects fly apart after',
          'Momentum conserved but KE is not'
        ],
        correctMatches: { 0: 1, 1: 0, 2: 3, 3: 2 },
        hint: 'In a perfectly inelastic collision, the objects stick together (maximum KE loss). An explosion is the reverse of a perfectly inelastic collision.',
        solution: 'Elastic: both p and KE conserved. Perfectly inelastic: objects stick, max KE loss. General inelastic: p conserved, KE not. Explosion: objects separate from rest, momentum = 0 throughout.',
        concepts: ['collisions', 'conservation-of-momentum']
      }
    ]
  },

  // ==================== PLANET 2: Impulse Training ====================
  {
    id: 'impulse-training',
    name: 'Impulse Training',
    constellationId: 'momentum-forge',
    order: 2,
    difficulty: 4,
    xp: 30,
    problems: [
      {
        id: 'mf2-1',
        type: 'numerical',
        difficulty: 3,
        text: 'A 1000 kg car moving at 20 m/s brakes and comes to rest in 10 seconds. What is the average braking force?',
        correctAnswer: 2000,
        unit: 'N',
        hint: 'Use impulse-momentum theorem: F\u0394t = \u0394p.',
        steps: [
          'Change in momentum = m(v - u) = 1000(0 - 20) = -20000 kg\u00B7m/s',
          'Impulse = F\u0394t = \u0394p',
          'F(10) = -20000',
          'F = -2000 N (negative means opposing motion)',
          'Magnitude of braking force = 2000 N'
        ],
        solution: 'F = \u0394p/\u0394t = 1000(20)/10 = 2000 N.',
        concepts: ['impulse', 'momentum']
      },
      {
        id: 'mf2-2',
        type: 'numerical',
        difficulty: 4,
        text: 'A pump lifts 200 kg of water per minute to a height of 15 m. What is the minimum power of the pump in watts? (g = 10 m/s\u00B2)',
        correctAnswer: 500,
        unit: 'W',
        hint: 'Power = work done per unit time = mgh/t.',
        steps: [
          'Work done in lifting = mgh = 200 x 10 x 15 = 30000 J',
          'Time = 1 minute = 60 s',
          'Power = 30000/60 = 500 W'
        ],
        solution: 'P = mgh/t = 200(10)(15)/60 = 30000/60 = 500 W.',
        concepts: ['power', 'work']
      },
      {
        id: 'mf2-3',
        type: 'mcq',
        difficulty: 4,
        text: 'A ball of mass 1 kg moving at 10 m/s hits a wall and bounces back with 8 m/s. What is the coefficient of restitution?',
        options: ['0.2', '0.5', '0.8', '1.0'],
        correctIndex: 2,
        hint: 'The coefficient of restitution e = (relative velocity of separation) / (relative velocity of approach). The wall is stationary.',
        steps: [
          'Velocity of approach of ball = 10 m/s (toward wall)',
          'Velocity of separation of ball = 8 m/s (away from wall)',
          'Wall velocity = 0 before and after',
          'e = (velocity of separation) / (velocity of approach) = 8/10 = 0.8'
        ],
        solution: 'e = speed of separation / speed of approach = 8/10 = 0.8.',
        concepts: ['restitution', 'collisions']
      },
      {
        id: 'mf2-4',
        type: 'numerical',
        difficulty: 4,
        text: 'A spring of spring constant 500 N/m is compressed by 0.1 m. A block of mass 1 kg is placed against it and released. What is the speed of the block when it leaves the spring on a frictionless surface?',
        correctAnswer: 2.24,
        unit: 'm/s',
        hint: 'The elastic potential energy of the spring converts to kinetic energy: (1/2)kx\u00B2 = (1/2)mv\u00B2.',
        steps: [
          'Spring PE = (1/2)(500)(0.1)\u00B2 = (1/2)(500)(0.01) = 2.5 J',
          'This converts to KE: (1/2)(1)v\u00B2 = 2.5',
          'v\u00B2 = 5',
          'v = \u221A5 \u2248 2.236 m/s'
        ],
        solution: '(1/2)kx\u00B2 = (1/2)mv\u00B2. v = x\u221A(k/m) = 0.1\u221A(500/1) = 0.1 x 22.36 = 2.236 m/s.',
        concepts: ['conservation-of-energy', 'spring-potential-energy']
      },
      {
        id: 'mf2-5',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following statements about the work-energy theorem are correct?',
        options: [
          'Net work done on a body equals the change in its kinetic energy',
          'Work done by all forces (conservative + non-conservative) equals change in KE',
          'Work done by conservative forces equals change in potential energy',
          'Work done by gravity on a body moving in a closed path is zero',
          'The work-energy theorem applies only to constant forces'
        ],
        correctIndices: [0, 1, 3],
        hint: 'The work-energy theorem states W_net = \u0394KE. Also recall properties of conservative forces.',
        solution: '(A) and (B) are the same statement: W_net = \u0394KE. (C) is incorrect: work done by conservative forces = NEGATIVE of change in PE. (D) Gravity is conservative, so work in a closed loop = 0. (E) is wrong: the theorem applies to ALL forces.',
        concepts: ['work-energy-theorem', 'conservative-forces']
      },
      {
        id: 'mf2-6',
        type: 'numerical',
        difficulty: 4,
        text: 'Two balls A (mass 2 kg, velocity 3 m/s) and B (mass 3 kg, velocity -2 m/s) collide head-on elastically. What is the velocity of ball A after the collision?',
        correctAnswer: -3.4,
        unit: 'm/s',
        hint: 'For elastic collision: v\u2081 = [(m\u2081-m\u2082)u\u2081 + 2m\u2082u\u2082]/(m\u2081+m\u2082).',
        steps: [
          'Using the elastic collision formula:',
          'v_A = [(m_A - m_B)u_A + 2m_B u_B] / (m_A + m_B)',
          'v_A = [(2-3)(3) + 2(3)(-2)] / (2+3)',
          'v_A = [(-3) + (-12)] / 5',
          'v_A = -15/5 = -3 m/s'
        ],
        solution: 'v_A = [(2-3)(3) + 2(3)(-2)] / (2+3) = (-3-12)/5 = -3 m/s. Ball A bounces back at 3 m/s.',
        concepts: ['elastic-collisions']
      },
      {
        id: 'mf2-7',
        type: 'numerical',
        difficulty: 4,
        text: 'A body of mass 5 kg is moving with velocity 10 m/s. A force is applied for 5 seconds, which increases its velocity to 20 m/s. Find the work done by the force.',
        correctAnswer: 750,
        unit: 'J',
        hint: 'Use the work-energy theorem: W = \u0394KE = (1/2)mv\u00B2 - (1/2)mu\u00B2.',
        steps: [
          'Initial KE = (1/2)(5)(10)\u00B2 = 250 J',
          'Final KE = (1/2)(5)(20)\u00B2 = 1000 J',
          'Work done = \u0394KE = 1000 - 250 = 750 J'
        ],
        solution: 'W = (1/2)m(v\u00B2 - u\u00B2) = (1/2)(5)(400 - 100) = (1/2)(5)(300) = 750 J.',
        concepts: ['work-energy-theorem']
      },
      {
        id: 'mf2-8',
        type: 'match',
        difficulty: 3,
        text: 'Match each quantity with its SI unit.',
        leftColumn: ['Work', 'Power', 'Momentum', 'Impulse'],
        rightColumn: ['kg\u00B7m/s', 'J (joule)', 'N\u00B7s', 'W (watt)'],
        correctMatches: { 0: 1, 1: 3, 2: 0, 3: 2 },
        hint: 'Momentum = mass x velocity, impulse = force x time. Note that N\u00B7s = kg\u00B7m/s (they are equivalent).',
        solution: 'Work: J (joule = N\u00B7m). Power: W (watt = J/s). Momentum: kg\u00B7m/s. Impulse: N\u00B7s. Note: momentum and impulse have the same dimensions (kg\u00B7m/s = N\u00B7s), but we match them to the conventionally listed units.',
        concepts: ['units', 'work', 'power', 'momentum', 'impulse']
      }
    ]
  }
];
