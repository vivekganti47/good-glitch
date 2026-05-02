// Force Nexus - Laws of Motion practice planets
// Topics: Newton's laws, friction, circular motion, connected bodies, free body diagrams
// g = 10 m/s² for all calculations

export const forceNexusPlanets = [
  // ==================== PLANET 1: Law Enforcement ====================
  {
    id: 'law-enforcement',
    name: 'Law Enforcement',
    constellationId: 'force-nexus',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'fn1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'A book rests on a table. Which of the following correctly identifies the Newton\'s Third Law pair for the gravitational force (weight) acting on the book?',
        options: [
          'The normal force from the table on the book',
          'The gravitational pull of the book on the Earth',
          'The friction force between the book and table',
          'The weight of the table'
        ],
        correctIndex: 1,
        hint: 'Newton\'s Third Law pairs act on DIFFERENT objects. The weight is the Earth pulling the book. The reaction must be the book pulling the Earth.',
        steps: [
          'Weight of book = Earth pulls book downward',
          'Third law pair = book pulls Earth upward',
          'The normal force is NOT the third law pair of weight (they act on the same object: the book)'
        ],
        solution: 'The weight is Earth pulling the book. By Newton\'s Third Law, the reaction is the book pulling the Earth with equal force upward. The normal force balances the weight but is NOT its Third Law pair.',
        similarExample: 'When you push a wall, the wall pushes you back. Both forces are on different objects.',
        concepts: ['newtons-laws', 'third-law-pairs']
      },
      {
        id: 'fn1-2',
        type: 'numerical',
        difficulty: 2,
        text: 'A 5 kg block is pushed along a frictionless surface by a horizontal force of 20 N. What is the acceleration of the block?',
        correctAnswer: 4,
        unit: 'm/s\u00B2',
        hint: 'Use Newton\'s Second Law: F = ma.',
        steps: [
          'Net force on the block = 20 N (frictionless, so no opposing force)',
          'F = ma',
          '20 = 5 x a',
          'a = 4 m/s\u00B2'
        ],
        solution: 'F = ma. 20 = 5a, so a = 4 m/s\u00B2.',
        concepts: ['newtons-laws', 'second-law-fma']
      },
      {
        id: 'fn1-3',
        type: 'numerical',
        difficulty: 3,
        text: 'A 10 kg block is placed on a horizontal surface with coefficient of kinetic friction \u03BC_k = 0.3. A horizontal force of 50 N is applied. What is the acceleration? (g = 10 m/s\u00B2)',
        correctAnswer: 2,
        unit: 'm/s\u00B2',
        hint: 'First calculate the friction force: f = \u03BC_k x N, where N = mg on a horizontal surface.',
        steps: [
          'Normal force N = mg = 10 x 10 = 100 N',
          'Friction force f = \u03BC_k x N = 0.3 x 100 = 30 N',
          'Net force = 50 - 30 = 20 N',
          'a = F_net / m = 20 / 10 = 2 m/s\u00B2'
        ],
        solution: 'N = mg = 100 N. Friction = 0.3 x 100 = 30 N. Net force = 50 - 30 = 20 N. Acceleration = 20/10 = 2 m/s\u00B2.',
        similarExample: 'A 5 kg block with \u03BC_k = 0.2 and applied force 20 N: friction = 0.2 x 50 = 10 N, net = 10 N, a = 2 m/s\u00B2.',
        concepts: ['friction', 'newtons-laws']
      },
      {
        id: 'fn1-4',
        type: 'mcq',
        difficulty: 2,
        text: 'A block is at rest on an inclined plane. As the angle of inclination is gradually increased, the block begins to slide at 30\u00B0. What is the coefficient of static friction?',
        options: ['0.50', '0.577', '0.866', '0.333'],
        correctIndex: 1,
        hint: 'At the angle of repose, the component of gravity along the plane equals the maximum static friction force. This gives \u03BC_s = tan\u03B8.',
        steps: [
          'At the angle of repose \u03B8, mg sin\u03B8 = \u03BC_s mg cos\u03B8',
          '\u03BC_s = tan\u03B8 = tan 30\u00B0',
          '\u03BC_s = 1/\u221A3 \u2248 0.577'
        ],
        solution: 'At the angle of repose: \u03BC_s = tan 30\u00B0 = 1/\u221A3 \u2248 0.577.',
        concepts: ['friction', 'inclined-plane']
      },
      {
        id: 'fn1-5',
        type: 'match',
        difficulty: 2,
        text: 'Match each Newton\'s Law with its correct statement.',
        leftColumn: [
          'First Law (Inertia)',
          'Second Law',
          'Third Law'
        ],
        rightColumn: [
          'Every action has an equal and opposite reaction',
          'F_net = ma',
          'An object remains in its state unless acted upon by a net external force'
        ],
        correctMatches: { 0: 2, 1: 1, 2: 0 },
        hint: 'The First Law is about inertia (no change without force), the Second Law quantifies force, and the Third Law is about action-reaction pairs.',
        solution: 'First Law: objects stay at rest or in uniform motion unless a net force acts. Second Law: F = ma (force causes acceleration). Third Law: forces come in equal and opposite pairs on different objects.',
        concepts: ['newtons-laws']
      },
      {
        id: 'fn1-6',
        type: 'numerical',
        difficulty: 3,
        text: 'Two blocks of masses 3 kg and 5 kg are connected by a light string over a frictionless pulley (Atwood machine). What is the acceleration of the system? (g = 10 m/s\u00B2)',
        correctAnswer: 2.5,
        unit: 'm/s\u00B2',
        hint: 'For an Atwood machine: a = (m\u2082 - m\u2081)g / (m\u2081 + m\u2082), where m\u2082 > m\u2081.',
        steps: [
          'Net force = (5 - 3) x 10 = 20 N',
          'Total mass = 5 + 3 = 8 kg',
          'a = 20/8 = 2.5 m/s\u00B2'
        ],
        solution: 'a = (m\u2082 - m\u2081)g/(m\u2081 + m\u2082) = (5-3)(10)/(5+3) = 20/8 = 2.5 m/s\u00B2.',
        similarExample: 'For 4 kg and 6 kg: a = (6-4)(10)/(6+4) = 20/10 = 2 m/s\u00B2.',
        concepts: ['newtons-laws', 'connected-bodies']
      },
      {
        id: 'fn1-7',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'A person stands in a lift. In which of the following cases does the person feel heavier than usual (apparent weight > mg)?',
        options: [
          'Lift accelerating upward',
          'Lift accelerating downward',
          'Lift moving upward with constant velocity',
          'Lift in free fall',
          'Lift decelerating while going down'
        ],
        correctIndices: [0, 4],
        hint: 'Apparent weight = m(g + a) when acceleration is upward and m(g - a) when downward. Think about the net acceleration direction.',
        solution: 'Apparent weight > mg when the net acceleration has an upward component. (A) Lift accelerating up: a is upward, so apparent weight = m(g+a) > mg. (E) Lift decelerating while going down means acceleration is upward (opposing downward motion), so apparent weight = m(g+a) > mg. (B) gives lighter, (C) gives normal, (D) gives weightlessness.',
        concepts: ['newtons-laws', 'apparent-weight']
      }
    ]
  },

  // ==================== PLANET 2: Friction Fields ====================
  {
    id: 'friction-fields',
    name: 'Friction Fields',
    constellationId: 'force-nexus',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'fn2-1',
        type: 'numerical',
        difficulty: 3,
        text: 'A 2 kg block is placed on a rough incline of angle 37\u00B0 (\u03BC_k = 0.25). If the block slides down, what is its acceleration? (g = 10 m/s\u00B2, sin 37\u00B0 = 0.6, cos 37\u00B0 = 0.8)',
        correctAnswer: 4,
        unit: 'm/s\u00B2',
        hint: 'When sliding down: ma = mg sin\u03B8 - \u03BC_k mg cos\u03B8. The friction acts up the incline (opposing motion).',
        steps: [
          'Forces along the incline: mg sin 37\u00B0 (down) - friction (up)',
          'Normal force N = mg cos 37\u00B0 = 2(10)(0.8) = 16 N',
          'Friction = \u03BC_k N = 0.25 x 16 = 4 N',
          'Net force down = mg sin 37\u00B0 - friction = 2(10)(0.6) - 4 = 12 - 4 = 8 N',
          'a = 8/2 = 4 m/s\u00B2'
        ],
        solution: 'a = g(sin 37\u00B0 - \u03BC_k cos 37\u00B0) = 10(0.6 - 0.25 x 0.8) = 10(0.6 - 0.2) = 4 m/s\u00B2.',
        concepts: ['friction', 'inclined-plane']
      },
      {
        id: 'fn2-2',
        type: 'mcq',
        difficulty: 3,
        text: 'A car of mass 1000 kg moves in a circular path of radius 50 m at a constant speed of 20 m/s. What provides the centripetal force?',
        options: [
          'The engine force',
          'The normal reaction from the road',
          'The friction between tires and road',
          'The weight of the car'
        ],
        correctIndex: 2,
        hint: 'On a flat circular road, the only horizontal force available to provide centripetal acceleration is friction.',
        steps: [
          'Centripetal force must be directed toward the center (horizontally)',
          'Weight acts vertically down, normal force acts vertically up',
          'Engine force provides forward thrust, not centripetal force',
          'Only static friction can act horizontally toward the center'
        ],
        solution: 'On a flat road, the static friction between the tires and road provides the centripetal force. F_c = mv\u00B2/r = 1000(400)/50 = 8000 N.',
        concepts: ['circular-motion', 'friction']
      },
      {
        id: 'fn2-3',
        type: 'numerical',
        difficulty: 3,
        text: 'A car travels on a flat circular track of radius 100 m. If the coefficient of static friction between tires and road is 0.5, what is the maximum speed at which the car can travel without skidding? (g = 10 m/s\u00B2)',
        context: 'Round your answer to the nearest integer.',
        correctAnswer: 22,
        unit: 'm/s',
        hint: 'The centripetal force is provided by friction: mv\u00B2/r = \u03BC_s mg.',
        steps: [
          'For maximum speed: centripetal force = maximum friction',
          'mv\u00B2/r = \u03BC_s mg',
          'v\u00B2 = \u03BC_s g r = 0.5 x 10 x 100 = 500',
          'v = \u221A500 \u2248 22.36 m/s \u2248 22 m/s'
        ],
        solution: 'v_max = \u221A(\u03BC_s g r) = \u221A(0.5 x 10 x 100) = \u221A500 \u2248 22.36 m/s.',
        concepts: ['circular-motion', 'friction']
      },
      {
        id: 'fn2-4',
        type: 'numerical',
        difficulty: 4,
        text: 'Three blocks of masses 1 kg, 2 kg, and 3 kg are connected by strings and pulled by a force F = 24 N on a frictionless surface. The 3 kg block is in front, connected to 2 kg, connected to 1 kg. What is the tension in the string between the 2 kg and 3 kg blocks?',
        correctAnswer: 12,
        unit: 'N',
        hint: 'First find the acceleration of the entire system, then isolate the 3 kg block to find the tension pulling it backward.',
        steps: [
          'Total mass = 1 + 2 + 3 = 6 kg',
          'System acceleration a = F/m_total = 24/6 = 4 m/s\u00B2',
          'For the 3 kg block: F - T = 3a, so T = 24 - 3(4) = 12 N',
          'Alternatively: T pulls the (1+2) kg behind it: T = (1+2)(4) = 12 N'
        ],
        solution: 'System acceleration = 24/6 = 4 m/s\u00B2. Tension between 2 kg and 3 kg = (1+2) x 4 = 12 N (it pulls the masses behind it).',
        concepts: ['connected-bodies', 'newtons-laws']
      },
      {
        id: 'fn2-5',
        type: 'mcq',
        difficulty: 4,
        text: 'A conical pendulum consists of a mass m attached to a string of length L making angle \u03B8 with the vertical. What is the speed of the mass in the circular path?',
        options: [
          '\u221A(gL sin\u03B8)',
          '\u221A(gL sin\u03B8 tan\u03B8)',
          '\u221A(gL cos\u03B8)',
          '\u221A(gL tan\u03B8 sin\u03B8)'
        ],
        correctIndex: 1,
        hint: 'Resolve the tension into vertical (balances weight) and horizontal (provides centripetal force) components. The radius of the circle is L sin\u03B8.',
        steps: [
          'Vertical: T cos\u03B8 = mg, so T = mg/cos\u03B8',
          'Horizontal (centripetal): T sin\u03B8 = mv\u00B2/r, where r = L sin\u03B8',
          'Substituting T: (mg/cos\u03B8)(sin\u03B8) = mv\u00B2/(L sin\u03B8)',
          'mg tan\u03B8 = mv\u00B2/(L sin\u03B8)',
          'v\u00B2 = gL sin\u03B8 tan\u03B8'
        ],
        solution: 'From the force equations: v\u00B2 = gL sin\u03B8 tan\u03B8, so v = \u221A(gL sin\u03B8 tan\u03B8).',
        concepts: ['circular-motion', 'tension']
      },
      {
        id: 'fn2-6',
        type: 'match',
        difficulty: 3,
        text: 'Match each physical situation with the correct free body diagram description for the object of interest.',
        leftColumn: [
          'Block on a smooth incline',
          'Object in circular motion on a banked road (no friction)',
          'Block pulled at angle \u03B8 on rough floor',
          'Object hanging from ceiling by a string'
        ],
        rightColumn: [
          'Weight down, tension up',
          'Weight down, normal perpendicular to incline',
          'Weight down, normal (tilted), no friction needed for centripetal force',
          'Weight down, normal up, applied force at angle, friction opposing motion'
        ],
        correctMatches: { 0: 1, 1: 2, 2: 3, 3: 0 },
        hint: 'Draw the forces on each object: weight always acts downward, normal is perpendicular to the contact surface, friction opposes relative motion.',
        solution: 'Smooth incline: weight + normal only. Banked road: the normal force component provides centripetal force. Pulled block on rough floor: weight, normal, applied force, and friction. Hanging object: weight and tension only.',
        concepts: ['free-body-diagrams']
      },
      {
        id: 'fn2-7',
        type: 'numerical',
        difficulty: 4,
        text: 'A block of mass 2 kg rests on a rough horizontal surface (\u03BC_s = 0.4, \u03BC_k = 0.3). A force is applied at 30\u00B0 above the horizontal. What minimum magnitude of force is needed to start the block moving? (g = 10 m/s\u00B2, cos 30\u00B0 = 0.866, sin 30\u00B0 = 0.5)',
        context: 'Round to one decimal place.',
        correctAnswer: 7.1,
        unit: 'N',
        hint: 'The applied force has a vertical component that reduces the normal force. Set F cos\u03B8 = \u03BC_s(mg - F sin\u03B8) and solve for F.',
        steps: [
          'Normal force: N = mg - F sin 30\u00B0 = 20 - 0.5F',
          'Horizontal equilibrium at the verge of motion: F cos 30\u00B0 = \u03BC_s N',
          '0.866F = 0.4(20 - 0.5F)',
          '0.866F = 8 - 0.2F',
          '1.066F = 8',
          'F = 7.5 N'
        ],
        solution: 'N = mg - F sin 30\u00B0. At the verge of motion: F cos 30\u00B0 = \u03BC_s(mg - F sin 30\u00B0). Solving: 0.866F = 0.4(20 - 0.5F), giving F \u2248 7.5 N.',
        concepts: ['friction', 'newtons-laws']
      }
    ]
  }
];
