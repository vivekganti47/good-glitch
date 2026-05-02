// ---------------------------------------------------------------------------
// Force Nexus — Side Quests (Newton's Laws of Motion)
// Topics: Newton's laws, friction, free-body diagrams, circular motion
// g = 10 m/s² throughout
// ---------------------------------------------------------------------------

export const forceNexusQuests = [
  // =======================================================================
  // QUEST 1 — The Space Station Rescue
  // =======================================================================
  {
    id: 'space-station-rescue',
    name: 'The Space Station Rescue',
    constellationId: 'force-nexus',
    order: 1,
    xp: 160,
    intro:
      'Space Station **Archon-7** is caught in a decaying orbit. Its attitude thrusters have malfunctioned, and the station is slowly tumbling. You have been dispatched as the lead rescue engineer. To stabilize the station, dock supply modules, and repair the systems, you must apply Newton\'s laws with precision. Every force must be accounted for — one miscalculation and the station spins out of control.',
    loreReward:
      'Archon-7 is stabilized and its orbit restored. The station commander enters your solutions into the **Force Nexus Archives**, noting that your free-body analysis was flawless. Future engineers will study your rescue as a textbook case.',
    titleReward: 'Station Stabilizer',
    badgeReward: 'archon-rescuer',
    parts: [
      {
        title: 'The Tumbling Station',
        story:
          'You arrive at Archon-7. The station has a mass of **50,000 kg** and is tumbling because a thruster fired accidentally, applying a force of **1000 N** for some time. Your first task is to calculate the acceleration it caused so you can plan the counter-thrust.',
        question: {
          text: 'What acceleration does a 1000 N force produce on a 50,000 kg station?',
          options: ['0.02 m/s²', '0.2 m/s²', '2 m/s²', '0.002 m/s²'],
          correctIndex: 0,
          explanation:
            'Using Newton\'s second law, F = ma: a = F/m = 1000/50000 = 0.02 m/s². Even a small acceleration, over time, can cause significant tumbling in space where there is no friction to stop the rotation.',
        },
        reveal:
          'The tumble rate matches an acceleration of 0.02 m/s² applied over the recorded duration. Now you know exactly what counter-force is needed. You program the rescue thrusters to fire in the opposite direction.',
      },
      {
        title: 'Newton\'s Third Law Docking',
        story:
          'Your rescue shuttle (mass **2000 kg**) needs to dock with the station (mass **50,000 kg**). During the docking maneuver, the shuttle pushes against the station with a force of **500 N**. The mission commander asks you about the forces involved.',
        question: {
          text: 'When the shuttle pushes the station with 500 N, what force does the station exert on the shuttle?',
          options: [
            '500 N in the opposite direction',
            '20 N in the opposite direction (proportional to mass ratio)',
            '500 N in the same direction',
            '0 N — the station is much heavier',
          ],
          correctIndex: 0,
          explanation:
            'By Newton\'s third law, action and reaction are equal and opposite. The station pushes back on the shuttle with exactly 500 N, regardless of the mass difference. The accelerations are different (a_shuttle = 500/2000 = 0.25 m/s², a_station = 500/50000 = 0.01 m/s²), but the forces are always equal.',
        },
        reveal:
          'The shuttle decelerates at 0.25 m/s² while the station barely nudges at 0.01 m/s². Despite the equal forces, the mass difference means very different accelerations. The docking clamps engage successfully — you are now attached to Archon-7.',
      },
      {
        title: 'The Supply Crate Problem',
        story:
          'Inside the station, artificial gravity is set to **g = 10 m/s²**. You need to push a **40 kg** supply crate across the deck to the repair bay. The coefficient of kinetic friction between the crate and the deck is **μk = 0.3**. You push it with a constant horizontal force.',
        questionContext: 'First calculate the friction force: f = μk × N = μk × mg. Then find the net force needed for a given acceleration.',
        question: {
          text: 'What horizontal force must you apply to the 40 kg crate to accelerate it at 2 m/s² across the deck? (μk = 0.3, g = 10 m/s²)',
          options: ['200 N', '80 N', '120 N', '160 N'],
          correctIndex: 0,
          explanation:
            'Normal force N = mg = 40 × 10 = 400 N. Friction f = μk × N = 0.3 × 400 = 120 N. By Newton\'s second law: F − f = ma, so F = ma + f = (40)(2) + 120 = 80 + 120 = 200 N. You need 120 N just to overcome friction, plus 80 N to produce the desired acceleration.',
        },
        reveal:
          'You push with 200 N and the crate slides smoothly toward the repair bay at exactly the right acceleration. The friction calculation was essential — without it, you would have underestimated the required force and the crate would have barely moved.',
      },
      {
        title: 'The Elevator Shaft',
        story:
          'The repair bay is on a different deck. You ride a service elevator (the station simulates gravity). You step on a scale in the elevator. Your mass is **60 kg**. The elevator accelerates upward at **3 m/s²**.',
        question: {
          text: 'What does the scale read (apparent weight) when the elevator accelerates upward at 3 m/s²? (g = 10 m/s²)',
          options: ['780 N', '600 N', '420 N', '180 N'],
          correctIndex: 0,
          explanation:
            'In an elevator accelerating upward, the apparent weight (normal force) is N = m(g + a) = 60(10 + 3) = 60 × 13 = 780 N. Your true weight is mg = 600 N, but the upward acceleration makes you feel heavier. If the elevator decelerated (or accelerated downward), you would feel lighter.',
        },
        reveal:
          'The scale reads 780 N — you feel heavier as the elevator surges upward. This is the same physics that makes you feel pressed into your seat during a rocket launch. The elevator reaches the repair deck, and you step out feeling your normal 600 N again.',
      },
      {
        title: 'Centripetal Force Calibration',
        story:
          'The station generates artificial gravity by rotating. One of the outer ring sections has a radius of **100 m** and rotates so that objects on the rim experience a centripetal acceleration equal to **10 m/s²** (matching Earth\'s gravity). A critical repair tool (mass **5 kg**) sits on the floor of this rotating section.',
        question: {
          text: 'What centripetal force acts on the 5 kg tool sitting on the rim of the rotating section? (centripetal acceleration = 10 m/s²)',
          options: ['50 N', '500 N', '5 N', '100 N'],
          correctIndex: 0,
          explanation:
            'Centripetal force F = mac = 5 × 10 = 50 N, directed toward the center of rotation. This force is provided by the normal force from the floor (which is the outer wall of the rotating ring). The tool "feels" a weight of 50 N, just as it would under Earth\'s gravity. This is how rotating space stations simulate gravity.',
        },
        reveal:
          'The centripetal force is exactly 50 N — the rotation perfectly simulates Earth gravity in this section. You secure the repair tool and head to the thruster control room. With your understanding of forces, the final repairs are straightforward. Station Archon-7 is saved.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Gravity Well Escape
  // =======================================================================
  {
    id: 'gravity-well-escape',
    name: 'Gravity Well Escape',
    constellationId: 'force-nexus',
    order: 2,
    xp: 170,
    intro:
      'Your ship has crash-landed on **Planet Nexara**, a rocky world with surface gravity of **10 m/s²**. The engines are damaged but repairable. To escape the planet, you must solve a series of force problems — from pulling the ship out of a crater to launching it on an inclined ramp. Every problem tests a different aspect of Newton\'s laws. The planet\'s atmosphere is thin, so air resistance can be neglected.',
    loreReward:
      'You lift off from Nexara\'s surface, leaving behind data beacons that map the planet\'s gravitational field. The **Nexara Force Tables** are added to the Force Nexus records — a complete catalog of friction coefficients and incline angles for the planet\'s terrain.',
    titleReward: 'Nexara Escapee',
    badgeReward: 'gravity-well-survivor',
    parts: [
      {
        title: 'Inertia of the Wreckage',
        story:
          'Your ship lies in a crater, undamaged but stuck. Before you can move it, you notice a strange phenomenon: a loose **2 kg** toolbox on the perfectly smooth (frictionless) dashboard refuses to slide even though the ship is tilted. Then you realize — the surface IS frictionless; the toolbox is simply not being acted upon by any net horizontal force.',
        question: {
          text: 'A 2 kg object sits on a frictionless horizontal surface. What net force is needed to keep it stationary?',
          options: [
            '0 N — no net force is needed',
            '20 N to balance gravity',
            '2 N to overcome inertia',
            'It cannot remain stationary on a frictionless surface',
          ],
          correctIndex: 0,
          explanation:
            'Newton\'s first law: an object at rest remains at rest unless acted upon by a net external force. On a horizontal frictionless surface, the normal force balances gravity vertically. No horizontal force acts, so no horizontal force is needed to keep it stationary. Inertia is not a force — it is the tendency of objects to resist changes in their state of motion.',
        },
        reveal:
          'The toolbox sits perfectly still, demonstrating Newton\'s first law in action. Inertia keeps it at rest. This simple observation reminds you that understanding "no force needed" is just as important as calculating forces.',
      },
      {
        title: 'Pulling the Ship Free',
        story:
          'To extract the ship from the crater, you attach a cable to a winch anchored at the top. The ship has a mass of **800 kg**. The crater wall makes a **30°** incline. The coefficient of kinetic friction between the ship\'s hull and the rock is **0.2**. You need to pull the ship up the incline at constant velocity.',
        questionContext: 'At constant velocity, acceleration = 0, so net force = 0. The pull force must equal the sum of the gravity component along the incline and friction. Use sin 30° = 0.5, cos 30° = 0.866, g = 10 m/s².',
        question: {
          text: 'What force is needed to pull the 800 kg ship up a 30° incline at constant velocity? (μk = 0.2, g = 10 m/s²)',
          options: ['5386 N', '4000 N', '2000 N', '8000 N'],
          correctIndex: 0,
          explanation:
            'Component of gravity along incline: mg sin 30° = 800 × 10 × 0.5 = 4000 N. Normal force: N = mg cos 30° = 800 × 10 × 0.866 = 6928 N. Friction: f = μk × N = 0.2 × 6928 = 1385.6 N. Total pull force = 4000 + 1385.6 ≈ 5386 N. At constant velocity, the pulling force exactly balances the opposing forces.',
        },
        reveal:
          'The winch strains at about 5386 N and the ship begins its slow, steady ascent out of the crater. Constant velocity means zero net force — the pull exactly cancels gravity\'s component and friction combined. You clear the crater rim and reach flat ground.',
      },
      {
        title: 'The Connected Blocks',
        story:
          'To repair the ship, you need to move two supply containers connected by a rope. Container A (mass **10 kg**) is on a table, connected via a frictionless pulley to Container B (mass **5 kg**) hanging off the edge. The table surface is frictionless.',
        question: {
          text: 'What is the acceleration of the two-container system? (g = 10 m/s²)',
          options: [
            '3.33 m/s²',
            '5 m/s²',
            '10 m/s²',
            '6.67 m/s²',
          ],
          correctIndex: 0,
          explanation:
            'The net force driving the system is the weight of the hanging container: F = m_B × g = 5 × 10 = 50 N. The total mass being accelerated is m_A + m_B = 10 + 5 = 15 kg. Acceleration a = F / (m_A + m_B) = 50 / 15 = 3.33 m/s². Container B falls while Container A slides across the table, both with the same acceleration.',
        },
        reveal:
          'Container B descends and Container A slides across the frictionless table, both accelerating at 3.33 m/s². The rope tension is T = m_A × a = 10 × 3.33 = 33.3 N — less than the weight of B (50 N) because B must accelerate downward. The supplies reach you right on schedule.',
      },
      {
        title: 'Banking the Turn',
        story:
          'The repaired ship must taxi along a circular test track (radius **50 m**) on the planet\'s surface at **20 m/s** to calibrate the steering. The track is banked at an angle to allow the turn without friction. You need to determine if the current bank angle is correct.',
        questionContext: 'For a banked turn without friction: tan θ = v² / (rg).',
        question: {
          text: 'What banking angle allows a vehicle to turn on a 50 m radius track at 20 m/s without friction? (g = 10 m/s²)',
          options: [
            'tan θ = 0.8, so θ ≈ 38.7°',
            'tan θ = 0.4, so θ ≈ 21.8°',
            'tan θ = 2.0, so θ ≈ 63.4°',
            'tan θ = 1.0, so θ = 45°',
          ],
          correctIndex: 0,
          explanation:
            'For a frictionless banked turn: tan θ = v²/(rg) = (20)²/(50 × 10) = 400/500 = 0.8. Therefore θ = arctan(0.8) ≈ 38.7°. At this angle, the horizontal component of the normal force provides exactly the centripetal force needed, and no friction is required.',
        },
        reveal:
          'The track is banked at 38.7° — the ship glides through the turn smoothly with zero lateral forces on the hull. The steering calibration is perfect. One final test remains before launch.',
      },
    ],
  },
]
