export const dailyInsights = [
  {
    id: 'ins-01', type: 'attention', icon: 'AlertTriangle',
    title: '3 students need attention',
    description: 'Rahul, Pooja, and Manish have shown declining engagement over the past week in Class 10-A and 10-B.',
    priority: 'high', classId: '10-A',
    relatedStudentIds: ['stu-29', 'stu-30', 'stu-31'],
    actionLabel: 'View Students', actionRoute: '/pulse/classroom/10-A',
  },
  {
    id: 'ins-02', type: 'reteach', icon: 'RefreshCw',
    title: 'Quadratic Equations needs reteaching',
    description: 'Only 58% comprehension in 10-B. 12 out of 28 students scored below 50% on the last assessment.',
    priority: 'high', classId: '10-B',
    relatedStudentIds: [],
    actionLabel: 'View Analysis', actionRoute: '/pulse/reteach/10-B',
  },
  {
    id: 'ins-03', type: 'positive', icon: 'TrendingUp',
    title: 'Class 10-A average up 8%',
    description: 'Overall comprehension improved from 64% to 72% this month. Statistics and probability are strong areas.',
    priority: 'low', classId: '10-A',
    relatedStudentIds: [],
    actionLabel: 'View Details', actionRoute: '/pulse/classroom/10-A',
  },
  {
    id: 'ins-04', type: 'grouping', icon: 'Users',
    title: 'Peer tutoring opportunity',
    description: 'Aarav (92% algebra) and Priya (48% algebra) would make an effective peer tutoring pair based on complementary strengths.',
    priority: 'medium', classId: '10-A',
    relatedStudentIds: ['stu-01', 'stu-14'],
    actionLabel: 'View Groups', actionRoute: '/pulse/groups/10-A',
  },
  {
    id: 'ins-05', type: 'attention', icon: 'AlertTriangle',
    title: 'Arjun disengaged for 30+ minutes',
    description: 'Arjun Desai has not participated in the last 30 minutes and shows signs of frustration. Consider a one-on-one check-in.',
    priority: 'high', classId: '10-A',
    relatedStudentIds: ['stu-11'],
    actionLabel: 'View Profile', actionRoute: '/pulse/student/stu-11',
  },
  {
    id: 'ins-06', type: 'reteach', icon: 'RefreshCw',
    title: 'Calculus intro struggling in 11-A',
    description: 'Only 58% average comprehension. Students struggle with limit concepts. Consider visual Desmos-based approach.',
    priority: 'medium', classId: '11-A',
    relatedStudentIds: ['stu-33'],
    actionLabel: 'View Analysis', actionRoute: '/pulse/reteach/11-A',
  },
  {
    id: 'ins-07', type: 'positive', icon: 'TrendingUp',
    title: 'Ishita excelling across all topics',
    description: 'Ishita Gupta has maintained 90%+ comprehension consistently. Consider advanced enrichment activities.',
    priority: 'low', classId: '11-A',
    relatedStudentIds: ['stu-06'],
    actionLabel: 'View Profile', actionRoute: '/pulse/student/stu-06',
  },
]

export const reteachingRecommendations = [
  {
    topicId: 'quadratic-equations', classId: '10-B', comprehension: 58, studentsStruggling: 5, totalStudents: 11,
    suggestion: 'Use graphical method to show roots visually before algebraic manipulation. Start with perfect squares.',
    alternateApproach: 'Try peer tutoring: pair Saanvi (88%) with Priya (64%) and Aditya (84%) with Manish (40%).',
  },
  {
    topicId: 'fractions', classId: '10-A', comprehension: 64, studentsStruggling: 5, totalStudents: 12,
    suggestion: 'Use fraction bars and visual pizza models. Many students add numerators without finding common denominators.',
    alternateApproach: 'Cooking measurement activity — use real recipe scaling to build fraction intuition.',
  },
  {
    topicId: 'calculus-intro', classId: '11-A', comprehension: 58, studentsStruggling: 4, totalStudents: 9,
    suggestion: 'Build intuition through velocity-distance graphs before formal limit definition. Use Desmos for interactive exploration.',
    alternateApproach: 'Zoom-in activity: have students zoom into curves on graphing calculator to discover tangent lines.',
  },
  {
    topicId: 'trigonometry', classId: '10-B', comprehension: 60, studentsStruggling: 4, totalStudents: 11,
    suggestion: 'Unit circle hands-on activity with protractors. Focus on building ratio intuition before identities.',
    alternateApproach: 'Height and distance outdoor measurement lab — students calculate building heights.',
  },
  {
    topicId: 'newtons-laws', classId: '11-B', comprehension: 66, studentsStruggling: 3, totalStudents: 7,
    suggestion: 'Focus on free body diagram mastery. Most errors come from incorrect force identification.',
    alternateApproach: 'Cart and ramp experiments with spring scales for hands-on force measurement.',
  },
]

export const groupingSuggestions = {
  'peer-tutoring': [
    { id: 'pt-1', students: ['stu-01', 'stu-29'], topic: 'algebra', reasoning: 'Aarav excels at algebra (92%) while Rahul struggles (45%). Aarav is a kinesthetic learner who explains by doing.', predictedBenefit: '+15% comprehension for Rahul' },
    { id: 'pt-2', students: ['stu-02', 'stu-14'], topic: 'geometry', reasoning: 'Ananya (91% geometry) can help Priya (70%). Both are detail-oriented and work well in quiet settings.', predictedBenefit: '+10% comprehension for Priya' },
    { id: 'pt-3', students: ['stu-06', 'stu-33'], topic: 'algebra', reasoning: 'Ishita (91%) is patient and articulate — ideal for helping Rajat (46%) build foundational skills.', predictedBenefit: '+18% comprehension for Rajat' },
    { id: 'pt-4', students: ['stu-04', 'stu-31'], topic: 'linear-equations', reasoning: 'Saanvi (90%) can mentor Manish (44%). Saanvi\'s visual approach matches Manish\'s learning preference.', predictedBenefit: '+16% comprehension for Manish' },
    { id: 'pt-5', students: ['stu-03', 'stu-30'], topic: 'fractions', reasoning: 'Vivaan (88% fractions) is energetic and explains through examples — matches Pooja\'s need for concrete demonstrations.', predictedBenefit: '+12% comprehension for Pooja' },
    { id: 'pt-6', students: ['stu-10', 'stu-28'], topic: 'probability', reasoning: 'Meera (80%) can support Zara (75%) to push both towards mastery. Similar ability levels mean productive collaboration.', predictedBenefit: '+8% for both students' },
    { id: 'pt-7', students: ['stu-07', 'stu-35'], topic: 'trigonometry', reasoning: 'Rohan (91% trig) can help Omkar (47%). Rohan\'s kinesthetic style connects well with hands-on demonstrations.', predictedBenefit: '+14% comprehension for Omkar' },
    { id: 'pt-8', students: ['stu-16', 'stu-32'], topic: 'statistics', reasoning: 'Tanvi (80%) can guide Sneha (58%). Both are auditory learners who benefit from discussion-based learning.', predictedBenefit: '+10% comprehension for Sneha' },
  ],
  'skill-level': [
    { id: 'sl-1', students: ['stu-08', 'stu-10', 'stu-12', 'stu-24'], topic: 'quadratic-equations', reasoning: 'All four score 68-73% on quadratics. Targeted practice at this level pushes them to mastery without frustration.', predictedBenefit: 'Focused practice at comfortable challenge level' },
    { id: 'sl-2', students: ['stu-01', 'stu-02', 'stu-03', 'stu-06'], topic: 'calculus-intro', reasoning: 'Top performers (78-83% calculus) ready for advanced problem sets and proof-based challenges.', predictedBenefit: 'Accelerated mastery through peer challenge' },
    { id: 'sl-3', students: ['stu-29', 'stu-30', 'stu-31', 'stu-33'], topic: 'fractions', reasoning: 'All four need foundational support (35-40% fractions). Small group allows teacher to give focused attention.', predictedBenefit: 'Remedial instruction without stigma' },
    { id: 'sl-4', students: ['stu-13', 'stu-15', 'stu-25', 'stu-09'], topic: 'polynomials', reasoning: 'Mid-range scores (63-68% polynomials). Can work on factor theorem problems together at appropriate difficulty.', predictedBenefit: 'Collaborative problem solving at matching level' },
    { id: 'sl-5', students: ['stu-17', 'stu-19', 'stu-20', 'stu-26'], topic: 'trigonometry', reasoning: 'Solid foundation (68-70% trig). Ready for identity manipulation and application problems.', predictedBenefit: 'Bridging from understanding to fluency' },
  ],
  'mixed-ability': [
    { id: 'ma-1', students: ['stu-01', 'stu-09', 'stu-28', 'stu-29'], topic: 'algebra', reasoning: 'Balanced: 1 high (Aarav 92%), 2 mid (Kabir 68%, Zara 70%), 1 struggling (Rahul 45%). Diverse learning styles.', predictedBenefit: 'Natural peer support with multiple perspectives' },
    { id: 'ma-2', students: ['stu-02', 'stu-11', 'stu-24', 'stu-30'], topic: 'geometry', reasoning: 'Balanced: Ananya (91%), Arjun (65%), Anika (69%), Pooja (52%). Mixed visual/auditory styles encourage varied approaches.', predictedBenefit: 'Collaborative discovery through diverse viewpoints' },
    { id: 'ma-3', students: ['stu-04', 'stu-13', 'stu-16', 'stu-32'], topic: 'statistics', reasoning: 'Balanced: Saanvi (91%), Nikhil (75%), Tanvi (80%), Sneha (58%). Strong communicators who can lift the group.', predictedBenefit: 'High engagement through mixed ability discussion' },
    { id: 'ma-4', students: ['stu-06', 'stu-17', 'stu-18', 'stu-33'], topic: 'quadratic-equations', reasoning: 'Balanced: Ishita (89%), Karthik (76%), Lavanya (70%), Rajat (44%). Ishita can anchor while others contribute ideas.', predictedBenefit: 'Scaffolded problem solving with natural mentoring' },
    { id: 'ma-5', students: ['stu-07', 'stu-21', 'stu-22', 'stu-34'], topic: 'newtons-laws', reasoning: 'Balanced for Physics: Rohan (87%), Dev (72%), Rhea (73%), Kavya (50%). Mix of kinesthetic and auditory learners.', predictedBenefit: 'Hands-on experimentation with discussion' },
    { id: 'ma-6', students: ['stu-03', 'stu-08', 'stu-10', 'stu-12'], topic: 'probability', reasoning: 'Balanced: Vivaan (92%), Diya (78%), Meera (80%), Isha (81%). Close mid-range group with one leader.', predictedBenefit: 'Healthy competition and collaborative problem solving' },
  ],
}

export const lessonTemplates = [
  {
    id: 'template-01', topic: 'Quadratic Equations -- Graphical Approach', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Identify the shape of quadratic graphs (parabola)', 'Find roots graphically as x-intercepts', 'Connect graph intersections to equation solutions', 'Determine nature of roots from graph shape'],
    warmUp: { activity: 'Plot y = x^2 on graph paper. What shape do you see?', duration: 5 },
    mainContent: [
      { phase: 'Introduction', content: 'Show how y = ax^2 + bx + c creates a parabola. Demonstrate with 3 different equations on Desmos.', duration: 10 },
      { phase: 'Exploration', content: 'Students plot 3 different quadratics on graph paper, find x-intercepts, and record observations.', duration: 15 },
      { phase: 'Connection', content: 'Link x-intercepts to solutions of ax^2 + bx + c = 0. Introduce discriminant through the graph (no roots, one root, two roots).', duration: 10 },
    ],
    assessment: { method: 'Quick 3-question exit ticket: Given a graph, identify roots and write the equation.', duration: 5 },
    differentiation: {
      advanced: 'Challenge: What happens when the parabola does not cross the x-axis? Explore complex roots concept.',
      struggling: 'Provide pre-drawn graphs with labeled axes. Focus on reading roots from the graph only.',
    },
    dataInsight: 'Based on last assessment, 60% of 10-B struggled with factorization. This visual approach bypasses that barrier and builds intuition first.',
  },
  {
    id: 'template-02', topic: 'Trigonometric Ratios -- Height & Distance', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Apply trig ratios to real-world height problems', 'Use angle of elevation and depression correctly', 'Set up and solve right triangle word problems', 'Estimate heights of inaccessible objects'],
    warmUp: { activity: 'How would you measure the height of the school building without climbing it? Discuss in pairs.', duration: 5 },
    mainContent: [
      { phase: 'Outdoor Lab', content: 'Take students outside. Using clinometers (protractors + plumb line), measure angles to the top of the building from 3 distances.', duration: 20 },
      { phase: 'Calculation', content: 'Back in class, use tan(angle) = height/distance to calculate building height from each measurement. Compare results.', duration: 10 },
      { phase: 'Generalization', content: 'Formalize angle of elevation/depression. Solve 2 textbook problems using the same approach.', duration: 5 },
    ],
    assessment: { method: 'Each student draws a diagram and solves one height-distance problem independently.', duration: 5 },
    differentiation: {
      advanced: 'Challenge: Two observation points problem -- calculate height when both angles and the distance between observers is known.',
      struggling: 'Provide diagram templates with labeled sides. Focus on identifying which trig ratio to use.',
    },
    dataInsight: 'Class 10-B shows 60% comprehension in trigonometry. Hands-on outdoor activity typically boosts engagement by 40% for kinesthetic learners (35% of your class).',
  },
  {
    id: 'template-03', topic: 'Introduction to Limits', subject: 'Mathematics', grade: 11, duration: 45,
    objectives: ['Understand the intuition behind limits', 'Evaluate simple limits numerically and graphically', 'Identify when limits do not exist', 'Connect limits to the idea of approaching a value'],
    warmUp: { activity: 'Walk halfway to the wall. Then half of the remaining distance. Then half again. Will you ever reach the wall? (Zeno\'s paradox)', duration: 5 },
    mainContent: [
      { phase: 'Numerical Discovery', content: 'Calculate f(x) = (x^2 - 1)/(x - 1) for x = 0.9, 0.99, 0.999, 1.001, 1.01, 1.1. What does f(x) approach?', duration: 12 },
      { phase: 'Graphical Connection', content: 'Plot the function on Desmos. Zoom in near x=1. See the hole? The limit is what the function approaches, not what it equals.', duration: 13 },
      { phase: 'Formalization', content: 'Introduce limit notation. Practice 3 examples: polynomial limit, rational limit, limit that DNE (oscillating).', duration: 10 },
    ],
    assessment: { method: 'Evaluate 2 limits: one that exists and one that does not. Justify with a sentence.', duration: 5 },
    differentiation: {
      advanced: 'Explore epsilon-delta definition intuitively. How close must x be to 1 to make f(x) within 0.01 of 2?',
      struggling: 'Focus on the numerical table approach only. Use calculator to compute values and spot the pattern.',
    },
    dataInsight: '11-A has 58% comprehension on calculus intro. The numerical discovery approach has shown 25% better retention than direct algebraic definition.',
  },
  {
    id: 'template-04', topic: 'Free Body Diagrams -- Newton\'s Laws', subject: 'Physics', grade: 11, duration: 45,
    objectives: ['Draw accurate free body diagrams for objects in equilibrium and motion', 'Identify all forces acting on an object', 'Apply Newton\'s second law using FBDs', 'Resolve forces into components'],
    warmUp: { activity: 'Push a book on the desk. What forces act on it? List as many as you can.', duration: 5 },
    mainContent: [
      { phase: 'FBD Rules', content: 'Teach the 4-step FBD process: (1) Isolate object, (2) Identify all contact and non-contact forces, (3) Draw arrows from center, (4) Label with symbols.', duration: 10 },
      { phase: 'Practice Set', content: 'Students draw FBDs for 6 scenarios: book on table, hanging lamp, block on ramp, two blocks stacked, block pulled by string, Atwood machine.', duration: 20 },
      { phase: 'Problem Solving', content: 'Use FBDs to set up F=ma equations for 2 problems. Solve for acceleration and normal force.', duration: 5 },
    ],
    assessment: { method: 'Draw the FBD for a block on a ramp with friction. Write the equations of motion along and perpendicular to the ramp.', duration: 5 },
    differentiation: {
      advanced: 'Connected bodies problem: two blocks connected by a string over a pulley on a ramp.',
      struggling: 'Provide force identification checklist. Focus on flat surface and hanging scenarios only.',
    },
    dataInsight: '11-B shows 66% comprehension on Newton\'s laws. Most errors (73%) are in FBD construction, not in equation solving. This lesson targets the root cause.',
  },
  {
    id: 'template-05', topic: 'Coordinate Geometry -- Distance Formula Lab', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Apply distance formula to real-world scenarios', 'Visualize distance on coordinate plane', 'Connect formula to Pythagorean theorem', 'Calculate distances between points accurately'],
    warmUp: { activity: 'If you walk 3 blocks east and 4 blocks north, how far are you from where you started? Draw it out.', duration: 5 },
    mainContent: [
      { phase: 'Graph Paper Setup', content: 'Plot 5 pairs of points on graph paper. Estimate the distance by eye, then measure with a ruler.', duration: 10 },
      { phase: 'Formula Discovery', content: 'Form right triangles connecting the points. Use Pythagorean theorem to derive d = sqrt((x2-x1)^2 + (y2-y1)^2).', duration: 12 },
      { phase: 'Application', content: 'Calculate distances using the formula. Compare to ruler measurements. Solve 3 textbook problems.', duration: 13 },
    ],
    assessment: { method: 'Given 3 coordinate pairs, calculate distances showing all work. One pair should have negative coordinates.', duration: 5 },
    differentiation: {
      advanced: 'Extension: Find the locus of points equidistant from two given points (perpendicular bisector concept).',
      struggling: 'Provide pre-plotted points and right triangles already drawn. Focus on substituting into the formula correctly.',
    },
    dataInsight: 'Class 10-A shows 70% comprehension in coordinate geometry. Visual graphing approach helps 68% of students connect abstract formula to concrete measurement.',
  },
  {
    id: 'template-06', topic: 'Coordinate Geometry -- Midpoint Treasure Hunt', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Find midpoints using the midpoint formula', 'Understand midpoint as the average of coordinates', 'Apply to real navigation problems', 'Verify midpoint property geometrically'],
    warmUp: { activity: 'If two friends meet exactly halfway between their houses, how do you find that meeting point on a map?', duration: 5 },
    mainContent: [
      { phase: 'Treasure Hunt Activity', content: 'Students work in pairs. Each pair gets 4 coordinate pairs representing "treasure locations." Find and plot the midpoint between each pair.', duration: 15 },
      { phase: 'Pattern Discovery', content: 'Notice that midpoint x-coordinate = (x1+x2)/2, y-coordinate = (y1+y2)/2. Derive the formula together.', duration: 10 },
      { phase: 'Verification', content: 'Measure distances from each endpoint to midpoint with ruler. Should be equal! Solve 2 textbook problems.', duration: 10 },
    ],
    assessment: { method: 'Find the midpoint of the line segment joining (7, -2) and (-3, 8). Verify by calculating distances.', duration: 5 },
    differentiation: {
      advanced: 'Section formula challenge: Find the point that divides a line segment in ratio 2:3.',
      struggling: 'Use only positive integer coordinates. Provide midpoint formula card for reference.',
    },
    dataInsight: 'Game-based activities increase engagement by 35% in 10-B. Midpoint is often confused with distance — this activity builds separate mental models.',
  },
  {
    id: 'template-07', topic: 'Circles -- Compass Construction Workshop', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Construct circles with compass and straightedge', 'Understand radius, diameter, and chord geometrically', 'Identify tangent as perpendicular to radius', 'Draw accurate geometric constructions'],
    warmUp: { activity: 'Challenge: Can you draw a perfect circle freehand? Now try with a string and pencil. What makes it perfect?', duration: 5 },
    mainContent: [
      { phase: 'Compass Basics', content: 'Demonstrate compass technique. Students practice drawing circles of radius 3cm, 5cm, 7cm. Label center, radius, diameter.', duration: 10 },
      { phase: 'Construction Challenges', content: '(1) Draw a chord and find its perpendicular bisector. (2) Construct a tangent at a point on the circle. (3) Draw two intersecting circles.', duration: 18 },
      { phase: 'Geometric Properties', content: 'Discuss observations: perpendicular from center bisects chord, tangent ⊥ radius, etc. Connect to theorems.', duration: 7 },
    ],
    assessment: { method: 'Construct a circle with radius 4cm, draw a chord, and construct the perpendicular from the center to the chord.', duration: 5 },
    differentiation: {
      advanced: 'Inscribe a hexagon in a circle using only compass and straightedge.',
      struggling: 'Pre-drawn center points provided. Focus on accurate compass usage and one construction type.',
    },
    dataInsight: 'Kinesthetic learners (35% of 10-A) retain 40% more when using physical tools vs. digital diagrams. Circles construction builds spatial reasoning.',
  },
  {
    id: 'template-08', topic: 'Circles -- Real-World Circular Measurements', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Measure circumference and diameter of circular objects', 'Discover pi experimentally', 'Apply circle formulas to real objects', 'Estimate vs calculate circular measurements'],
    warmUp: { activity: 'Estimate: How many times would you need to wrap a string around a circular plate to equal stretching the string straight across?', duration: 5 },
    mainContent: [
      { phase: 'Measurement Lab', content: 'Groups measure 5 circular objects (plate, can, ball, etc). Record diameter (with ruler) and circumference (with string).', duration: 15 },
      { phase: 'Ratio Discovery', content: 'Calculate C/d for each object. Notice all values are close to 3.14! Introduce pi as this universal ratio.', duration: 10 },
      { phase: 'Formula Application', content: 'Use C = 2πr and A = πr^2 to solve problems. Calculate area of the circular objects measured earlier.', duration: 10 },
    ],
    assessment: { method: 'Given a circular table with diameter 1.5m, find circumference and area. Show formula substitution.', duration: 5 },
    differentiation: {
      advanced: 'Calculate the area of a circular ring (annulus) given inner radius 5cm and outer radius 8cm.',
      struggling: 'Provide formula cards with labeled variables. Use only whole number radii.',
    },
    dataInsight: '10-B students who discover pi experimentally show 28% better recall than those given the formula directly. Real objects make abstract concepts concrete.',
  },
  {
    id: 'template-09', topic: 'Surface Area & Volume -- 3D Model Building', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Build 3D models from nets', 'Calculate surface area by adding face areas', 'Understand relationship between nets and 3D shapes', 'Visualize 3D geometry'],
    warmUp: { activity: 'Unfold a small cardboard box. What shapes do you see? Can you fold it back?', duration: 5 },
    mainContent: [
      { phase: 'Net Construction', content: 'Students create nets for cube, cuboid, and cylinder using paper and tape. Cut out and fold to form 3D shapes.', duration: 18 },
      { phase: 'Surface Area', content: 'Calculate surface area by finding area of each face in the net and adding them. Verify formulas: SA(cube) = 6a^2, SA(cuboid) = 2(lb+bh+hl).', duration: 12 },
      { phase: 'Real-World Connection', content: 'How much wrapping paper needed to cover a gift box? Apply surface area formula.', duration: 5 },
    ],
    assessment: { method: 'Draw the net for a cuboid with dimensions 4cm × 3cm × 2cm. Calculate total surface area.', duration: 5 },
    differentiation: {
      advanced: 'Design the most efficient net for a cylinder (minimum paper waste). Calculate surface area including circular ends.',
      struggling: 'Pre-cut nets provided for folding. Focus on identifying faces and simple rectangular prism surface area.',
    },
    dataInsight: 'Visual/kinesthetic learners (65% of 10-A) struggle with 2D→3D visualization. Building physical models improves spatial understanding by 45%.',
  },
  {
    id: 'template-10', topic: 'Surface Area & Volume -- Water Displacement Lab', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Measure volume using water displacement', 'Verify volume formulas experimentally', 'Understand volume as space occupied', 'Apply Archimedes principle'],
    warmUp: { activity: 'When you step into a bathtub, why does the water level rise? How could you measure your volume?', duration: 5 },
    mainContent: [
      { phase: 'Lab Setup', content: 'Groups use graduated cylinders, water, and small objects (stones, toy blocks, etc). Measure initial water level.', duration: 8 },
      { phase: 'Displacement Experiment', content: 'Submerge object, record new water level. Volume = (final - initial) water level. Repeat for 4 objects.', duration: 15 },
      { phase: 'Formula Verification', content: 'For regular objects (cuboid, cylinder), measure dimensions and calculate volume using formulas. Compare to displacement volume.', duration: 12 },
    ],
    assessment: { method: 'A stone displaces 45ml of water. What is its volume in cm^3? If a cylinder has r=3cm, h=5cm, calculate volume and predict displacement.', duration: 5 },
    differentiation: {
      advanced: 'Calculate volume of irregular objects (e.g., figurines) that cannot be measured directly. Explore density = mass/volume.',
      struggling: 'Use only simple cuboids. Focus on reading graduated cylinder correctly and understanding displacement concept.',
    },
    dataInsight: 'Hands-on lab work increases retention by 40% for abstract concepts like volume. 10-B shows 58% comprehension — experiential learning targets this gap.',
  },
  {
    id: 'template-11', topic: 'Arithmetic Progressions -- Staircase Patterns', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Identify arithmetic progressions in patterns', 'Derive nth term formula from visual patterns', 'Find common difference from diagrams', 'Connect algebra to geometric sequences'],
    warmUp: { activity: 'A staircase has 1 block in step 1, 3 blocks in step 2, 5 blocks in step 3. How many blocks in step 10? Can you find a pattern?', duration: 5 },
    mainContent: [
      { phase: 'Pattern Building', content: 'Using tiles/blocks, build staircase patterns: 2, 5, 8, 11,... and 1, 4, 7, 10,... Identify first term (a) and common difference (d).', duration: 12 },
      { phase: 'Formula Discovery', content: 'Extend patterns to 10th term by adding blocks. Notice pattern: a_n = a + (n-1)d. Derive formula as a class.', duration: 13 },
      { phase: 'Application', content: 'Solve textbook problems: find 20th term, which term equals 100, etc. Use formula instead of counting.', duration: 10 },
    ],
    assessment: { method: 'Given AP: 7, 12, 17, 22,... find (a) 15th term (b) which term is 127?', duration: 5 },
    differentiation: {
      advanced: 'Derive the sum formula S_n = n/2[2a + (n-1)d] by pairing terms from both ends of the sequence.',
      struggling: 'Use only AP with small common differences (2, 3, 5). Provide formula card with variables labeled.',
    },
    dataInsight: '10-A shows 74% comprehension. Visual pattern recognition before formula introduction improves understanding by 30% vs. formula-first approach.',
  },
  {
    id: 'template-12', topic: 'Arithmetic Progressions -- Seating Arrangement Problems', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Apply AP to real-world seating problems', 'Use sum formula for total seats', 'Solve word problems involving AP', 'Connect AP to linear growth situations'],
    warmUp: { activity: 'An auditorium has 20 seats in row 1, 23 in row 2, 26 in row 3. If there are 30 rows, how many total seats?', duration: 5 },
    mainContent: [
      { phase: 'Problem Breakdown', content: 'Identify: first row = a = 20, common difference = d = 3, number of rows = n = 30. Which formula to use?', duration: 8 },
      { phase: 'Sum Formula', content: 'Introduce S_n = n/2 [2a + (n-1)d]. Substitute values and calculate total seats. Verify by finding last row first (a_30 = 107).', duration: 15 },
      { phase: 'Practice Problems', content: 'Solve 3 variations: (1) Find total seats with different a, d, n. (2) Given total and rows, find common difference. (3) Reverse problem.', duration: 12 },
    ],
    assessment: { method: 'A stadium has 15 seats in the first row, each row has 4 more seats than the previous row. If there are 25 rows, find total capacity.', duration: 5 },
    differentiation: {
      advanced: 'Optimization problem: Stadium must have exactly 1500 seats. If first row has 10 seats and d=3, how many rows needed?',
      struggling: 'Provide worked examples with clear steps. Use only whole number answers. Give formula sheet.',
    },
    dataInsight: 'Word problems with context (vs. abstract sequences) improve engagement by 32%. 10-B benefits from visual diagrams of seating arrangements.',
  },
  {
    id: 'template-13', topic: 'Sets -- Venn Diagram Sorting Activity', subject: 'Mathematics', grade: 11, duration: 45,
    objectives: ['Classify objects into sets using Venn diagrams', 'Understand union, intersection, and complement visually', 'Count elements in combined sets', 'Apply set operations to real scenarios'],
    warmUp: { activity: 'Sort your classmates: who plays sports? Who plays instruments? Who does both? Draw circles to show this.', duration: 5 },
    mainContent: [
      { phase: 'Physical Sorting', content: 'Using cards with numbers, sort into sets: A = multiples of 2, B = multiples of 3. Create Venn diagram with hula hoops or chalk circles.', duration: 12 },
      { phase: 'Set Operations', content: 'Identify A ∪ B (all multiples of 2 or 3), A ∩ B (multiples of 6), A\' (not multiples of 2). Count elements in each region.', duration: 13 },
      { phase: 'Formula Application', content: 'Introduce n(A ∪ B) = n(A) + n(B) - n(A ∩ B). Verify with sorted cards. Solve 2 abstract problems.', duration: 10 },
    ],
    assessment: { method: 'In a class of 40: 25 like math, 18 like science, 10 like both. Draw Venn diagram and find how many like neither.', duration: 5 },
    differentiation: {
      advanced: 'Three-set Venn diagrams with sports, music, and art. Find all 8 regions and apply inclusion-exclusion principle.',
      struggling: 'Use only two-set problems with small numbers. Pre-drawn Venn diagrams provided for labeling.',
    },
    dataInsight: '11-A shows 80% comprehension. Physical manipulatives (cards, hoops) make abstract set theory concrete, especially for kinesthetic learners (30%).',
  },
  {
    id: 'template-14', topic: 'Sets -- Set Builder Notation Practice', subject: 'Mathematics', grade: 11, duration: 45,
    objectives: ['Write sets in set builder notation', 'Translate between roster and builder forms', 'Use properties to define sets', 'Understand mathematical notation conventions'],
    warmUp: { activity: 'How would you describe "all even numbers" without listing them all? Invent your own shorthand notation.', duration: 5 },
    mainContent: [
      { phase: 'Notation Introduction', content: 'Show {x | x is even} vs {2, 4, 6, 8,...}. Explain: x is variable, | means "such that", right side is property.', duration: 10 },
      { phase: 'Translation Practice', content: 'Convert 6 sets from roster to builder form and vice versa. E.g., {2, 4, 6, 8} → {x | x is even and x ≤ 8}.', duration: 15 },
      { phase: 'Complex Sets', content: 'Sets with conditions: {x | x^2 < 25, x ∈ Z}, {x | x is prime and x < 20}. Build comfort with algebraic conditions.', duration: 10 },
    ],
    assessment: { method: 'Write in set builder notation: (a) {5, 10, 15, 20, 25} (b) All multiples of 7 less than 50. List elements of {x | -3 < x ≤ 2, x ∈ Z}.', duration: 5 },
    differentiation: {
      advanced: 'Sets defined by equations: {(x,y) | x^2 + y^2 = 25} (circle). Describe geometric shapes algebraically.',
      struggling: 'Focus on number sets only (no variables). Provide sentence frames: "x such that x is ___".',
    },
    dataInsight: 'Set builder notation is abstract. Breaking it into components (variable, condition, universe) improves fluency by 35% vs. memorization alone.',
  },
  {
    id: 'template-15', topic: 'Real Numbers -- Factor Tree Competition', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Find prime factorization using factor trees', 'Identify prime vs composite numbers', 'Write numbers as products of primes', 'Apply to HCF/LCM calculation'],
    warmUp: { activity: 'Race: Who can break down 24 into smallest possible numbers (all primes)? Multiple paths allowed!', duration: 5 },
    mainContent: [
      { phase: 'Factor Tree Method', content: 'Demonstrate 60 = 2 × 30 = 2 × 2 × 15 = 2 × 2 × 3 × 5. Students create trees for 36, 48, 72, 100. Compare different tree paths.', duration: 15 },
      { phase: 'Prime Factorization', content: 'Write in exponential form: 60 = 2^2 × 3 × 5. Practice with 5 more numbers. Notice: all paths lead to same prime factorization (unique!).', duration: 10 },
      { phase: 'HCF Application', content: 'Find HCF(48, 60) using prime factorization. Take minimum power of common primes: 2^2 × 3 = 12.', duration: 10 },
    ],
    assessment: { method: 'Draw factor tree for 90. Write prime factorization. Use it to find HCF(90, 72).', duration: 5 },
    differentiation: {
      advanced: 'LCM application: Two bells ring every 18 and 24 seconds. When do they ring together? (LCM problem)',
      struggling: 'Provide lists of prime numbers. Use only 2-digit composite numbers. Color-code factor tree branches.',
    },
    dataInsight: '10-B shows 72% comprehension. Gamified competition format increases engagement by 40% and makes factorization feel like puzzle-solving.',
  },
  {
    id: 'template-16', topic: 'Real Numbers -- HCF/LCM with Physical Objects', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Understand HCF as largest common divisor', 'Visualize LCM as smallest common multiple', 'Apply to real-world sharing/tiling problems', 'Connect HCF/LCM to prime factorization'],
    warmUp: { activity: 'You have 12 apples and 18 oranges. What\'s the largest number of identical fruit baskets you can make without leftovers?', duration: 5 },
    mainContent: [
      { phase: 'HCF with Objects', content: 'Use tiles/blocks: arrange 12 and 18 into equal groups. Possible groupings: 1, 2, 3, 6. HCF = 6 (largest). Connect to division.', duration: 12 },
      { phase: 'LCM Discovery', content: 'Two runners: one completes lap in 4 min, other in 6 min. When do they meet at start again? List multiples: 4,8,12,16... and 6,12,18... LCM=12.', duration: 13 },
      { phase: 'Prime Factorization Method', content: 'Calculate HCF and LCM using prime factors. HCF = min powers, LCM = max powers. Verify: HCF×LCM = product of numbers.', duration: 10 },
    ],
    assessment: { method: 'Find HCF and LCM of 24 and 36 using prime factorization. Verify that 24 × 36 = HCF × LCM.', duration: 5 },
    differentiation: {
      advanced: 'Three-number HCF/LCM: Find HCF(12, 18, 24) and LCM(12, 18, 24). Solve: Two lights blink every 8s, 12s, 18s — when do all three blink together?',
      struggling: 'Use only pairs with HCF of 2, 3, or 5. Provide factor lists. Focus on listing method before prime factorization.',
    },
    dataInsight: '10-A shows 76% comprehension. Concrete objects make abstract greatest/least concepts tangible, especially for visual learners (40%).',
  },
  {
    id: 'template-17', topic: 'Polynomials -- Polynomial Puzzles', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Identify degree, coefficients, and terms', 'Add and subtract polynomials', 'Multiply polynomials using distributive property', 'Apply remainder theorem'],
    warmUp: { activity: 'Polynomial mystery: I\'m thinking of p(x) where p(1)=0 and p(2)=0. What could the polynomial be?', duration: 5 },
    mainContent: [
      { phase: 'Polynomial Anatomy', content: 'Dissect 3x^3 - 2x^2 + 5x - 7: degree=3, leading coefficient=3, constant=-7, 4 terms. Practice identifying for 5 polynomials.', duration: 10 },
      { phase: 'Operations Practice', content: 'Add/subtract: align like terms vertically. Multiply: use distributive property (x+2)(x+3) = x^2 + 5x + 6. Complete 6 problems.', duration: 15 },
      { phase: 'Remainder Theorem', content: 'When p(x) = x^2 - 5x + 6 is divided by (x-2), remainder = p(2) = 0. Verify by long division. Apply theorem to 3 examples.', duration: 10 },
    ],
    assessment: { method: 'Given p(x) = 2x^3 - 3x + 1, find: (a) degree (b) p(2) (c) remainder when divided by (x-2) without dividing.', duration: 5 },
    differentiation: {
      advanced: 'Factor theorem: If p(a) = 0, then (x-a) is a factor. Use to factor x^3 - 6x^2 + 11x - 6 given that p(1) = 0.',
      struggling: 'Use only quadratics. Provide operation templates with blanks. Focus on addition/subtraction before multiplication.',
    },
    dataInsight: '10-B shows 65% comprehension. Puzzle framing makes abstract polynomial operations feel purposeful. Remainder theorem confuses 55% — hands-on verification helps.',
  },
  {
    id: 'template-18', topic: 'Linear Equations -- Graphing to Build Intuition', subject: 'Mathematics', grade: 10, duration: 45,
    objectives: ['Plot linear equations on coordinate plane', 'Identify slope and y-intercept from graphs', 'Understand y=mx+c visually', 'Solve systems graphically'],
    warmUp: { activity: 'Plot points: (0,2), (1,4), (2,6), (3,8). Do they form a pattern? Can you continue it?', duration: 5 },
    mainContent: [
      { phase: 'Pattern to Equation', content: 'Notice: y increases by 2 when x increases by 1. Slope = 2. Line passes through (0,2). Equation: y = 2x + 2. Derive from graph.', duration: 12 },
      { phase: 'Graphing Practice', content: 'Graph 4 equations by plotting 3 points each: y=x+1, y=2x-3, y=-x+4, y=3. Identify slope (steepness) and y-intercept (crossing y-axis).', duration: 13 },
      { phase: 'Systems of Equations', content: 'Graph y=2x+1 and y=-x+4 on same axes. Intersection point (1,3) is the solution. Verify algebraically. Solve 2 more systems.', duration: 10 },
    ],
    assessment: { method: 'Graph y = -2x + 5. Find: (a) slope (b) y-intercept (c) x-intercept. Solve graphically: y=x+2 and y=-x+6.', duration: 5 },
    differentiation: {
      advanced: 'Parallel lines: graph y=2x+1 and y=2x-3. Why no intersection? Perpendicular lines: graph y=2x and y=-(1/2)x. Explore slope relationship.',
      struggling: 'Pre-drawn axes with gridlines. Use only positive slopes and intercepts. Provide point tables for plotting.',
    },
    dataInsight: '10-A shows 78% comprehension. Graphing before algebraic manipulation builds geometric intuition that improves equation-solving by 25%.',
  },
]

export const recentActivity = [
  { id: 'act-01', type: 'class', text: 'Taught Quadratic Equations to Class 10-A', time: '2 hours ago', classId: '10-A' },
  { id: 'act-02', type: 'insight', text: 'AI detected reteaching need for fractions in 10-B', time: '3 hours ago', classId: '10-B' },
  { id: 'act-03', type: 'assessment', text: 'Graded weekly test for 11-A (avg: 74%)', time: '5 hours ago', classId: '11-A' },
  { id: 'act-04', type: 'group', text: 'Created peer tutoring pairs for algebra', time: 'Yesterday', classId: '10-A' },
  { id: 'act-05', type: 'lesson', text: 'Planned lesson: Coordinate Geometry introduction', time: 'Yesterday', classId: '10-A' },
  { id: 'act-06', type: 'class', text: "Taught Newton's Laws to Class 11-B", time: '2 days ago', classId: '11-B' },
  { id: 'act-07', type: 'insight', text: '3 students flagged for declining participation', time: '2 days ago', classId: '10-A' },
]

export const aiSuggestions = {
  '10-A': [
    { id: 'sug-1', urgency: 'high', text: 'Rahul hasn\'t participated in 45 minutes and appears frustrated. Consider a quiet one-on-one check-in.', studentId: 'stu-29' },
    { id: 'sug-2', urgency: 'medium', text: 'Slow down on quadratic factorization — 40% of the class is still processing the last example.', studentId: null },
    { id: 'sug-3', urgency: 'medium', text: 'Call on Arjun — he hasn\'t spoken in 30 minutes but his written work shows understanding.', studentId: 'stu-11' },
    { id: 'sug-4', urgency: 'low', text: 'Great energy! 72% of the class is engaged. Consider a quick pair-share to maintain momentum.', studentId: null },
  ],
  '10-B': [
    { id: 'sug-5', urgency: 'high', text: 'Manish is completely disengaged. This is the third consecutive class. Consider parent communication.', studentId: 'stu-31' },
    { id: 'sug-6', urgency: 'high', text: 'Priya looks confused — her last 3 written answers were incorrect. She may need the concept re-explained.', studentId: 'stu-14' },
    { id: 'sug-7', urgency: 'medium', text: 'Try a different approach for trigonometric ratios. Only 60% comprehension with current method.', studentId: null },
    { id: 'sug-8', urgency: 'low', text: 'Saanvi and Tanvi are ready for advanced problems. Consider giving them the extension worksheet.', studentId: null },
  ],
  '11-A': [
    { id: 'sug-9', urgency: 'high', text: 'Rajat is struggling with limit concepts. His written work shows fundamental algebra gaps.', studentId: 'stu-33' },
    { id: 'sug-10', urgency: 'medium', text: 'The numerical table approach is working well. 70% of students found the pattern. Reinforce before moving to formal notation.', studentId: null },
    { id: 'sug-11', urgency: 'low', text: 'Ishita has finished all problems. Give her the epsilon-delta exploration sheet.', studentId: 'stu-06' },
  ],
  '11-B': [
    { id: 'sug-12', urgency: 'high', text: 'Omkar cannot draw FBDs correctly. He\'s confusing action-reaction pairs with balanced forces.', studentId: 'stu-35' },
    { id: 'sug-13', urgency: 'medium', text: 'Kavya needs the force checklist. She consistently forgets normal force.', studentId: 'stu-34' },
    { id: 'sug-14', urgency: 'low', text: 'Rohan has mastered FBDs — pair him with Omkar for peer support.', studentId: null },
  ],
}
