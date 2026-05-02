// ---------------------------------------------------------------------------
// Kinesis Prime — Side Quests (Kinematics)
// Topics: distance, displacement, velocity, acceleration, projectile motion
// g = 10 m/s² throughout
// ---------------------------------------------------------------------------

export const kinesisQuests = [
  // =======================================================================
  // QUEST 1 — The Asteroid Navigation Challenge
  // =======================================================================
  {
    id: 'asteroid-navigation',
    name: 'The Asteroid Navigation Challenge',
    constellationId: 'kinesis-prime',
    order: 1,
    xp: 150,
    intro:
      'Your deep-space cruiser has entered the **Veylan Asteroid Belt**, a treacherous maze of drifting rocks and debris. The autopilot is offline, and you must navigate manually using nothing but your knowledge of kinematics. Every calculation you make determines whether the ship threads through safely or collides with a tumbling asteroid. The bridge crew is counting on you, Navigator.',
    loreReward:
      'The Veylan Belt has been charted. Future navigators will use your flight data as a training exercise. The ship\'s AI has recorded your solutions into the **Kinesis Codex**, unlocking new pathways in the constellation.',
    titleReward: 'Belt Runner',
    badgeReward: 'asteroid-navigator',
    parts: [
      {
        title: 'Entering the Belt',
        story:
          'The ship enters the asteroid belt at a steady velocity. Your first task: the navigation computer needs you to distinguish between the **total path length** the ship has traveled and the **net change in position**. A sensor probe was launched earlier that traveled 500 m east, then 300 m west, and finally 400 m east.',
        question: {
          text: 'What are the **distance** and **displacement** of the sensor probe respectively?',
          options: [
            '1200 m and 600 m east',
            '1200 m and 200 m east',
            '600 m and 600 m east',
            '1200 m and 400 m east',
          ],
          correctIndex: 0,
          explanation:
            'Distance is the total path length: 500 + 300 + 400 = 1200 m. Displacement is the net change in position: 500 − 300 + 400 = 600 m east. Distance is a scalar (always positive), while displacement is a vector (has direction).',
        },
        reveal:
          'The probe data calibrates your sensors perfectly. You can now distinguish real motion from sensor echoes. The navigation display lights up with precise vectors — the belt suddenly looks a lot less chaotic.',
      },
      {
        title: 'Dodging the First Cluster',
        story:
          'A cluster of asteroids is dead ahead! You accelerate the ship from rest. The engines fire and give you a constant acceleration. You need to cover **125 m** to slip through a gap before the asteroids close it. Your engines provide an acceleration of **10 m/s²**.',
        questionContext: 'Use the equation s = ut + ½at² where u = 0.',
        question: {
          text: 'How long does it take the ship to cover 125 m from rest at 10 m/s²?',
          options: ['3 s', '5 s', '12.5 s', '25 s'],
          correctIndex: 1,
          explanation:
            'Using s = ut + ½at²: 125 = 0 + ½(10)t², so t² = 25, giving t = 5 s. Since the ship starts from rest (u = 0), the first term vanishes.',
        },
        reveal:
          'Five seconds of full burn and the ship slips through the gap with meters to spare. The asteroids grind together behind you — the gap is sealed. Your timing was perfect.',
      },
      {
        title: 'Speed Check at the Relay Beacon',
        story:
          'You approach a relay beacon that records your velocity. The ship has been accelerating uniformly at **4 m/s²** for **8 seconds** from an initial speed of **12 m/s**. The beacon asks for your current speed to authorize passage.',
        question: {
          text: 'What is the ship\'s velocity after 8 s of acceleration?',
          options: ['32 m/s', '44 m/s', '20 m/s', '96 m/s'],
          correctIndex: 1,
          explanation:
            'Using v = u + at: v = 12 + (4)(8) = 12 + 32 = 44 m/s. This is the first equation of motion applied directly.',
        },
        reveal:
          'The beacon accepts your speed reading and opens the transit corridor. A holographic arrow lights up the safe path through the next section of the belt. Other ships in the area receive your beacon update — you are helping the entire fleet.',
      },
      {
        title: 'The Vertical Shaft',
        story:
          'The belt contains a long vertical shaft — a tunnel through a massive hollowed-out asteroid. You need to drop a calibration weight from the top to measure the shaft\'s depth. The weight takes **4 seconds** to hit the bottom. There is no air resistance inside the shaft, and the asteroid\'s local gravity is **10 m/s²**.',
        question: {
          text: 'What is the depth of the shaft? (g = 10 m/s²)',
          options: ['40 m', '80 m', '160 m', '20 m'],
          correctIndex: 1,
          explanation:
            'Using s = ut + ½gt²: s = 0 + ½(10)(4²) = ½(10)(16) = 80 m. The weight starts from rest, so u = 0.',
        },
        reveal:
          'The shaft is exactly 80 meters deep. Your calibration weight\'s data reveals the asteroid\'s internal structure — it is mostly hollow, a natural tunnel that ships can pass through safely. You update the star-chart with this discovery.',
      },
      {
        title: 'The Final Projectile',
        story:
          'You are almost through the belt, but one last challenge remains. A rogue asteroid is approaching from the side. Your defense turret fires a projectile horizontally at **40 m/s** from a height of **80 m** above the asteroid\'s surface. You need to calculate where the projectile will land to program the intercept.',
        questionContext: 'Treat this as projectile motion. The projectile is launched horizontally, so its initial vertical velocity is zero. Use g = 10 m/s².',
        question: {
          text: 'What is the horizontal distance traveled by the projectile before it hits the surface 80 m below?',
          options: ['80 m', '160 m', '120 m', '40 m'],
          correctIndex: 1,
          explanation:
            'First find time of flight: 80 = ½(10)t², so t² = 16, t = 4 s. Then horizontal distance = horizontal velocity × time = 40 × 4 = 160 m. In projectile motion, horizontal and vertical motions are independent.',
        },
        reveal:
          'The projectile strikes the asteroid at exactly 160 m, shattering it into harmless dust. You emerge from the Veylan Belt with a flawless navigation record. The ship\'s computer logs your achievement: **Belt Runner — zero collisions, five perfect calculations.**',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Escape Velocity Mission
  // =======================================================================
  {
    id: 'escape-velocity-mission',
    name: 'Escape Velocity Mission',
    constellationId: 'kinesis-prime',
    order: 2,
    xp: 180,
    intro:
      'A distress signal arrives from **Station Artemis**, stranded on a small moon with failing engines. To rescue the crew, you must launch a supply pod from your orbiting ship. But the moon has its own gravitational pull, and every trajectory must be calculated with precision. Your knowledge of kinematics — especially projectile motion and equations of motion — is the only thing standing between the crew and disaster.',
    loreReward:
      'Station Artemis is saved. The crew transmits the **Artemis Navigation Theorems** to your ship — a set of advanced kinematic relationships discovered during their years on the moon. These theorems are now encoded in the Kinesis Prime constellation records.',
    titleReward: 'Artemis Rescuer',
    badgeReward: 'escape-velocity-hero',
    parts: [
      {
        title: 'Orbital Approach',
        story:
          'Your ship decelerates as it approaches the moon. It was traveling at **100 m/s** and applies brakes that produce a retardation of **5 m/s²**. You need to calculate the distance required to come to a complete stop so you can begin the rescue from a stationary orbit.',
        question: {
          text: 'What distance does the ship need to come to rest from 100 m/s with a deceleration of 5 m/s²?',
          options: ['500 m', '1000 m', '2000 m', '200 m'],
          correctIndex: 1,
          explanation:
            'Using v² = u² + 2as: 0 = (100)² + 2(−5)(s), so 10000 = 10s, giving s = 1000 m. The deceleration is negative since it opposes the motion.',
        },
        reveal:
          'The ship glides to a perfect stop at exactly 1000 m from the approach point. You are now in stationary orbit above Station Artemis. The rescue mission begins.',
      },
      {
        title: 'Launching the Supply Pod',
        story:
          'You launch the supply pod downward toward the moon\'s surface. It is launched vertically with an initial downward velocity of **20 m/s**. The moon\'s gravitational acceleration is **10 m/s²** (conveniently similar to Earth). The surface is **240 m** below.',
        questionContext: 'The pod accelerates downward under gravity. Find the time to reach the surface.',
        question: {
          text: 'How long does the supply pod take to reach the surface 240 m below? (launched downward at 20 m/s, g = 10 m/s²)',
          options: ['4 s', '6 s', '8 s', '24 s'],
          correctIndex: 0,
          explanation:
            'Using s = ut + ½gt²: 240 = 20t + ½(10)t² = 20t + 5t². Rearranging: 5t² + 20t − 240 = 0, or t² + 4t − 48 = 0. Factoring: (t + 12)(t − 4) = 0. Since t must be positive, t = 4 s.',
        },
        reveal:
          'The pod lands in exactly 4 seconds, touching down softly on the designated landing pad. The station crew rushes out to collect the emergency supplies. One crisis averted — but the engine repairs still need guidance.',
      },
      {
        title: 'The Repair Throw',
        story:
          'An engineer on the moon\'s surface needs to throw a repair tool up to a platform **25 m** above. She throws it vertically upward with an initial speed of **30 m/s**. She wants to know the tool\'s velocity when it reaches the platform so she can ensure it won\'t damage the equipment.',
        question: {
          text: 'What is the velocity of the tool when it reaches the platform 25 m above? (g = 10 m/s², take upward as positive)',
          options: ['20 m/s upward', '10 m/s upward', '25 m/s upward', '15 m/s upward'],
          correctIndex: 0,
          explanation:
            'Using v² = u² + 2as with a = −g (upward positive): v² = (30)² + 2(−10)(25) = 900 − 500 = 400. Therefore v = 20 m/s (upward, since the tool is still rising). At the maximum height the velocity would be zero, but the platform is below max height.',
        },
        reveal:
          'The tool sails up to the platform at exactly 20 m/s — fast enough to reach but slow enough for the engineer to catch safely. She grabs it cleanly and begins repairs on the thruster housing. One step closer to getting Station Artemis back online.',
      },
      {
        title: 'The Angled Launch',
        story:
          'The repaired engine needs a test. The engineers launch a test projectile at **30 m/s** at an angle of **30 degrees** above the horizontal from the moon\'s surface to check if the thrust calculations are correct. They need to know the maximum height it reaches.',
        questionContext: 'For a projectile launched at angle θ with speed u, the vertical component is u sin θ. Maximum height H = u²sin²θ / (2g). Use sin 30° = 0.5, g = 10 m/s².',
        question: {
          text: 'What is the maximum height reached by a projectile launched at 30 m/s at 30° to the horizontal? (g = 10 m/s²)',
          options: ['11.25 m', '22.5 m', '45 m', '33.75 m'],
          correctIndex: 0,
          explanation:
            'Vertical component: uy = 30 × sin 30° = 30 × 0.5 = 15 m/s. Maximum height H = uy² / (2g) = (15)² / (2 × 10) = 225 / 20 = 11.25 m. At the maximum height, the vertical velocity becomes zero.',
        },
        reveal:
          'The test projectile rises to exactly 11.25 m before arcing back down — matching the predicted trajectory perfectly. The engine is working correctly! The station crew cheers.',
      },
      {
        title: 'The Rescue Launch',
        story:
          'It is time for the final escape. The repaired engine will launch the station\'s escape capsule at **50 m/s** at **45 degrees** above the horizontal. The crew needs to know the **range** — how far downrange the capsule will land — to position the pickup ship correctly.',
        questionContext: 'Range of a projectile: R = u² sin(2θ) / g. Use sin 90° = 1, g = 10 m/s².',
        question: {
          text: 'What is the range of the escape capsule launched at 50 m/s at 45°? (g = 10 m/s²)',
          options: ['125 m', '250 m', '500 m', '200 m'],
          correctIndex: 1,
          explanation:
            'Range R = u² sin(2θ) / g = (50)² × sin(90°) / 10 = 2500 × 1 / 10 = 250 m. At 45°, sin(2 × 45°) = sin 90° = 1, giving the maximum range for a given speed.',
        },
        reveal:
          'The capsule launches in a beautiful parabolic arc, landing exactly 250 m downrange where your pickup ship is waiting. All crew members are safely aboard. Station Artemis is evacuated, and the mission is a complete success. Your mastery of kinematics saved lives today.',
      },
    ],
  },
]
