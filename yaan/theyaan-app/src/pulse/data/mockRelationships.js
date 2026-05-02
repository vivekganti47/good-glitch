// Social connections and relationship data for students
// Maps student IDs to their social network

export const socialConnections = {
  'stu-01': { // Aarav Sharma
    strongBonds: ['stu-02', 'stu-03', 'stu-09'], // Ananya, Vivaan, Kabir
    weakConnections: ['stu-08', 'stu-10', 'stu-12'],
    conflicts: [],
    isolationRisk: 0.1, // Very low - popular student
    collaborationScore: 92,
    leadershipStyle: 'leader'
  },
  'stu-02': { // Ananya Iyer
    strongBonds: ['stu-01', 'stu-04', 'stu-06'], // Aarav, Saanvi, Ishita
    weakConnections: ['stu-14', 'stu-16', 'stu-24'],
    conflicts: [],
    isolationRisk: 0.15,
    collaborationScore: 88,
    leadershipStyle: 'collaborative'
  },
  'stu-03': { // Vivaan Patel
    strongBonds: ['stu-01', 'stu-07', 'stu-08'], // Aarav, Rohan, Diya
    weakConnections: ['stu-10', 'stu-12', 'stu-22'],
    conflicts: [],
    isolationRisk: 0.12,
    collaborationScore: 85,
    leadershipStyle: 'collaborative'
  },
  'stu-04': { // Saanvi Reddy
    strongBonds: ['stu-02', 'stu-06', 'stu-16'], // Ananya, Ishita, Tanvi
    weakConnections: ['stu-13', 'stu-15', 'stu-25'],
    conflicts: [],
    isolationRisk: 0.08,
    collaborationScore: 90,
    leadershipStyle: 'leader'
  },
  'stu-05': { // Aditya Nair
    strongBonds: ['stu-07', 'stu-21', 'stu-23'], // Rohan, Dev, Aadhya
    weakConnections: ['stu-03', 'stu-09', 'stu-17'],
    conflicts: [],
    isolationRisk: 0.25,
    collaborationScore: 78,
    leadershipStyle: 'collaborative'
  },
  'stu-06': { // Ishita Gupta
    strongBonds: ['stu-02', 'stu-04', 'stu-17'], // Ananya, Saanvi, Karthik
    weakConnections: ['stu-18', 'stu-33'],
    conflicts: [],
    isolationRisk: 0.05, // Very low
    collaborationScore: 94,
    leadershipStyle: 'leader'
  },
  'stu-07': { // Rohan Deshmukh
    strongBonds: ['stu-03', 'stu-05', 'stu-21'], // Vivaan, Aditya, Dev
    weakConnections: ['stu-22', 'stu-34', 'stu-35'],
    conflicts: [],
    isolationRisk: 0.18,
    collaborationScore: 82,
    leadershipStyle: 'independent'
  },
  'stu-08': { // Diya Kapoor
    strongBonds: ['stu-03', 'stu-10', 'stu-12'], // Vivaan, Meera, Isha
    weakConnections: ['stu-01', 'stu-09', 'stu-24'],
    conflicts: [],
    isolationRisk: 0.22,
    collaborationScore: 80,
    leadershipStyle: 'follower'
  },
  'stu-09': { // Kabir Singh
    strongBonds: ['stu-01', 'stu-13', 'stu-15'], // Aarav, Nikhil, Neha
    weakConnections: ['stu-03', 'stu-05', 'stu-08'],
    conflicts: [],
    isolationRisk: 0.28,
    collaborationScore: 75,
    leadershipStyle: 'follower'
  },
  'stu-10': { // Meera Joshi
    strongBonds: ['stu-08', 'stu-12', 'stu-16'], // Diya, Isha, Tanvi
    weakConnections: ['stu-01', 'stu-03', 'stu-24'],
    conflicts: [],
    isolationRisk: 0.20,
    collaborationScore: 83,
    leadershipStyle: 'collaborative'
  },
  'stu-11': { // Arjun Desai
    strongBonds: ['stu-13', 'stu-24'], // Nikhil, Anika
    weakConnections: ['stu-11', 'stu-28'],
    conflicts: [],
    isolationRisk: 0.45, // Moderate risk - fewer connections
    collaborationScore: 68,
    leadershipStyle: 'independent'
  },
  'stu-12': { // Isha Menon
    strongBonds: ['stu-08', 'stu-10', 'stu-26'], // Diya, Meera, Riya
    weakConnections: ['stu-03', 'stu-20', 'stu-27'],
    conflicts: [],
    isolationRisk: 0.16,
    collaborationScore: 84,
    leadershipStyle: 'collaborative'
  },
  'stu-13': { // Nikhil Rao
    strongBonds: ['stu-09', 'stu-11', 'stu-15'], // Kabir, Arjun, Neha
    weakConnections: ['stu-04', 'stu-25'],
    conflicts: [],
    isolationRisk: 0.32,
    collaborationScore: 72,
    leadershipStyle: 'follower'
  },
  'stu-14': { // Priya Kumar
    strongBonds: ['stu-19', 'stu-28'], // Simran, Zara
    weakConnections: ['stu-02', 'stu-16', 'stu-30'],
    conflicts: [],
    isolationRisk: 0.38,
    collaborationScore: 70,
    leadershipStyle: 'follower'
  },
  'stu-15': { // Neha Bhatt
    strongBonds: ['stu-09', 'stu-13', 'stu-25'], // Kabir, Nikhil, Ansh
    weakConnections: ['stu-04', 'stu-17'],
    conflicts: [],
    isolationRisk: 0.30,
    collaborationScore: 76,
    leadershipStyle: 'collaborative'
  },
  'stu-16': { // Tanvi Chopra
    strongBonds: ['stu-04', 'stu-10', 'stu-32'], // Saanvi, Meera, Sneha
    weakConnections: ['stu-02', 'stu-14', 'stu-18'],
    conflicts: [],
    isolationRisk: 0.19,
    collaborationScore: 82,
    leadershipStyle: 'collaborative'
  },
  'stu-17': { // Karthik Srinivasan
    strongBonds: ['stu-06', 'stu-18', 'stu-20'], // Ishita, Lavanya, Aryan
    weakConnections: ['stu-05', 'stu-15', 'stu-22'],
    conflicts: [],
    isolationRisk: 0.24,
    collaborationScore: 78,
    leadershipStyle: 'independent'
  },
  'stu-18': { // Lavanya Pillai
    strongBonds: ['stu-17', 'stu-20', 'stu-27'], // Karthik, Aryan, Sanya
    weakConnections: ['stu-06', 'stu-16', 'stu-33'],
    conflicts: [],
    isolationRisk: 0.26,
    collaborationScore: 74,
    leadershipStyle: 'follower'
  },
  'stu-19': { // Simran Gill
    strongBonds: ['stu-14', 'stu-26', 'stu-28'], // Priya, Riya, Zara
    weakConnections: ['stu-20', 'stu-30'],
    conflicts: [],
    isolationRisk: 0.35,
    collaborationScore: 71,
    leadershipStyle: 'follower'
  },
  'stu-20': { // Aryan Mehta
    strongBonds: ['stu-17', 'stu-18', 'stu-22'], // Karthik, Lavanya, Rhea
    weakConnections: ['stu-12', 'stu-19', 'stu-27'],
    conflicts: [],
    isolationRisk: 0.28,
    collaborationScore: 76,
    leadershipStyle: 'collaborative'
  },
  'stu-21': { // Dev Malhotra
    strongBonds: ['stu-05', 'stu-07', 'stu-22'], // Aditya, Rohan, Rhea
    weakConnections: ['stu-23', 'stu-34', 'stu-35'],
    conflicts: [],
    isolationRisk: 0.22,
    collaborationScore: 79,
    leadershipStyle: 'collaborative'
  },
  'stu-22': { // Rhea Saxena
    strongBonds: ['stu-20', 'stu-21', 'stu-23'], // Aryan, Dev, Aadhya
    weakConnections: ['stu-03', 'stu-07', 'stu-17'],
    conflicts: [],
    isolationRisk: 0.20,
    collaborationScore: 80,
    leadershipStyle: 'collaborative'
  },
  'stu-23': { // Aadhya Verma
    strongBonds: ['stu-05', 'stu-22', 'stu-27'], // Aditya, Rhea, Sanya
    weakConnections: ['stu-21', 'stu-26'],
    conflicts: [],
    isolationRisk: 0.29,
    collaborationScore: 73,
    leadershipStyle: 'follower'
  },
  'stu-24': { // Anika Bose
    strongBonds: ['stu-11', 'stu-26', 'stu-28'], // Arjun, Riya, Zara
    weakConnections: ['stu-01', 'stu-02', 'stu-08'],
    conflicts: [],
    isolationRisk: 0.33,
    collaborationScore: 74,
    leadershipStyle: 'follower'
  },
  'stu-25': { // Ansh Trivedi
    strongBonds: ['stu-15', 'stu-27'], // Neha, Sanya
    weakConnections: ['stu-04', 'stu-09', 'stu-13'],
    conflicts: [],
    isolationRisk: 0.42, // Moderate-high risk
    collaborationScore: 67,
    leadershipStyle: 'independent'
  },
  'stu-26': { // Riya Shah
    strongBonds: ['stu-12', 'stu-19', 'stu-24'], // Isha, Simran, Anika
    weakConnections: ['stu-23', 'stu-28', 'stu-32'],
    conflicts: [],
    isolationRisk: 0.27,
    collaborationScore: 77,
    leadershipStyle: 'collaborative'
  },
  'stu-27': { // Sanya Dubey
    strongBonds: ['stu-18', 'stu-23', 'stu-25'], // Lavanya, Aadhya, Ansh
    weakConnections: ['stu-12', 'stu-20'],
    conflicts: [],
    isolationRisk: 0.31,
    collaborationScore: 72,
    leadershipStyle: 'collaborative'
  },
  'stu-28': { // Zara Ali
    strongBonds: ['stu-14', 'stu-19', 'stu-24'], // Priya, Simran, Anika
    weakConnections: ['stu-11', 'stu-26', 'stu-30'],
    conflicts: [],
    isolationRisk: 0.25,
    collaborationScore: 78,
    leadershipStyle: 'follower'
  },
  'stu-29': { // Rahul Khanna (struggling student)
    strongBonds: ['stu-31'], // Manish
    weakConnections: ['stu-01', 'stu-30'],
    conflicts: [],
    isolationRisk: 0.65, // High risk - very few connections
    collaborationScore: 48,
    leadershipStyle: 'independent'
  },
  'stu-30': { // Pooja Agarwal
    strongBonds: ['stu-14', 'stu-32'], // Priya, Sneha
    weakConnections: ['stu-02', 'stu-19', 'stu-28', 'stu-29'],
    conflicts: [],
    isolationRisk: 0.40,
    collaborationScore: 65,
    leadershipStyle: 'follower'
  },
  'stu-31': { // Manish Tiwari (struggling student)
    strongBonds: ['stu-29'], // Rahul
    weakConnections: [],
    conflicts: [],
    isolationRisk: 0.75, // Very high risk - isolated
    collaborationScore: 42,
    leadershipStyle: 'independent'
  },
  'stu-32': { // Sneha Pandey
    strongBonds: ['stu-16', 'stu-30'], // Tanvi, Pooja
    weakConnections: ['stu-26', 'stu-28'],
    conflicts: [],
    isolationRisk: 0.44,
    collaborationScore: 64,
    leadershipStyle: 'follower'
  },
  'stu-33': { // Rajat Bansal (struggling in 11-A)
    strongBonds: ['stu-06'], // Ishita (peer tutor)
    weakConnections: ['stu-18'],
    conflicts: [],
    isolationRisk: 0.58, // High risk
    collaborationScore: 52,
    leadershipStyle: 'independent'
  },
  'stu-34': { // Kavya Menon (11-B Physics)
    strongBonds: ['stu-07', 'stu-21', 'stu-35'], // Rohan, Dev, Omkar
    weakConnections: [],
    conflicts: [],
    isolationRisk: 0.36,
    collaborationScore: 68,
    leadershipStyle: 'collaborative'
  },
  'stu-35': { // Omkar Kulkarni (11-B Physics)
    strongBonds: ['stu-07', 'stu-34'], // Rohan, Kavya
    weakConnections: ['stu-21'],
    conflicts: [],
    isolationRisk: 0.48, // Moderate-high risk
    collaborationScore: 58,
    leadershipStyle: 'independent'
  },
}

// Helper to get students at isolation risk
export function getIsolatedStudents(threshold = 0.5) {
  const isolated = []
  Object.entries(socialConnections).forEach(([studentId, data]) => {
    if (data.isolationRisk >= threshold) {
      isolated.push({ studentId, ...data })
    }
  })
  return isolated.sort((a, b) => b.isolationRisk - a.isolationRisk)
}

// Helper to find optimal pairs based on social compatibility
export function findCompatiblePairs(studentIds) {
  const pairs = []
  for (let i = 0; i < studentIds.length; i++) {
    for (let j = i + 1; j < studentIds.length; j++) {
      const s1 = studentIds[i]
      const s2 = studentIds[j]
      const s1Data = socialConnections[s1]
      const s2Data = socialConnections[s2]

      if (!s1Data || !s2Data) continue

      let compatibilityScore = 0

      // Check if they have strong bonds
      if (s1Data.strongBonds.includes(s2)) compatibilityScore += 3
      if (s1Data.weakConnections.includes(s2)) compatibilityScore += 1

      // Check for conflicts
      if (s1Data.conflicts.includes(s2)) compatibilityScore = -10

      // Complementary leadership styles
      if ((s1Data.leadershipStyle === 'leader' && s2Data.leadershipStyle === 'follower') ||
          (s1Data.leadershipStyle === 'follower' && s2Data.leadershipStyle === 'leader')) {
        compatibilityScore += 2
      }
      if (s1Data.leadershipStyle === 'collaborative' && s2Data.leadershipStyle === 'collaborative') {
        compatibilityScore += 1
      }

      pairs.push({ student1: s1, student2: s2, compatibilityScore })
    }
  }

  return pairs.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
}

// Get class-wide collaboration network stats
export function getClassNetworkStats(studentIds) {
  const students = studentIds.filter(id => socialConnections[id])

  const totalConnections = students.reduce((sum, id) => {
    return sum + socialConnections[id].strongBonds.length + socialConnections[id].weakConnections.length
  }, 0)

  const avgIsolationRisk = students.reduce((sum, id) => sum + socialConnections[id].isolationRisk, 0) / students.length
  const avgCollaboration = students.reduce((sum, id) => sum + socialConnections[id].collaborationScore, 0) / students.length

  const leadershipDistribution = {
    leader: students.filter(id => socialConnections[id].leadershipStyle === 'leader').length,
    collaborative: students.filter(id => socialConnections[id].leadershipStyle === 'collaborative').length,
    follower: students.filter(id => socialConnections[id].leadershipStyle === 'follower').length,
    independent: students.filter(id => socialConnections[id].leadershipStyle === 'independent').length,
  }

  return {
    totalStudents: students.length,
    totalConnections,
    avgConnectionsPerStudent: (totalConnections / students.length).toFixed(1),
    avgIsolationRisk: (avgIsolationRisk * 100).toFixed(1) + '%',
    avgCollaborationScore: avgCollaboration.toFixed(1),
    leadershipDistribution,
    isolatedStudentsCount: students.filter(id => socialConnections[id].isolationRisk >= 0.5).length
  }
}
