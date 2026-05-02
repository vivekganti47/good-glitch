// Kinesis Prime - Kinematics practice planets
// Topics: distance, displacement, velocity, acceleration, projectile motion, relative motion
// g = 10 m/s² for all calculations

export const kinesisPlanets = [
  // ==================== PLANET 1: Beacon Calibration ====================
  {
    id: 'beacon-calibration',
    name: 'Beacon Calibration',
    constellationId: 'kinesis-prime',
    order: 1,
    difficulty: 2,
    xp: 20,
    problems: [
      {
        id: 'kp1-1',
        type: 'mcq',
        difficulty: 1,
        text: 'A particle moves from x = 3 m to x = -5 m and then to x = 7 m. What is the total **distance** traveled?',
        options: ['4 m', '12 m', '20 m', '15 m'],
        correctIndex: 2,
        hint: 'Distance is the total path length, not the net change in position.',
        steps: [
          'From x = 3 to x = -5: path length = |3 - (-5)| = 8 m',
          'From x = -5 to x = 7: path length = |(-5) - 7| = 12 m',
          'Total distance = 8 + 12 = 20 m'
        ],
        solution: 'Distance = |3 - (-5)| + |(-5) - 7| = 8 + 12 = 20 m. Distance is always positive and adds up all path segments.',
        similarExample: 'If you walk 5 m east and then 3 m west, your distance is 8 m even though your displacement is only 2 m east.',
        concepts: ['distance', 'displacement']
      },
      {
        id: 'kp1-2',
        type: 'numerical',
        difficulty: 2,
        text: 'A car accelerates uniformly from rest to 72 km/h in 10 seconds. What is the acceleration in m/s²?',
        correctAnswer: 2,
        unit: 'm/s\u00B2',
        hint: 'First convert 72 km/h to m/s, then use a = (v - u) / t.',
        steps: [
          'Convert: 72 km/h = 72 x (5/18) = 20 m/s',
          'Initial velocity u = 0 (starts from rest)',
          'a = (v - u) / t = (20 - 0) / 10 = 2 m/s\u00B2'
        ],
        solution: '72 km/h = 20 m/s. Acceleration = (20 - 0) / 10 = 2 m/s\u00B2.',
        similarExample: 'A bike going from 0 to 36 km/h (10 m/s) in 5 s has acceleration = 10/5 = 2 m/s\u00B2.',
        concepts: ['acceleration', 'unit-conversion']
      },
      {
        id: 'kp1-3',
        type: 'numerical',
        difficulty: 2,
        text: 'A body starting from rest travels with uniform acceleration. If it covers 20 m in the first 2 seconds, what distance will it cover in the next 2 seconds?',
        correctAnswer: 60,
        unit: 'm',
        hint: 'Use s = ut + (1/2)at\u00B2. First find acceleration from the first interval, then find distance in the first 4 seconds total.',
        steps: [
          'For first 2 s: 20 = 0 + (1/2)(a)(4), so a = 10 m/s\u00B2',
          'Distance in first 4 s: s = 0 + (1/2)(10)(16) = 80 m',
          'Distance in next 2 s = 80 - 20 = 60 m'
        ],
        solution: 'From s = (1/2)at\u00B2: 20 = (1/2)(a)(4), giving a = 10 m/s\u00B2. Distance in 4 s = (1/2)(10)(16) = 80 m. Distance in next 2 s = 80 - 20 = 60 m.',
        similarExample: 'For uniform acceleration from rest, distances in successive equal intervals are in the ratio 1 : 3 : 5 : 7...',
        concepts: ['equations-of-motion']
      },
      {
        id: 'kp1-4',
        type: 'mcq',
        difficulty: 2,
        text: 'The velocity-time graph of a particle is a straight line with a negative slope passing through the origin. What does this represent?',
        options: [
          'Uniform velocity in the negative direction',
          'Uniform negative acceleration with initial velocity zero',
          'Increasing speed with constant negative acceleration',
          'Both B and C are correct'
        ],
        correctIndex: 3,
        hint: 'If v = -kt (line through origin with negative slope), then v becomes more negative over time. Think about what happens to speed.',
        steps: [
          'The line passes through origin, so at t = 0, v = 0',
          'Negative slope means v becomes increasingly negative',
          'Acceleration = slope = constant negative value',
          'Speed (|v|) is increasing with time'
        ],
        solution: 'v = -kt gives a = dv/dt = -k (constant negative acceleration). Speed = |v| = kt, which increases. Both B and C are correct.',
        concepts: ['motion-graphs', 'velocity']
      },
      {
        id: 'kp1-5',
        type: 'numerical',
        difficulty: 3,
        text: 'A ball is thrown vertically upward with velocity 40 m/s. How long does it take to return to the point of projection? (Take g = 10 m/s\u00B2)',
        correctAnswer: 8,
        unit: 's',
        hint: 'At the point of projection on return, displacement = 0. Use s = ut + (1/2)at\u00B2 with s = 0.',
        steps: [
          'Taking upward as positive: u = 40 m/s, a = -10 m/s\u00B2',
          'When it returns, displacement s = 0',
          '0 = 40t + (1/2)(-10)t\u00B2',
          '0 = 40t - 5t\u00B2 = t(40 - 5t)',
          't = 0 (start) or t = 8 s (return)'
        ],
        solution: 'Using s = ut + (1/2)at\u00B2 with s = 0: 0 = 40t - 5t\u00B2, giving t = 8 s. Alternatively, time of flight = 2u/g = 2(40)/10 = 8 s.',
        similarExample: 'For a ball thrown up at 20 m/s, return time = 2(20)/10 = 4 s.',
        concepts: ['equations-of-motion', 'vertical-motion']
      },
      {
        id: 'kp1-6',
        type: 'match',
        difficulty: 2,
        text: 'Match each kinematic quantity with its correct description.',
        leftColumn: ['Displacement', 'Average speed', 'Instantaneous velocity', 'Acceleration'],
        rightColumn: [
          'Rate of change of velocity',
          'Total distance divided by total time',
          'Derivative of position with respect to time',
          'Change in position (final minus initial)'
        ],
        correctMatches: { 0: 3, 1: 1, 2: 2, 3: 0 },
        hint: 'Displacement is a vector (change in position), speed is a scalar (distance/time), velocity is the derivative of position.',
        solution: 'Displacement = final position - initial position. Average speed = total distance / total time. Instantaneous velocity = dx/dt. Acceleration = dv/dt.',
        concepts: ['displacement', 'velocity', 'acceleration', 'speed']
      },
      {
        id: 'kp1-7',
        type: 'numerical',
        difficulty: 3,
        text: 'Two cars start from the same point at the same time. Car A moves at 60 km/h and car B at 40 km/h in the same direction. After how many hours will they be 30 km apart?',
        correctAnswer: 1.5,
        unit: 'hours',
        hint: 'The relative velocity of A with respect to B is v_A - v_B.',
        steps: [
          'Relative velocity of A w.r.t. B = 60 - 40 = 20 km/h',
          'Separation = relative velocity x time',
          '30 = 20 x t',
          't = 1.5 hours'
        ],
        solution: 'Relative velocity = 60 - 40 = 20 km/h. Time = 30/20 = 1.5 hours.',
        concepts: ['relative-motion']
      }
    ]
  },

  // ==================== PLANET 2: Trajectory Range ====================
  {
    id: 'trajectory-range',
    name: 'Trajectory Range',
    constellationId: 'kinesis-prime',
    order: 2,
    difficulty: 3,
    xp: 25,
    problems: [
      {
        id: 'kp2-1',
        type: 'numerical',
        difficulty: 3,
        text: 'A projectile is launched at 30\u00B0 above the horizontal with an initial speed of 40 m/s. What is the maximum height reached? (g = 10 m/s\u00B2)',
        correctAnswer: 20,
        unit: 'm',
        hint: 'Use the vertical component: u_y = u sin\u03B8. At max height, v_y = 0. Use v\u00B2 = u\u00B2 - 2gH.',
        steps: [
          'Vertical component: u_y = 40 sin 30\u00B0 = 40 x 0.5 = 20 m/s',
          'At maximum height, v_y = 0',
          'Using v_y\u00B2 = u_y\u00B2 - 2gH: 0 = 400 - 2(10)H',
          'H = 400/20 = 20 m'
        ],
        solution: 'u_y = 40 sin 30\u00B0 = 20 m/s. Maximum height H = u_y\u00B2/(2g) = 400/20 = 20 m.',
        similarExample: 'For a projectile at 45\u00B0 with speed 20 m/s: u_y = 20 sin 45\u00B0 = 10\u221A2 m/s, H = 200/20 = 10 m.',
        concepts: ['projectile-motion']
      },
      {
        id: 'kp2-2',
        type: 'mcq',
        difficulty: 3,
        text: 'Two projectiles are launched with the same speed. One at 30\u00B0 and the other at 60\u00B0. Which statement is correct?',
        options: [
          'Both have the same range and same maximum height',
          'Both have the same range but different maximum heights',
          'Both have different ranges and different maximum heights',
          'The 60\u00B0 projectile has a longer range'
        ],
        correctIndex: 1,
        hint: 'Complementary angles (angles that add to 90\u00B0) give the same range. But the maximum height depends on the vertical component.',
        steps: [
          'Range R = u\u00B2 sin(2\u03B8)/g. For 30\u00B0: sin 60\u00B0. For 60\u00B0: sin 120\u00B0 = sin 60\u00B0. Same range!',
          'Max height H = u\u00B2 sin\u00B2\u03B8/(2g)',
          'For 30\u00B0: H = u\u00B2(0.25)/(2g). For 60\u00B0: H = u\u00B2(0.75)/(2g). Different heights!'
        ],
        solution: 'Complementary angles give the same range (R = u\u00B2 sin 2\u03B8/g, and sin 60\u00B0 = sin 120\u00B0). But the 60\u00B0 projectile reaches a greater height since H depends on sin\u00B2\u03B8.',
        concepts: ['projectile-motion']
      },
      {
        id: 'kp2-3',
        type: 'numerical',
        difficulty: 3,
        text: 'A ball is dropped from the top of a building 80 m tall. At the same instant, another ball is thrown vertically upward from the ground with a velocity of 40 m/s. At what height from the ground do they meet? (g = 10 m/s\u00B2)',
        correctAnswer: 60,
        unit: 'm',
        hint: 'Let them meet at time t. Set up equations for both balls and find where their positions are equal.',
        steps: [
          'Ball 1 (dropped): falls from 80 m, position = 80 - (1/2)(10)t\u00B2 = 80 - 5t\u00B2',
          'Ball 2 (thrown up): position = 40t - 5t\u00B2',
          'They meet when 80 - 5t\u00B2 = 40t - 5t\u00B2',
          '80 = 40t, so t = 2 s',
          'Height = 40(2) - 5(4) = 80 - 20 = 60 m'
        ],
        solution: 'Setting positions equal: 80 - 5t\u00B2 = 40t - 5t\u00B2, giving t = 2 s. Height from ground = 40(2) - 5(4) = 60 m.',
        concepts: ['equations-of-motion', 'vertical-motion']
      },
      {
        id: 'kp2-4',
        type: 'numerical',
        difficulty: 4,
        text: 'A projectile is launched horizontally from a cliff 45 m high with a speed of 20 m/s. How far from the base of the cliff does it land? (g = 10 m/s\u00B2)',
        correctAnswer: 60,
        unit: 'm',
        hint: 'For horizontal projection, the time to fall depends only on the height. Find the time of flight first.',
        steps: [
          'Vertical: h = (1/2)gt\u00B2, so 45 = (1/2)(10)t\u00B2 = 5t\u00B2',
          't\u00B2 = 9, t = 3 s',
          'Horizontal range = horizontal speed x time = 20 x 3 = 60 m'
        ],
        solution: 'Time of flight: 45 = 5t\u00B2, t = 3 s. Horizontal range = 20 x 3 = 60 m.',
        similarExample: 'A ball thrown horizontally at 10 m/s from 20 m: t = 2 s, range = 20 m.',
        concepts: ['projectile-motion']
      },
      {
        id: 'kp2-5',
        type: 'mcq',
        difficulty: 4,
        text: 'A particle is projected at 45\u00B0 with speed u. What is the radius of curvature of the trajectory at the highest point?',
        options: ['u\u00B2/g', 'u\u00B2/(2g)', 'u\u00B2/(4g)', '2u\u00B2/g'],
        correctIndex: 1,
        hint: 'At the highest point, only the horizontal component of velocity exists. The centripetal acceleration equals g (directed downward).',
        steps: [
          'At the highest point, v_y = 0, so speed = v_x = u cos 45\u00B0 = u/\u221A2',
          'The only acceleration is g (downward), which acts as centripetal acceleration',
          'Using a_c = v\u00B2/R: g = (u/\u221A2)\u00B2/R = u\u00B2/(2R)',
          'R = u\u00B2/(2g)'
        ],
        solution: 'At the highest point, speed = u cos 45\u00B0 = u/\u221A2. Since g provides the centripetal acceleration: g = (u/\u221A2)\u00B2/R, giving R = u\u00B2/(2g).',
        concepts: ['projectile-motion', 'circular-motion']
      },
      {
        id: 'kp2-6',
        type: 'mcq-multi',
        difficulty: 3,
        text: 'Which of the following are true about projectile motion? (Neglect air resistance)',
        options: [
          'The horizontal velocity remains constant throughout',
          'The acceleration is constant and directed downward',
          'The speed at the highest point is zero',
          'The time of ascent equals the time of descent',
          'The trajectory is parabolic'
        ],
        correctIndices: [0, 1, 3, 4],
        hint: 'At the highest point, only the vertical component of velocity is zero, not the horizontal component.',
        solution: 'In projectile motion: (A) horizontal velocity is constant (no horizontal acceleration). (B) acceleration = g downward always. (C) WRONG: speed at highest point = u cos\u03B8, not zero. (D) Symmetry of parabola. (E) y = x tan\u03B8 - gx\u00B2/(2u\u00B2cos\u00B2\u03B8) is a parabola.',
        concepts: ['projectile-motion']
      },
      {
        id: 'kp2-7',
        type: 'numerical',
        difficulty: 4,
        text: 'A boat can travel at 5 m/s in still water. A river flows at 3 m/s. If the boat aims perpendicular to the flow and the river is 40 m wide, what is the drift (downstream displacement) when the boat reaches the other bank?',
        correctAnswer: 24,
        unit: 'm',
        hint: 'Time to cross = width / component of velocity perpendicular to flow. Drift = river speed x time.',
        steps: [
          'The boat aims perpendicular, so its velocity across the river = 5 m/s',
          'Time to cross = 40/5 = 8 s',
          'Drift = river speed x time = 3 x 8 = 24 m'
        ],
        solution: 'Time to cross = 40/5 = 8 s. Drift downstream = 3 x 8 = 24 m.',
        similarExample: 'If the boat aimed upstream at an angle to cancel drift, the perpendicular component would be \u221A(25-9) = 4 m/s, taking 10 s with zero drift.',
        concepts: ['relative-motion']
      },
      {
        id: 'kp2-8',
        type: 'match',
        difficulty: 3,
        text: 'Match each projectile scenario with the correct range formula. (u = initial speed, g = acceleration due to gravity)',
        leftColumn: [
          'Launched at angle \u03B8 from ground',
          'Launched horizontally from height h',
          'Maximum range (optimal angle)'
        ],
        rightColumn: [
          'u\u00B2/g',
          'u\u221A(2h/g)',
          'u\u00B2 sin(2\u03B8) / g'
        ],
        correctMatches: { 0: 2, 1: 1, 2: 0 },
        hint: 'For horizontal launch, the time of flight depends on height h, and range = horizontal speed x time.',
        solution: 'Ground launch: R = u\u00B2 sin(2\u03B8)/g. Horizontal from height h: R = u\u221A(2h/g). Max range at 45\u00B0: R = u\u00B2/g (since sin 90\u00B0 = 1).',
        concepts: ['projectile-motion']
      }
    ]
  }
];
