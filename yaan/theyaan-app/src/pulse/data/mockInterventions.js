// Intervention history for students
// Maps student IDs to their intervention records

export const interventionHistory = {
  'stu-01': [
    {
      id: 'int-001',
      date: '2024-01-10',
      type: 'group-support',
      trigger: 'Calculus struggling (78%)',
      action: 'Added to advanced study group with peer tutoring from Ishita',
      outcome: 'success',
      followUpNeeded: false,
      comprehensionBefore: 75,
      comprehensionAfter: 82,
      notes: 'Aarav responded well to collaborative learning. Now comfortable with limits concept.',
      nextSteps: []
    }
  ],
  'stu-11': [
    {
      id: 'int-002',
      date: '2024-01-15',
      type: 'one-on-one',
      trigger: 'Disengaged for 30+ minutes in class',
      action: 'Pulled aside during group work to check understanding of quadratic equations',
      outcome: 'partial-success',
      followUpNeeded: true,
      followUpDate: '2024-01-22',
      comprehensionBefore: 62,
      comprehensionAfter: 68,
      notes: 'Arjun understood after 1:1 explanation but still lacks confidence. Needs continued monitoring.',
      nextSteps: ['Pair with confident peer for next topic', 'Check in at start of each class this week']
    },
    {
      id: 'int-003',
      date: '2024-01-08',
      type: 'reteach-session',
      trigger: 'Failed geometry quiz (45%)',
      action: 'After-school reteaching session on Pythagorean theorem with visual models',
      outcome: 'success',
      followUpNeeded: false,
      comprehensionBefore: 45,
      comprehensionAfter: 72,
      notes: 'Visual approach clicked! Arjun is a strong visual learner. Retook quiz and scored 72%.',
      nextSteps: []
    }
  ],
  'stu-14': [
    {
      id: 'int-004',
      date: '2024-01-12',
      type: 'one-on-one',
      trigger: 'Confused expression during trigonometry lesson',
      action: 'Quick check-in during group work, re-explained sin/cos/tan with unit circle',
      outcome: 'success',
      followUpNeeded: false,
      comprehensionBefore: 68,
      comprehensionAfter: 75,
      notes: 'Priya just needed clarification on which ratio to use. Good progress.',
      nextSteps: []
    }
  ],
  'stu-29': [
    {
      id: 'int-005',
      date: '2024-01-16',
      type: 'parent-call',
      trigger: 'Declining engagement over past week (45% algebra comprehension)',
      action: 'Called parents to discuss support strategies. Recommended daily 15-min practice.',
      outcome: 'pending',
      followUpNeeded: true,
      followUpDate: '2024-01-23',
      comprehensionBefore: 45,
      comprehensionAfter: 45,
      notes: 'Parents very receptive. Will implement practice routine and check in next week.',
      nextSteps: ['Monitor engagement in next 3 classes', 'Follow up with parents on Friday']
    },
    {
      id: 'int-006',
      date: '2024-01-14',
      type: 'group-support',
      trigger: 'Algebra struggling (45%)',
      action: 'Assigned peer tutor Aarav for algebra fundamentals',
      outcome: 'partial-success',
      followUpNeeded: true,
      followUpDate: '2024-01-21',
      comprehensionBefore: 42,
      comprehensionAfter: 48,
      notes: 'Some progress but still needs more foundational work. Continuing peer sessions.',
      nextSteps: ['Continue peer tutoring 2x/week', 'Provide additional practice worksheets']
    }
  ],
  'stu-30': [
    {
      id: 'int-007',
      date: '2024-01-13',
      type: 'one-on-one',
      trigger: 'Low participation (last spoke 45 min ago)',
      action: 'Encouraged Pooja to share answer, validated her thinking process',
      outcome: 'success',
      followUpNeeded: false,
      comprehensionBefore: 52,
      comprehensionAfter: 52,
      notes: 'Confidence issue more than comprehension. Answer was correct! Smiled when validated.',
      nextSteps: ['Call on Pooja early in next class to build momentum']
    }
  ],
  'stu-31': [
    {
      id: 'int-008',
      date: '2024-01-17',
      type: 'parent-call',
      trigger: 'Completely disengaged for 3rd consecutive class',
      action: 'Parent conference call to discuss Manish\'s disengagement and low comprehension (44%)',
      outcome: 'pending',
      followUpNeeded: true,
      followUpDate: '2024-01-24',
      comprehensionBefore: 44,
      comprehensionAfter: 44,
      notes: 'Parents were unaware of the extent of the issue. Discussed potential learning assessment.',
      nextSteps: ['Seat Manish near front next class', 'Set up meeting with school counselor', 'Daily check-ins for 1 week']
    }
  ],
  'stu-33': [
    {
      id: 'int-009',
      date: '2024-01-11',
      type: 'reteach-session',
      trigger: 'Struggling with calculus limits (46% comprehension)',
      action: 'After-school session using numerical table approach instead of algebraic',
      outcome: 'partial-success',
      followUpNeeded: true,
      followUpDate: '2024-01-18',
      comprehensionBefore: 46,
      comprehensionAfter: 54,
      notes: 'Rajat has algebra gaps that affect limits understanding. Needs foundational support.',
      nextSteps: ['Recommend tutor for algebra review', 'Pair with Ishita for peer support']
    }
  ],
  'stu-06': [
    {
      id: 'int-010',
      date: '2024-01-09',
      type: 'group-support',
      trigger: 'Consistently high performance (91% avg) - enrichment needed',
      action: 'Provided advanced problem sets and leadership role in group work',
      outcome: 'success',
      followUpNeeded: false,
      comprehensionBefore: 91,
      comprehensionAfter: 93,
      notes: 'Ishita thriving with challenge. Natural teacher - peers seek her help.',
      nextSteps: []
    }
  ],
}

// Aggregate intervention statistics
export const interventionStats = {
  totalInterventions: 10,
  byType: {
    'one-on-one': 4,
    'parent-call': 2,
    'reteach-session': 2,
    'group-support': 3
  },
  byOutcome: {
    'success': 5,
    'partial-success': 3,
    'pending': 2,
    'no-change': 0
  },
  averageComprehensionGain: 6.8, // percentage points
  successRate: 0.625, // 5 out of 8 completed (excluding pending)
  followUpsNeeded: 5
}

// Helper to get interventions for a specific student
export function getStudentInterventions(studentId) {
  return interventionHistory[studentId] || []
}

// Helper to get recent interventions across all students
export function getRecentInterventions(limit = 10) {
  const allInterventions = []
  Object.entries(interventionHistory).forEach(([studentId, interventions]) => {
    interventions.forEach(int => {
      allInterventions.push({ ...int, studentId })
    })
  })
  return allInterventions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

// Helper to get pending follow-ups
export function getPendingFollowUps() {
  const pending = []
  Object.entries(interventionHistory).forEach(([studentId, interventions]) => {
    interventions.forEach(int => {
      if (int.followUpNeeded) {
        pending.push({ ...int, studentId })
      }
    })
  })
  return pending.sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
}
