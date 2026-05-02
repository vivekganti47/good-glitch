export const classes = [
  {
    id: '10-A',
    name: 'Class 10-A',
    subject: 'Mathematics',
    grade: 10,
    section: 'A',
    studentIds: [
      'stu-01', 'stu-02', 'stu-03', 'stu-08', 'stu-09', 'stu-10', 'stu-11',
      'stu-12', 'stu-24', 'stu-28', 'stu-29', 'stu-30',
    ],
    schedule: [
      { day: 'Monday', time: '09:00', duration: 45 },
      { day: 'Wednesday', time: '09:00', duration: 45 },
      { day: 'Friday', time: '10:00', duration: 45 },
    ],
    currentTopic: 'quadratic-equations',
    nextTopic: 'coordinate-geometry',
    averageComprehension: 72,
    averageEngagement: 68,
    topicsCompleted: 8,
    totalTopics: 15,
  },
  {
    id: '10-B',
    name: 'Class 10-B',
    subject: 'Mathematics',
    grade: 10,
    section: 'B',
    studentIds: [
      'stu-04', 'stu-05', 'stu-12', 'stu-13', 'stu-14', 'stu-15', 'stu-16',
      'stu-25', 'stu-30', 'stu-31', 'stu-32',
    ],
    schedule: [
      { day: 'Monday', time: '10:00', duration: 45 },
      { day: 'Tuesday', time: '11:00', duration: 45 },
      { day: 'Thursday', time: '09:00', duration: 45 },
    ],
    currentTopic: 'trigonometry',
    nextTopic: 'statistics',
    averageComprehension: 65,
    averageEngagement: 62,
    topicsCompleted: 7,
    totalTopics: 15,
  },
  {
    id: '11-A',
    name: 'Class 11-A',
    subject: 'Mathematics',
    grade: 11,
    section: 'A',
    studentIds: [
      'stu-03', 'stu-05', 'stu-06', 'stu-17', 'stu-18', 'stu-19', 'stu-20',
      'stu-26', 'stu-33',
    ],
    schedule: [
      { day: 'Tuesday', time: '09:00', duration: 45 },
      { day: 'Thursday', time: '10:00', duration: 45 },
      { day: 'Saturday', time: '09:00', duration: 45 },
    ],
    currentTopic: 'calculus-intro',
    nextTopic: 'coordinate-geometry',
    averageComprehension: 74,
    averageEngagement: 70,
    topicsCompleted: 10,
    totalTopics: 18,
  },
  {
    id: '11-B',
    name: 'Class 11-B',
    subject: 'Physics',
    grade: 11,
    section: 'B',
    studentIds: [
      'stu-07', 'stu-21', 'stu-22', 'stu-23', 'stu-27', 'stu-34', 'stu-35',
    ],
    schedule: [
      { day: 'Monday', time: '11:00', duration: 45 },
      { day: 'Wednesday', time: '10:00', duration: 45 },
      { day: 'Friday', time: '09:00', duration: 45 },
    ],
    currentTopic: 'newtons-laws',
    nextTopic: 'work-energy',
    averageComprehension: 66,
    averageEngagement: 64,
    topicsCompleted: 6,
    totalTopics: 16,
  },
]

export function getClass(id) {
  return classes.find(c => c.id === id)
}
