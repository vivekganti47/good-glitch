// ---------------------------------------------------------------------------
// Momentum Forge — Side Quests (Work, Energy, Power, Momentum, Collisions)
// Topics: conservation of energy, work-energy theorem, collisions, momentum
// g = 10 m/s² throughout
// ---------------------------------------------------------------------------

export const momentumForgeQuests = [
  // =======================================================================
  // QUEST 1 — The Energy Crystal Hunt
  // =======================================================================
  {
    id: 'energy-crystal-hunt',
    name: 'The Energy Crystal Hunt',
    constellationId: 'momentum-forge',
    order: 1,
    xp: 160,
    intro:
      'Deep within the **Therion Caves** on Asteroid Kael, energy crystals have been discovered — rare minerals that store kinetic energy in their lattice structure. You have been sent to harvest them, but the caves are filled with ramps, pendulums, and gravity traps. The only way to navigate safely is to master the principles of **work, energy, and power**. Each crystal you collect teaches you something new about energy conservation.',
    loreReward:
      'The Therion Caves yield five pristine energy crystals. When brought back to the ship, they resonate at frequencies that encode the **Conservation Theorems** — fundamental laws now added to the Momentum Forge archives. The crystals will power the ship\'s shields for the journey ahead.',
    titleReward: 'Crystal Harvester',
    badgeReward: 'energy-crystal-master',
    parts: [
      {
        title: 'The First Crystal — Work Done',
        story:
          'The first crystal sits at the end of a long tunnel. To reach it, you must push a **20 kg** mining cart along a **50 m** horizontal track by applying a constant force of **100 N** parallel to the track. The tunnel is frictionless. You wonder how much work you will do by the time you reach the crystal.',
        question: {
          text: 'How much work do you do pushing a cart with 100 N over 50 m along a frictionless horizontal surface?',
          options: ['5000 J', '2500 J', '10000 J', '1000 J'],
          correctIndex: 0,
          explanation:
            'Work = Force × displacement × cos θ. Since the force is parallel to displacement, θ = 0° and cos 0° = 1. W = 100 × 50 × 1 = 5000 J. This work goes entirely into the kinetic energy of the cart on a frictionless surface.',
        },
        reveal:
          'You do 5000 J of work, and by the work-energy theorem, all of it converts to kinetic energy. The cart\'s final speed is v = √(2W/m) = √(2 × 5000/20) = √500 ≈ 22.4 m/s. You grab the first crystal as the cart rolls past.',
      },
      {
        title: 'The Pendulum Bridge',
        story:
          'The second crystal is across a chasm. The only way across is to swing on a rope (a pendulum). You grab the rope and step off a platform that is **5 m** above the lowest point of the swing. You need to know your speed at the bottom to ensure you can make it to the platform on the other side.',
        question: {
          text: 'What is your speed at the lowest point of a pendulum swing if you start from rest at a height of 5 m? (g = 10 m/s²)',
          options: ['10 m/s', '5 m/s', '20 m/s', '7.07 m/s'],
          correctIndex: 0,
          explanation:
            'Using conservation of energy: mgh = ½mv². The mass cancels: v = √(2gh) = √(2 × 10 × 5) = √100 = 10 m/s. All potential energy at the top converts to kinetic energy at the bottom (no friction or air resistance).',
        },
        reveal:
          'You swing through the lowest point at 10 m/s, feeling the rush of speed. Conservation of energy guarantees you will rise to the same height on the other side (assuming no energy loss). You land perfectly on the opposite platform and claim the second crystal.',
      },
      {
        title: 'The Ramp and the Spring',
        story:
          'The third crystal is locked behind a spring-loaded door. A **5 kg** block slides down a frictionless ramp from a height of **10 m** and hits a spring at the bottom. The spring must be compressed by a certain amount to unlock the door. The spring constant is **k = 1000 N/m**.',
        questionContext: 'Use conservation of energy: gravitational PE at the top = elastic PE in the spring at maximum compression.',
        question: {
          text: 'By how much is the spring compressed when the 5 kg block slides from a height of 10 m? (k = 1000 N/m, g = 10 m/s²)',
          options: [
            '1 m',
            '0.5 m',
            '2 m',
            '0.1 m',
          ],
          correctIndex: 0,
          explanation:
            'By conservation of energy: mgh = ½kx². So 5 × 10 × 10 = ½ × 1000 × x². This gives 500 = 500x², so x² = 1, and x = 1 m. All the gravitational potential energy (500 J) converts into elastic potential energy (½ × 1000 × 1² = 500 J) in the spring.',
        },
        reveal:
          'The spring compresses by exactly 1 meter and the door mechanism clicks open, revealing the third crystal glowing within. The beautiful exchange of gravitational potential energy to elastic potential energy happens seamlessly — total energy is conserved throughout.',
      },
      {
        title: 'The Power Generator',
        story:
          'The fourth crystal is behind a door that requires a power generator to open. You have a motor that lifts a **50 kg** counterweight through a height of **6 m** in **10 seconds**. You need to determine if the motor\'s power output is sufficient to open the door, which requires at least **250 W**.',
        question: {
          text: 'What is the power output of a motor that lifts 50 kg through 6 m in 10 s? (g = 10 m/s²)',
          options: ['300 W', '250 W', '500 W', '30 W'],
          correctIndex: 0,
          explanation:
            'Work done = mgh = 50 × 10 × 6 = 3000 J. Power = Work/time = 3000/10 = 300 W. Since 300 W > 250 W, the motor is powerful enough. Power is the rate of doing work — it tells you how quickly energy is transferred.',
        },
        reveal:
          'The motor outputs 300 W — comfortably above the 250 W threshold. The counterweight rises, the mechanism engages, and the heavy stone door grinds open. The fourth crystal floats in a gravity-null chamber inside, pulsing with stored energy.',
      },
      {
        title: 'The Final Crystal — KE and Height',
        story:
          'The fifth and rarest crystal sits atop a **45 m** tall pillar. You have a pneumatic launcher that can fire you upward. The launcher gives you an initial kinetic energy of **30,000 J**. Your mass (including suit) is **80 kg**. Will you reach the crystal, or fall short?',
        questionContext: 'Convert your initial KE to maximum height using energy conservation: ½mv² = mgh_max, so h_max = KE/(mg).',
        question: {
          text: 'A person of mass 80 kg is launched upward with KE = 30,000 J. What maximum height can they reach? (g = 10 m/s²)',
          options: ['37.5 m', '45 m', '30 m', '60 m'],
          correctIndex: 0,
          explanation:
            'Maximum height h = KE/(mg) = 30000/(80 × 10) = 30000/800 = 37.5 m. Unfortunately, this is less than 45 m — you will not reach the crystal. You need KE = mgh = 80 × 10 × 45 = 36,000 J to reach the top.',
        },
        reveal:
          'You fall short by 7.5 m! But the attempt reveals a hidden ledge at 37.5 m with a secondary launcher. Combining both launchers, you finally reach the fifth crystal. The lesson is clear: energy conservation is an absolute bookkeeper — you cannot create energy from nothing. Every joule must be accounted for.',
      },
    ],
  },

  // =======================================================================
  // QUEST 2 — Collision Course
  // =======================================================================
  {
    id: 'collision-course',
    name: 'Collision Course',
    constellationId: 'momentum-forge',
    order: 2,
    xp: 180,
    intro:
      'Asteroid fragments are heading toward **Colony Praxis**! The colony\'s defense system uses momentum-based interceptors — projectiles that collide with incoming rocks to deflect them. As the chief defense engineer, you must calculate the outcomes of each collision precisely. Elastic, inelastic, perfectly inelastic — each type of collision requires different analysis. The colony\'s survival depends on your understanding of momentum conservation.',
    loreReward:
      'Colony Praxis survives unscathed. The defense data you generated during the crisis is compiled into the **Collision Codex**, a reference manual for momentum-based defense systems. The codex is encoded into the Momentum Forge constellation, where it will guide future defenders.',
    titleReward: 'Colony Defender',
    badgeReward: 'collision-master',
    parts: [
      {
        title: 'First Contact — Impulse',
        story:
          'The first asteroid fragment approaches. Your turret fires a defense projectile that strikes the fragment and bounces off. The projectile has mass **2 kg** and hits the fragment at **50 m/s**, bouncing back at **30 m/s**. You need to calculate the impulse delivered to the fragment to verify it was deflected enough.',
        question: {
          text: 'What is the magnitude of the impulse delivered to the asteroid fragment by the 2 kg projectile? (initial velocity: +50 m/s, final velocity: −30 m/s)',
          options: ['160 N·s', '40 N·s', '80 N·s', '100 N·s'],
          correctIndex: 0,
          explanation:
            'Impulse = change in momentum of the projectile = m(v_f − v_i) = 2(−30 − 50) = 2(−80) = −160 N·s. The magnitude is 160 N·s. By Newton\'s third law, the impulse on the fragment is 160 N·s in the forward direction. The bounce (rebound) makes the impulse larger than if the projectile had simply stopped.',
        },
        reveal:
          'The 160 N·s impulse is enough to nudge the first fragment off its collision course. You note that a bouncing projectile delivers more impulse than one that sticks — because the change in momentum is greater when the projectile reverses direction.',
      },
      {
        title: 'The Sticky Collision',
        story:
          'A larger fragment requires a different approach. You fire a heavy slug (mass **10 kg**, velocity **100 m/s**) that embeds itself in the fragment (mass **40 kg**, initially at rest). This is a perfectly inelastic collision. You need the final velocity to confirm the fragment is deflected.',
        question: {
          text: 'In a perfectly inelastic collision, a 10 kg slug at 100 m/s hits a stationary 40 kg fragment. What is their combined velocity?',
          options: ['20 m/s', '50 m/s', '25 m/s', '10 m/s'],
          correctIndex: 0,
          explanation:
            'Conservation of momentum: m₁v₁ + m₂v₂ = (m₁ + m₂)v_f. So 10(100) + 40(0) = (10 + 40)v_f. 1000 = 50v_f, giving v_f = 20 m/s. In a perfectly inelastic collision, the objects stick together and kinetic energy is NOT conserved (some is lost to deformation/heat), but momentum IS always conserved.',
        },
        reveal:
          'The slug embeds itself and the combined mass moves at 20 m/s — enough to clear the colony. The kinetic energy before was ½(10)(100²) = 50,000 J, but after it is only ½(50)(20²) = 10,000 J. A full 40,000 J was lost to deformation. Momentum is conserved; energy is not in inelastic collisions.',
      },
      {
        title: 'The Elastic Deflection',
        story:
          'A medium-sized fragment (mass **3 kg**, velocity **40 m/s**) is on a head-on course. You launch an interceptor of equal mass (**3 kg**) at **60 m/s** directly at it. The collision is perfectly elastic. You need to find the velocities after the collision.',
        questionContext: 'In a head-on elastic collision between equal masses, the velocities are exchanged.',
        question: {
          text: 'In a head-on elastic collision between equal masses (3 kg each), one moving at 60 m/s and the other at 40 m/s toward each other, what are the velocities after collision?',
          options: [
            'The interceptor moves at 40 m/s backward; the fragment moves at 60 m/s backward',
            'Both move at 10 m/s forward',
            'The interceptor stops; the fragment moves at 100 m/s',
            'Both move at 50 m/s in opposite directions',
          ],
          correctIndex: 0,
          explanation:
            'In an elastic collision between equal masses, the velocities are exchanged. Taking the interceptor\'s direction as positive: interceptor goes from +60 to −40 m/s (now moves backward at 40 m/s), and the fragment goes from −40 to +60 m/s. Wait — let me be more careful. Let interceptor move in +x at 60 m/s, fragment in −x at 40 m/s. For equal-mass elastic collisions, they exchange velocities: interceptor gets −40 m/s (moves backward at 40), fragment gets +60 m/s (moves backward from its original direction at 60). The fragment is deflected backward at 60 m/s.',
        },
        reveal:
          'The velocities swap perfectly — a hallmark of equal-mass elastic collisions. The fragment reverses direction, flying away from the colony at high speed. Both kinetic energy and momentum are conserved. This is the most efficient type of deflection.',
      },
      {
        title: 'Momentum Conservation — Two Fragments',
        story:
          'An asteroid explodes into two fragments. Fragment A (mass **6 kg**) flies off at **25 m/s** to the east. The original asteroid had mass **10 kg** and was moving at **15 m/s** to the east before the explosion. You need to find Fragment B\'s velocity to predict its trajectory.',
        question: {
          text: 'A 10 kg asteroid moving at 15 m/s east explodes into a 6 kg fragment at 25 m/s east and a 4 kg fragment. What is the velocity of the 4 kg fragment?',
          options: [
            '0 m/s — it is stationary',
            '15 m/s east',
            '37.5 m/s east',
            '15 m/s west',
          ],
          correctIndex: 0,
          explanation:
            'Conservation of momentum: 10 × 15 = 6 × 25 + 4 × v_B. So 150 = 150 + 4v_B, giving 4v_B = 0, v_B = 0 m/s. Fragment B is momentarily stationary after the explosion. All the original momentum was transferred to Fragment A.',
        },
        reveal:
          'Fragment B hangs motionless in space — all the momentum was carried away by Fragment A. This is a beautiful example of momentum conservation during explosions (which are like "reverse collisions"). The fragment poses no threat to the colony, so you leave it be.',
      },
      {
        title: 'The Final Wave — Coefficient of Restitution',
        story:
          'The last and largest fragment approaches. Your defense team fires a projectile (mass **5 kg**, velocity **100 m/s**) at the fragment (mass **15 kg**, velocity **20 m/s** toward the colony). The collision has a **coefficient of restitution e = 0.5**. You must determine if the fragment is deflected or continues toward the colony.',
        questionContext: 'Use: (1) m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂, and (2) e = (v₂ − v₁)/(u₁ − u₂). Let the projectile direction be positive.',
        question: {
          text: 'After the collision (e = 0.5), what is the velocity of the 15 kg fragment? (projectile: 5 kg at +100 m/s, fragment: 15 kg at −20 m/s)',
          options: [
            '25 m/s (away from colony)',
            '10 m/s (toward colony)',
            '0 m/s',
            '40 m/s (away from colony)',
          ],
          correctIndex: 0,
          explanation:
            'Taking projectile direction as positive: u₁ = +100, u₂ = −20. Momentum conservation: 5(100) + 15(−20) = 5v₁ + 15v₂, so 500 − 300 = 5v₁ + 15v₂, giving 5v₁ + 15v₂ = 200 ... (i). Restitution: e = (v₂ − v₁)/(u₁ − u₂) = 0.5, so v₂ − v₁ = 0.5(100 − (−20)) = 0.5(120) = 60 ... (ii). From (ii): v₁ = v₂ − 60. Substituting into (i): 5(v₂ − 60) + 15v₂ = 200, so 20v₂ − 300 = 200, 20v₂ = 500, v₂ = 25 m/s. The fragment now moves at +25 m/s — away from the colony!',
        },
        reveal:
          'The fragment\'s velocity is reversed — it now moves at 25 m/s away from the colony! The coefficient of restitution told you exactly how "bouncy" the collision would be. With e = 1 (perfectly elastic), maximum energy is conserved; with e = 0 (perfectly inelastic), the objects stick together. This collision at e = 0.5 falls between these extremes. Colony Praxis is safe.',
      },
    ],
  },
]
