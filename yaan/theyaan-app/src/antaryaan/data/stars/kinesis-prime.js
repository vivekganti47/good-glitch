export const kinesisStars = [
  // ========== STAR 1: The Language of Motion ==========
  {
    id: 'language-of-motion',
    name: 'The Language of Motion',
    constellationId: 'kinesis-prime',
    order: 1,
    duration: 8,
    xp: 15,
    concepts: ['position', 'displacement', 'distance', 'velocity', 'speed', 'acceleration'],
    blocks: [
      {
        type: 'text',
        content: 'How do you describe where something is? Where it\'s going? How fast? Before we can understand *why* things move, we need a precise language to describe *how* they move. This is **kinematics**: the science of describing motion.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'motion-grapher',
        title: 'Motion Explorer',
        description: 'Create different types of motion and watch how position, velocity, and acceleration change in real time. Build intuition for the language of kinematics.',
        controls: [
          { param: 'initialPosition', label: 'Start Position', min: -50, max: 50, step: 1, default: 0, unit: 'm' },
          { param: 'initialVelocity', label: 'Initial Velocity', min: -20, max: 20, step: 1, default: 5, unit: 'm/s' },
          { param: 'acceleration', label: 'Acceleration', min: -10, max: 10, step: 0.5, default: 0, unit: 'm/s\u00B2' },
        ],
        discoveries: [
          { id: 'constant-velocity', label: 'Constant velocity means zero acceleration', hint: 'Set acceleration to 0 and watch the motion' },
          { id: 'deceleration', label: 'Negative acceleration slows a positive velocity', hint: 'Set positive velocity and negative acceleration' },
          { id: 'direction-reversal', label: 'Object reverses direction when velocity crosses zero', hint: 'Start with positive velocity and negative acceleration, then wait' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 4 },
      },
      {
        type: 'keyInsight',
        content: 'Displacement has direction (+ or -). Distance is just the magnitude of the total path (always positive). A round trip of 10m out and 10m back has displacement = 0 but distance = 20m.'
      },
      {
        type: 'formula',
        title: 'Speed vs Velocity',
        formulas: [
          { label: 'Speed', formula: 'speed = distance / time', note: 'Scalar (no direction), always positive' },
          { label: 'Velocity', formula: 'v = displacement / time', note: 'Vector (has direction), can be negative' }
        ]
      },
      {
        type: 'formula',
        title: 'Acceleration',
        formulas: [
          { label: 'Average Acceleration', formula: 'a = (v - u) / t', note: 'v = final velocity, u = initial velocity. Units: m/s\u00B2' }
        ]
      },
      {
        type: 'text',
        content: '**Acceleration** is the rate of change of velocity. When velocity changes (in magnitude or direction), the object is accelerating. An object slowing down has acceleration opposite to its velocity.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A spaceship moves from position +5m to +2m. What is the displacement?',
        correctAnswer: -3,
        unit: 'm',
        explanation: 'Displacement = Final position - Initial position = 2 - 5 = -3m. The negative sign means the ship moved in the negative direction (backward).'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A ship travels 10m east then 6m west in 4s total. What is the average velocity? (Take east as positive)',
        correctAnswer: 1,
        unit: 'm/s',
        explanation: 'Net displacement = 10 - 6 = 4m east. Average velocity = displacement/time = 4/4 = 1 m/s east.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'For the same trip (10m east then 6m west in 4s), what is the average speed?',
        correctAnswer: 4,
        unit: 'm/s',
        explanation: 'Total distance = 10 + 6 = 16m. Average speed = distance/time = 16/4 = 4 m/s.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A ship accelerates from 5 m/s to 15 m/s in 2 seconds. What is the acceleration?',
        correctAnswer: 5,
        unit: 'm/s\u00B2',
        explanation: 'a = (v - u)/t = (15 - 5)/2 = 10/2 = 5 m/s\u00B2'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'lom-q1',
            question: 'A ship moves from x = 3m to x = -4m. What is the displacement?',
            type: 'number',
            correctAnswer: -7,
            unit: 'm',
            explanation: 'Displacement = Final - Initial = -4 - 3 = -7m'
          },
          {
            id: 'lom-q2',
            question: 'A ship travels 100m in 10s going east, then 100m in 10s going west. What is the average speed?',
            type: 'number',
            correctAnswer: 10,
            unit: 'm/s',
            explanation: 'Total distance = 200m, Total time = 20s, Speed = 200/20 = 10 m/s'
          },
          {
            id: 'lom-q3',
            question: 'A car decelerates from 20 m/s to 0 in 4s. What is the acceleration?',
            type: 'number',
            correctAnswer: -5,
            unit: 'm/s\u00B2',
            explanation: 'a = (v - u)/t = (0 - 20)/4 = -5 m/s\u00B2. Negative because it is decelerating.'
          }
        ]
      }
    ]
  },

  // ========== STAR 2: Equations of Motion ==========
  {
    id: 'equations-of-motion',
    name: 'Equations of Motion',
    constellationId: 'kinesis-prime',
    order: 2,
    duration: 10,
    xp: 20,
    concepts: ['suvat-equations', 'uniform-acceleration', 'free-fall'],
    blocks: [
      {
        type: 'text',
        content: 'When acceleration is constant (uniform), three powerful equations connect five variables: initial velocity (u), final velocity (v), acceleration (a), time (t), and displacement (s). Know any three and you can find the other two.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'velocity-racer',
        title: 'SUVAT Race Challenge',
        description: 'Set initial velocity and acceleration to make Ship B arrive at the same time as Ship A. Apply the equations of motion to match arrival times.',
        objective: 'Match Ship B arrival time to Ship A within 0.5s',
        targetScore: 70,
        config: { targetTime: 5 },
      },
      {
        type: 'keyInsight',
        content: 'Strategy: List what you know (u, v, a, s, t) and what you need. Pick the equation that contains your knowns and the unknown. If you know 3 of the 5 variables, you can always solve the problem.'
      },
      {
        type: 'formula',
        title: 'The Three Equations of Uniformly Accelerated Motion',
        formulas: [
          { label: 'First Equation', formula: 'v = u + at', note: 'Relates velocity and time' },
          { label: 'Second Equation', formula: 's = ut + \u00BDat\u00B2', note: 'Relates displacement and time' },
          { label: 'Third Equation', formula: 'v\u00B2 = u\u00B2 + 2as', note: 'Relates velocity and displacement (no time)' }
        ]
      },
      {
        type: 'text',
        content: '**Free fall** is motion under gravity alone (no air resistance). All objects fall with the same acceleration g regardless of mass. A feather and a hammer dropped on the Moon (no air) hit the ground at the same time.',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A car starts from rest (u = 0) and accelerates at 2 m/s\u00B2 for 5 seconds. How far does it travel?',
        correctAnswer: 25,
        unit: 'm',
        explanation: 's = ut + \u00BDat\u00B2 = 0(5) + \u00BD(2)(25) = 0 + 25 = 25m'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A ball is thrown upward with u = 20 m/s. How high does it go? (Use g = 10 m/s\u00B2)',
        correctAnswer: 20,
        unit: 'm',
        explanation: 'At max height, v = 0. Using v\u00B2 = u\u00B2 + 2as: 0 = 400 + 2(-10)s \u2192 s = 400/20 = 20m.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A stone is dropped from a height of 80m. How long does it take to reach the ground? (g = 10 m/s\u00B2)',
        correctAnswer: 4,
        unit: 's',
        explanation: 's = ut + \u00BDgt\u00B2. Taking downward as positive: 80 = 0 + \u00BD(10)t\u00B2 \u2192 t\u00B2 = 16 \u2192 t = 4s.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'eom-q1',
            question: 'A train accelerates from 10 m/s at 3 m/s\u00B2 for 4s. What is its final velocity?',
            type: 'number',
            correctAnswer: 22,
            unit: 'm/s',
            explanation: 'v = u + at = 10 + 3(4) = 10 + 12 = 22 m/s'
          },
          {
            id: 'eom-q2',
            question: 'A car moving at 30 m/s brakes uniformly and stops in 90m. What is the deceleration?',
            type: 'number',
            correctAnswer: -5,
            unit: 'm/s\u00B2',
            explanation: 'v\u00B2 = u\u00B2 + 2as \u2192 0 = 900 + 2a(90) \u2192 a = -900/180 = -5 m/s\u00B2'
          },
          {
            id: 'eom-q3',
            question: 'A ball is thrown upward at 30 m/s. What is the total time of flight? (g = 10 m/s\u00B2)',
            type: 'number',
            correctAnswer: 6,
            unit: 's',
            explanation: 'Time up: v = u + at \u2192 0 = 30 - 10t \u2192 t = 3s. Total time = 2 \u00D7 3 = 6s (symmetric motion).'
          }
        ]
      }
    ]
  },

  // ========== STAR 3: Motion Graphs ==========
  {
    id: 'motion-graphs',
    name: 'Motion Graphs',
    constellationId: 'kinesis-prime',
    order: 3,
    duration: 10,
    xp: 20,
    concepts: ['position-time-graph', 'velocity-time-graph', 'acceleration-time-graph', 'area-under-curve', 'slope'],
    blocks: [
      {
        type: 'text',
        content: 'Graphs are a navigator\'s most powerful tool. A single graph can tell an entire story of motion. The key is knowing what the **slope** and **area** of each graph represent.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'motion-grapher',
        title: 'Graph Lab',
        description: 'Control an object\'s motion and observe how position-time, velocity-time, and acceleration-time graphs update simultaneously. See the connections between slopes and areas.',
        controls: [
          { param: 'initialVelocity', label: 'Initial Velocity', min: -15, max: 15, step: 1, default: 0, unit: 'm/s' },
          { param: 'acceleration', label: 'Acceleration', min: -10, max: 10, step: 0.5, default: 2, unit: 'm/s\u00B2' },
          { param: 'duration', label: 'Duration', min: 1, max: 10, step: 0.5, default: 5, unit: 's' },
        ],
        discoveries: [
          { id: 'slope-xt-velocity', label: 'Slope of x-t graph equals velocity', hint: 'Set constant velocity (a=0) and compare the x-t slope to the v value' },
          { id: 'slope-vt-accel', label: 'Slope of v-t graph equals acceleration', hint: 'Set a non-zero acceleration and compare the v-t slope to the a value' },
          { id: 'area-vt-displacement', label: 'Area under v-t equals displacement', hint: 'Compare the shaded area under v-t to the final position on x-t' },
          { id: 'parabolic-xt', label: 'Constant acceleration produces a parabolic x-t graph', hint: 'Set non-zero acceleration and observe the x-t curve shape' },
        ],
        completionCriteria: { requiredDiscoveries: 3, requiredLaunches: 5 },
      },
      {
        type: 'keyInsight',
        content: 'The slope of x-t gives v. The slope of v-t gives a. The area under v-t gives displacement. The area under a-t gives change in velocity. Each graph is connected to the next through slopes and areas.'
      },
      {
        type: 'text',
        content: '**Acceleration-Time (a-t) Graph:**\n- Area under curve = change in velocity (\u0394v)\n- Horizontal line = constant acceleration (uniformly accelerated motion)\n- a = 0 line means constant velocity',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'mcq',
        prompt: 'On a v-t graph, a car starts at v = 10 m/s and the line slopes down to v = 0 at t = 5s. What does the area under this line represent and what is its value?',
        options: ['Acceleration = 2 m/s\u00B2', 'Displacement = 25 m', 'Velocity = 5 m/s', 'Distance = 50 m'],
        correctAnswer: 1,
        explanation: 'Area under v-t graph = displacement. Area of triangle = \u00BD \u00D7 base \u00D7 height = \u00BD \u00D7 5 \u00D7 10 = 25m.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'On a v-t graph, a line goes from (0, 0) to (4, 20). What is the acceleration?',
        correctAnswer: 5,
        unit: 'm/s\u00B2',
        explanation: 'Slope of v-t graph = acceleration = \u0394v/\u0394t = (20 - 0)/(4 - 0) = 5 m/s\u00B2.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'mg-q1',
            question: 'On an x-t graph, a straight line with a negative slope means the object is:',
            type: 'mcq',
            options: ['Accelerating', 'Moving in the negative direction at constant velocity', 'Decelerating', 'At rest'],
            correctAnswer: 1,
            explanation: 'Slope of x-t = velocity. Straight line means constant velocity. Negative slope means negative (backward) constant velocity.'
          },
          {
            id: 'mg-q2',
            question: 'A v-t graph shows a horizontal line at v = 8 m/s from t = 0 to t = 5s. What is the displacement?',
            type: 'number',
            correctAnswer: 40,
            unit: 'm',
            explanation: 'Area under v-t = displacement = 8 \u00D7 5 = 40m (rectangle area).'
          },
          {
            id: 'mg-q3',
            question: 'If the x-t graph is a parabola opening upward, the acceleration is:',
            type: 'mcq',
            options: ['Zero', 'Positive and constant', 'Negative and constant', 'Increasing'],
            correctAnswer: 1,
            explanation: 'Upward parabola in x-t means x increases faster and faster. Slope (velocity) increases linearly, meaning constant positive acceleration.'
          }
        ]
      }
    ]
  },

  // ========== STAR 4: Relative Motion ==========
  {
    id: 'relative-motion',
    name: 'Relative Motion',
    constellationId: 'kinesis-prime',
    order: 4,
    duration: 8,
    xp: 20,
    concepts: ['reference-frames', 'relative-velocity', 'river-boat-problems'],
    blocks: [
      {
        type: 'text',
        content: 'All motion is relative. When you sit in a moving train, you are at rest relative to the train but moving relative to the ground. The velocity of object A as seen by object B depends on both their motions. This is the heart of **relative motion**.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'velocity-racer',
        title: 'Relative Velocity Race',
        description: 'Two ships fly through space. Control Ship B\'s velocity to explore how relative motion works. Can you make them appear stationary to each other?',
        controls: [
          { param: 'velocityA', label: 'Ship A Velocity', min: 5, max: 30, step: 1, default: 15, unit: 'm/s' },
          { param: 'velocityB', label: 'Ship B Velocity', min: -30, max: 30, step: 1, default: 10, unit: 'm/s' },
        ],
        discoveries: [
          { id: 'same-velocity-zero-relative', label: 'Equal velocities give zero relative velocity', hint: 'Set both ships to the same speed and direction' },
          { id: 'opposite-fast-approach', label: 'Opposite directions make approach speed very high', hint: 'Set one positive and one negative velocity' },
          { id: 'overtaking', label: 'Faster ship slowly overtakes a slightly slower ship', hint: 'Make Ship B just a bit faster than Ship A' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 4 },
      },
      {
        type: 'keyInsight',
        content: 'In river problems, the component of velocity perpendicular to the river determines crossing time, and the component along the river determines drift. They are independent.'
      },
      {
        type: 'formula',
        title: 'Relative Velocity',
        formulas: [
          { label: '1D Relative Velocity', formula: 'v_AB = v_A - v_B', note: 'Velocity of A as observed by B' },
          { label: 'Same direction', formula: 'v_rel = v_A - v_B', note: 'Objects appear to move slower relative to each other' },
          { label: 'Opposite direction', formula: 'v_rel = v_A + v_B', note: 'Objects appear to approach faster' }
        ]
      },
      {
        type: 'text',
        content: '**River-Boat Problems:** A boat crossing a river has two velocity components: its own velocity relative to water, and the river current. The resultant velocity determines the actual path.\n\n- To cross in minimum time: head straight across\n- To cross with zero drift: angle upstream so that the river component cancels',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'Car A moves east at 60 km/h and Car B moves east at 40 km/h. What is the velocity of A relative to B?',
        correctAnswer: 20,
        unit: 'km/h east',
        explanation: 'v_AB = v_A - v_B = 60 - 40 = 20 km/h east. A appears to move at 20 km/h to someone in B.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'Train A moves east at 50 km/h and Train B moves west at 50 km/h. How fast does A appear to approach B?',
        correctAnswer: 100,
        unit: 'km/h',
        explanation: 'Opposite directions: relative speed = 50 + 50 = 100 km/h. They appear to approach each other very fast.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A river is 100m wide with current 3 m/s. A boat can move at 5 m/s in still water. If the boat heads straight across, how long does it take to cross?',
        correctAnswer: 20,
        unit: 's',
        explanation: 'Time to cross = width / boat speed across = 100 / 5 = 20s. The current causes drift but doesn\'t affect crossing time when heading straight.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'rm-q1',
            question: 'Two cars approach each other, one at 30 m/s east and the other at 20 m/s west. What is the relative speed of approach?',
            type: 'number',
            correctAnswer: 50,
            unit: 'm/s',
            explanation: 'Opposite directions: relative speed = 30 + 20 = 50 m/s.'
          },
          {
            id: 'rm-q2',
            question: 'Rain falls vertically at 10 m/s. You run east at 10 m/s. At what angle (from vertical) should you tilt your umbrella?',
            type: 'number',
            correctAnswer: 45,
            unit: 'degrees',
            explanation: 'Relative to you, rain has horizontal component 10 m/s and vertical 10 m/s. Angle = arctan(10/10) = 45\u00B0.'
          }
        ]
      }
    ]
  },

  // ========== STAR 5: Projectile Launch ==========
  {
    id: 'projectile-launch',
    name: 'Projectile Launch',
    constellationId: 'kinesis-prime',
    order: 5,
    duration: 10,
    xp: 25,
    concepts: ['projectile-motion', 'horizontal-vertical-independence', 'range', 'max-height', 'time-of-flight'],
    blocks: [
      {
        type: 'text',
        content: 'A projectile is any object launched into the air that moves under gravity alone (ignoring air resistance). The key insight: horizontal and vertical motions are **completely independent**. Gravity only affects the vertical component.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'projectile-launcher',
        title: 'Projectile Playground',
        description: 'Launch projectiles and discover how angle, speed, and gravity affect the trajectory. Watch the parabolic path unfold in real time.',
        controls: [
          { param: 'velocity', label: 'Launch Speed', min: 5, max: 50, step: 1, default: 20, unit: 'm/s' },
          { param: 'angle', label: 'Launch Angle', min: 5, max: 85, step: 1, default: 45, unit: '\u00B0' },
          { param: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.5, default: 10, unit: 'm/s\u00B2' },
        ],
        discoveries: [
          { id: 'max-range-45', label: 'Maximum range occurs at 45\u00B0', hint: 'Try different angles near 45\u00B0' },
          { id: 'complementary-angles', label: 'Complementary angles give same range', hint: 'Try 30\u00B0 and 60\u00B0' },
          { id: 'gravity-effect', label: 'Lower gravity = longer range', hint: 'Compare g=10 with g=5' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 5 },
      },
      {
        type: 'keyInsight',
        content: 'Maximum range occurs at \u03B8 = 45\u00B0 because sin(2\u00D745\u00B0) = sin(90\u00B0) = 1. Complementary angles (like 30\u00B0 and 60\u00B0) give the same range but different heights and flight times.'
      },
      {
        type: 'formula',
        title: 'Projectile Motion Equations',
        formulas: [
          { label: 'Time of flight', formula: 'T = 2u sin\u03B8 / g', note: 'Total time in air (launched from ground)' },
          { label: 'Maximum height', formula: 'H = u\u00B2 sin\u00B2\u03B8 / (2g)', note: 'Highest point reached' },
          { label: 'Range', formula: 'R = u\u00B2 sin(2\u03B8) / g', note: 'Horizontal distance (same launch/land height)' }
        ]
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A ball is launched at 30\u00B0 with speed 20 m/s. What is the time of flight? (g = 10 m/s\u00B2)',
        correctAnswer: 2,
        unit: 's',
        explanation: 'T = 2u sin\u03B8/g = 2(20)(sin30\u00B0)/10 = 2(20)(0.5)/10 = 20/10 = 2s.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'For the same ball (u = 20 m/s, \u03B8 = 30\u00B0), what is the maximum height?',
        correctAnswer: 5,
        unit: 'm',
        explanation: 'H = u\u00B2sin\u00B2\u03B8/(2g) = (400)(0.25)/(20) = 100/20 = 5m.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'What is the range of the ball? (u = 20 m/s, \u03B8 = 30\u00B0, g = 10 m/s\u00B2)',
        correctAnswer: 34.64,
        unit: 'm',
        tolerance: 0.5,
        explanation: 'R = u\u00B2 sin(2\u03B8)/g = (400)(sin60\u00B0)/10 = 400(0.866)/10 \u2248 34.64m.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'pl-q1',
            question: 'At the highest point of a projectile, which velocity component is zero?',
            type: 'mcq',
            options: ['Horizontal', 'Vertical', 'Both', 'Neither'],
            correctAnswer: 1,
            explanation: 'At the highest point, the vertical velocity = 0 (momentarily stops going up before falling). Horizontal velocity stays constant throughout.'
          },
          {
            id: 'pl-q2',
            question: 'A projectile is launched at 45\u00B0 with u = 40 m/s. What is the maximum range? (g = 10 m/s\u00B2)',
            type: 'number',
            correctAnswer: 160,
            unit: 'm',
            explanation: 'R = u\u00B2 sin(90\u00B0)/g = 1600/10 = 160m.'
          },
          {
            id: 'pl-q3',
            question: 'Two balls are launched at 30\u00B0 and 60\u00B0 with the same speed. Which has the greater range?',
            type: 'mcq',
            options: ['The 30\u00B0 ball', 'The 60\u00B0 ball', 'Both have equal range', 'Cannot determine'],
            correctAnswer: 2,
            explanation: 'sin(2\u00D730\u00B0) = sin(60\u00B0) and sin(2\u00D760\u00B0) = sin(120\u00B0) = sin(60\u00B0). Same range because they are complementary angles.'
          }
        ]
      }
    ]
  },

  // ========== STAR 6: Projectile Problem Strategies ==========
  {
    id: 'projectile-strategies',
    name: 'Projectile Problem Strategies',
    constellationId: 'kinesis-prime',
    order: 6,
    duration: 10,
    xp: 25,
    concepts: ['horizontal-launch', 'projectile-from-height', 'projectile-on-incline'],
    blocks: [
      {
        type: 'text',
        content: 'Not every projectile is launched from the ground at an angle. Many real problems involve objects thrown horizontally from a cliff, dropped from moving vehicles, or launched from heights. The method stays the same: separate horizontal and vertical components.',
        subtype: 'hook'
      },
      {
        type: 'simulation',
        simType: 'projectile-launcher',
        title: 'Cliff Launch Lab',
        description: 'Launch projectiles horizontally from different heights. Explore how launch height and horizontal speed independently affect where the object lands.',
        controls: [
          { param: 'velocity', label: 'Horizontal Speed', min: 5, max: 40, step: 1, default: 15, unit: 'm/s' },
          { param: 'height', label: 'Launch Height', min: 5, max: 100, step: 5, default: 20, unit: 'm' },
          { param: 'gravity', label: 'Gravity', min: 1, max: 20, step: 0.5, default: 10, unit: 'm/s\u00B2' },
        ],
        discoveries: [
          { id: 'horizontal-no-affect-fall-time', label: 'Horizontal speed does not affect fall time', hint: 'Change horizontal speed and compare fall times' },
          { id: 'height-determines-time', label: 'Height alone determines fall time', hint: 'Keep speed constant and change height' },
          { id: 'range-proportional-speed', label: 'Doubling horizontal speed doubles horizontal range', hint: 'Compare range at 10 m/s and 20 m/s from the same height' },
        ],
        completionCriteria: { requiredDiscoveries: 2, requiredLaunches: 5 },
      },
      {
        type: 'keyInsight',
        content: 'In any projectile problem, always analyze horizontal and vertical independently. Time is the link between them: find time from one direction, use it in the other.'
      },
      {
        type: 'text',
        content: '**Key Problem-Solving Strategy:**\n1. Set up coordinates (usually: x = horizontal, y = vertical upward)\n2. Resolve initial velocity into u_x and u_y\n3. Write separate equations for x and y motion\n4. Use time as the connecting variable\n5. Solve for the requested quantity',
        subtype: 'concept'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A ball is thrown horizontally at 15 m/s from a cliff 20m high. How long does it take to hit the ground? (g = 10 m/s\u00B2)',
        correctAnswer: 2,
        unit: 's',
        explanation: 'h = \u00BDgt\u00B2 \u2192 20 = \u00BD(10)t\u00B2 \u2192 t\u00B2 = 4 \u2192 t = 2s. Horizontal velocity does not affect fall time.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'How far from the base of the cliff does the ball land? (u = 15 m/s, t = 2s)',
        correctAnswer: 30,
        unit: 'm',
        explanation: 'Horizontal distance = u \u00D7 t = 15 \u00D7 2 = 30m.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A bomber flies horizontally at 100 m/s at altitude 500m. How far before the target must it release a bomb? (g = 10 m/s\u00B2)',
        correctAnswer: 1000,
        unit: 'm',
        explanation: 'Fall time: 500 = \u00BD(10)t\u00B2 \u2192 t = 10s. Horizontal distance = 100 \u00D7 10 = 1000m. Release 1000m before the target.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'ps-q1',
            question: 'A ball is thrown horizontally from a 45m cliff. How long before it hits the ground? (g = 10 m/s\u00B2)',
            type: 'number',
            correctAnswer: 3,
            unit: 's',
            explanation: '45 = \u00BD(10)t\u00B2 \u2192 t\u00B2 = 9 \u2192 t = 3s.'
          },
          {
            id: 'ps-q2',
            question: 'An object is launched at 60\u00B0 above horizontal with speed 20 m/s from the edge of a 15m tall building. What is the initial vertical velocity component?',
            type: 'number',
            correctAnswer: 17.32,
            unit: 'm/s',
            tolerance: 0.5,
            explanation: 'u_y = u sin\u03B8 = 20 \u00D7 sin60\u00B0 = 20 \u00D7 0.866 \u2248 17.32 m/s.'
          }
        ]
      }
    ]
  },

  // ========== STAR 7: Kinesis Prime Mastery ==========
  {
    id: 'kinesis-mastery',
    name: 'Kinesis Prime Mastery',
    constellationId: 'kinesis-prime',
    order: 7,
    duration: 8,
    xp: 30,
    concepts: ['kinematics-review', 'mixed-problems', 'advanced-projectile'],
    blocks: [
      {
        type: 'text',
        content: 'You have charted every star in Kinesis Prime. Now it is time to prove your mastery. This final challenge combines concepts from all previous stars: displacement, equations of motion, graphs, relative motion, and projectiles.',
        subtype: 'hook'
      },
      {
        type: 'challenge',
        simType: 'motion-grapher',
        title: 'Master Graph Challenge',
        description: 'You are given a target motion graph. Recreate it by choosing the right initial velocity and acceleration. Prove your mastery of kinematics graphs.',
        objective: 'Reproduce the target v-t graph within 10% error',
        targetScore: 80,
        config: { graphType: 'velocity-time', rounds: 3 },
      },
      {
        type: 'keyInsight',
        content: 'The master navigator\'s checklist:\n1. What type of motion? (Uniform, uniformly accelerated, projectile, relative)\n2. What quantities are known?\n3. What is being asked?\n4. Which equation(s) or method(s) apply?\n5. Are horizontal and vertical components independent?'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'A ball is dropped from a tower. It covers 25m in the last second of its fall. Find the height of the tower. (g = 10 m/s\u00B2)',
        correctAnswer: 45,
        unit: 'm',
        explanation: 'Let total time = t. Distance in last 1s: s_last = \u00BDg(2t-1) = 5(2t-1) = 25 \u2192 2t-1 = 5 \u2192 t = 3s. Height = \u00BDgt\u00B2 = \u00BD(10)(9) = 45m.'
      },
      {
        type: 'interactive',
        interactionType: 'number-input',
        prompt: 'Two balls are thrown simultaneously: Ball A upward at 40 m/s and Ball B downward at 20 m/s from a 200m tall tower. How long before they are at the same height? (g = 10 m/s\u00B2)',
        correctAnswer: 10,
        unit: 's',
        explanation: 'Position of A: y_A = 40t - 5t\u00B2. Position of B (from top): y_B = 200 - 20t - 5t\u00B2 (wait, B goes down from 200m). Actually: A from ground: y_A = 40t - 5t\u00B2. B from top: y_B = 200 - 20t - 5t\u00B2. Set equal: 40t - 5t\u00B2 = 200 - 20t - 5t\u00B2 \u2192 60t = 200 \u2192 t = 10/3 \u2248 3.33s... Let me reconsider. If both from same point: they separate at relative velocity 60 m/s (40+20). They meet when one catches the other after going around. But the problem says A upward and B downward from a 200m tower. A starts from bottom: y_A = 40t - 5t\u00B2. B starts from top (200m): y_B = 200 - 20t - 5t\u00B2. Equal: 40t - 5t\u00B2 = 200 - 20t - 5t\u00B2 \u2192 60t = 200 \u2192 t = 200/60 = 10/3 s.'
      },
      {
        type: 'quiz',
        questions: [
          {
            id: 'km-q1',
            question: 'A projectile has a range of 160m when launched at 45\u00B0. What is its launch speed? (g = 10 m/s\u00B2)',
            type: 'number',
            correctAnswer: 40,
            unit: 'm/s',
            explanation: 'R = u\u00B2sin(90\u00B0)/g = u\u00B2/g. So 160 = u\u00B2/10 \u2192 u\u00B2 = 1600 \u2192 u = 40 m/s.'
          },
          {
            id: 'km-q2',
            question: 'A car travels the first half of a distance at 40 km/h and the second half at 60 km/h. What is the average speed for the whole trip?',
            type: 'number',
            correctAnswer: 48,
            unit: 'km/h',
            explanation: 'Let total distance = 2d. Time for first half = d/40. Time for second half = d/60. Total time = d(1/40 + 1/60) = d(5/120) = d/24. Average speed = 2d/(d/24) = 48 km/h.'
          },
          {
            id: 'km-q3',
            question: 'A body starts from rest and travels distances in ratio 1:3:5:7 in successive equal time intervals. This indicates:',
            type: 'mcq',
            options: ['Uniform velocity', 'Uniform acceleration', 'Non-uniform acceleration', 'Decreasing velocity'],
            correctAnswer: 1,
            explanation: 'Distances in successive equal time intervals being in ratio 1:3:5:7 (odd numbers) is a hallmark of uniformly accelerated motion from rest.'
          },
          {
            id: 'km-q4',
            question: 'A stone is thrown at 30\u00B0 to the horizontal. Its velocity at the highest point is (initial speed u):',
            type: 'mcq',
            options: ['Zero', 'u/2', 'u\u221A3/2', 'u'],
            correctAnswer: 2,
            explanation: 'At the highest point, vertical velocity = 0. Only horizontal velocity remains = u cos30\u00B0 = u\u221A3/2.'
          }
        ]
      }
    ]
  }
];
