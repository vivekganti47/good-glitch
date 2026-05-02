// Classroom culture and emotional climate data

export const classroomCulture = {
  '10-A': {
    participationEquity: 0.78, // 0-1 scale (1 = perfectly equal participation)
    peerSupportInstances: 24, // weekly count of students helping each other
    positiveInteractions: 156, // weekly positive peer interactions
    emotionalClimate: 'positive', // 'positive' | 'neutral' | 'tense'
    temperatureCheckScore: 7.8, // 0-10 average student self-report
    celebrationMoments: [
      {
        id: 'cel-001',
        date: '2024-01-15',
        studentId: 'stu-29',
        studentName: 'Rahul',
        achievement: 'First time scoring above 50% on algebra quiz',
        reaction: 'Class applauded, visible confidence boost',
        impact: 'high'
      },
      {
        id: 'cel-002',
        date: '2024-01-14',
        studentId: 'stu-11',
        studentName: 'Arjun',
        achievement: 'Explained geometry concept to group successfully',
        reaction: 'Peers thanked him, teacher praised teaching ability',
        impact: 'medium'
      },
      {
        id: 'cel-003',
        date: '2024-01-12',
        studentId: 'stu-02',
        studentName: 'Ananya',
        achievement: 'Perfect score on trigonometry test',
        reaction: 'Shared study notes with whole class',
        impact: 'high'
      },
      {
        id: 'cel-004',
        date: '2024-01-10',
        studentId: 'stu-03',
        studentName: 'Vivaan',
        achievement: 'Helped struggling student during group work',
        reaction: 'Both students solved problem together',
        impact: 'medium'
      }
    ],
    equityMetrics: {
      genderParticipation: { M: 0.48, F: 0.52 }, // Almost perfectly balanced
      learningStyleRepresentation: {
        visual: 0.35,
        auditory: 0.30,
        kinesthetic: 0.35
      },
      engagementBySeating: {
        front: 0.82,
        middle: 0.68,
        back: 0.54
      }
    },
    weeklyTrends: [
      { week: 'Jan 1-5', temperatureCheck: 7.2, peerSupport: 18, positiveInteractions: 142 },
      { week: 'Jan 8-12', temperatureCheck: 7.5, peerSupport: 22, positiveInteractions: 151 },
      { week: 'Jan 15-19', temperatureCheck: 7.8, peerSupport: 24, positiveInteractions: 156 }
    ]
  },
  '10-B': {
    participationEquity: 0.65, // Lower equity - some students dominate
    peerSupportInstances: 18,
    positiveInteractions: 132,
    emotionalClimate: 'neutral',
    temperatureCheckScore: 6.9,
    celebrationMoments: [
      {
        id: 'cel-005',
        date: '2024-01-16',
        studentId: 'stu-04',
        studentName: 'Saanvi',
        achievement: 'Led peer tutoring session for quadratic equations',
        reaction: '4 students improved scores after session',
        impact: 'high'
      },
      {
        id: 'cel-006',
        date: '2024-01-11',
        studentId: 'stu-14',
        studentName: 'Priya',
        achievement: 'Asked insightful question that sparked class discussion',
        reaction: 'Teacher elaborated, whole class benefited',
        impact: 'medium'
      }
    ],
    equityMetrics: {
      genderParticipation: { M: 0.42, F: 0.58 }, // Girls participate more
      learningStyleRepresentation: {
        visual: 0.32,
        auditory: 0.28,
        kinesthetic: 0.40
      },
      engagementBySeating: {
        front: 0.79,
        middle: 0.62,
        back: 0.48
      }
    },
    weeklyTrends: [
      { week: 'Jan 1-5', temperatureCheck: 6.5, peerSupport: 14, positiveInteractions: 118 },
      { week: 'Jan 8-12', temperatureCheck: 6.7, peerSupport: 16, positiveInteractions: 125 },
      { week: 'Jan 15-19', temperatureCheck: 6.9, peerSupport: 18, positiveInteractions: 132 }
    ]
  },
  '11-A': {
    participationEquity: 0.82, // High equity
    peerSupportInstances: 21,
    positiveInteractions: 148,
    emotionalClimate: 'positive',
    temperatureCheckScore: 8.1,
    celebrationMoments: [
      {
        id: 'cel-007',
        date: '2024-01-13',
        studentId: 'stu-06',
        studentName: 'Ishita',
        achievement: 'Tutored 3 classmates to improve calculus comprehension by 15%',
        reaction: 'Teacher recognized her mentorship publicly',
        impact: 'high'
      },
      {
        id: 'cel-008',
        date: '2024-01-09',
        studentId: 'stu-33',
        studentName: 'Rajat',
        achievement: 'Improved from 46% to 54% on limits after extra practice',
        reaction: 'Classmates encouraged him to keep working',
        impact: 'medium'
      }
    ],
    equityMetrics: {
      genderParticipation: { M: 0.51, F: 0.49 },
      learningStyleRepresentation: {
        visual: 0.33,
        auditory: 0.37,
        kinesthetic: 0.30
      },
      engagementBySeating: {
        front: 0.88,
        middle: 0.76,
        back: 0.62
      }
    },
    weeklyTrends: [
      { week: 'Jan 1-5', temperatureCheck: 7.8, peerSupport: 19, positiveInteractions: 138 },
      { week: 'Jan 8-12', temperatureCheck: 8.0, peerSupport: 20, positiveInteractions: 143 },
      { week: 'Jan 15-19', temperatureCheck: 8.1, peerSupport: 21, positiveInteractions: 148 }
    ]
  },
  '11-B': {
    participationEquity: 0.74,
    peerSupportInstances: 16,
    positiveInteractions: 98, // Smaller class
    emotionalClimate: 'positive',
    temperatureCheckScore: 7.6,
    celebrationMoments: [
      {
        id: 'cel-009',
        date: '2024-01-14',
        studentId: 'stu-07',
        studentName: 'Rohan',
        achievement: 'Mastered free body diagrams, taught concept to Omkar',
        reaction: 'Both students solved complex problems together',
        impact: 'high'
      },
      {
        id: 'cel-010',
        date: '2024-01-10',
        studentId: 'stu-34',
        studentName: 'Kavya',
        achievement: 'Remembered to include normal force after repeated forgetting',
        reaction: 'Teacher praised persistence and growth mindset',
        impact: 'medium'
      }
    ],
    equityMetrics: {
      genderParticipation: { M: 0.53, F: 0.47 },
      learningStyleRepresentation: {
        visual: 0.29,
        auditory: 0.28,
        kinesthetic: 0.43 // Physics attracts kinesthetic learners
      },
      engagementBySeating: {
        front: 0.85,
        middle: 0.72,
        back: 0.58
      }
    },
    weeklyTrends: [
      { week: 'Jan 1-5', temperatureCheck: 7.2, peerSupport: 13, positiveInteractions: 88 },
      { week: 'Jan 8-12', temperatureCheck: 7.4, peerSupport: 15, positiveInteractions: 93 },
      { week: 'Jan 15-19', temperatureCheck: 7.6, peerSupport: 16, positiveInteractions: 98 }
    ]
  }
}

// Helper to get culture data for a specific class
export function getClassCulture(classId) {
  return classroomCulture[classId] || null
}

// Helper to get recent celebration moments across all classes
export function getAllCelebrationMoments(limit = 10) {
  const allMoments = []
  Object.entries(classroomCulture).forEach(([classId, data]) => {
    data.celebrationMoments.forEach(moment => {
      allMoments.push({ ...moment, classId })
    })
  })
  return allMoments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

// Helper to identify classes needing culture intervention
export function getClassesNeedingSupport() {
  const needsSupport = []
  Object.entries(classroomCulture).forEach(([classId, data]) => {
    const issues = []

    if (data.participationEquity < 0.7) {
      issues.push('Low participation equity')
    }
    if (data.temperatureCheckScore < 7.0) {
      issues.push('Low emotional climate')
    }
    if (data.emotionalClimate === 'tense') {
      issues.push('Tense classroom atmosphere')
    }
    if (data.peerSupportInstances < 15) {
      issues.push('Low peer collaboration')
    }

    if (issues.length > 0) {
      needsSupport.push({
        classId,
        issues,
        severity: issues.length >= 2 ? 'high' : 'medium'
      })
    }
  })
  return needsSupport.sort((a, b) => {
    if (a.severity === 'high' && b.severity !== 'high') return -1
    if (a.severity !== 'high' && b.severity === 'high') return 1
    return b.issues.length - a.issues.length
  })
}

// Get aggregate culture stats across all classes
export function getOverallCultureStats() {
  const classes = Object.keys(classroomCulture)
  const avgTemperature = classes.reduce((sum, id) => sum + classroomCulture[id].temperatureCheckScore, 0) / classes.length
  const avgEquity = classes.reduce((sum, id) => sum + classroomCulture[id].participationEquity, 0) / classes.length
  const totalCelebrations = classes.reduce((sum, id) => sum + classroomCulture[id].celebrationMoments.length, 0)
  const totalPeerSupport = classes.reduce((sum, id) => sum + classroomCulture[id].peerSupportInstances, 0)

  return {
    avgTemperatureCheck: avgTemperature.toFixed(1),
    avgParticipationEquity: (avgEquity * 100).toFixed(1) + '%',
    totalCelebrationMoments: totalCelebrations,
    totalPeerSupportInstances: totalPeerSupport,
    classesWithPositiveClimate: classes.filter(id => classroomCulture[id].emotionalClimate === 'positive').length,
    classesNeedingSupport: getClassesNeedingSupport().length
  }
}
