// Parent communication templates for generating reports

export const parentCommunicationTemplates = {
  celebration: {
    name: 'Celebration',
    tone: 'celebratory',
    structure: {
      subject: 'Great news about {studentName}\'s progress in {subject}!',
      greeting: 'Dear {parentName},',
      opening: 'I\'m excited to share some wonderful news about {studentName}\'s recent performance in {subject}.',
      highlightsIntro: '{studentName} has shown exceptional growth in the following areas:',
      positives: [
        '{studentName} scored {topScore}% on {topTopic}, demonstrating mastery of the concept.',
        'Their {strength1} skills are outstanding, consistently performing in the top {percentile}% of the class.',
        '{studentName} has been a positive influence in class, {positiveAction}.'
      ],
      nextSteps: [
        'To maintain this momentum, I recommend {recommendation1}.',
        '{studentName} is ready for {advancedActivity}.'
      ],
      closing: 'You should be very proud of {studentName}\'s dedication and progress. Please feel free to reach out if you\'d like to discuss their continued success.',
      signature: 'Best regards,\nMs. Kavitha\nMathematics Teacher'
    }
  },
  progress: {
    name: 'Progress Update',
    tone: 'encouraging',
    structure: {
      subject: 'Update on {studentName}\'s progress in {subject}',
      greeting: 'Dear {parentName},',
      opening: 'I wanted to provide you with an update on {studentName}\'s progress in {subject} this term.',
      highlightsIntro: '{studentName} has shown improvement in several areas:',
      positives: [
        '{studentName} has improved their {improvementTopic} score from {beforeScore}% to {afterScore}%.',
        'I\'ve noticed {studentName} {positiveAction}, which shows great {positiveQuality}.',
        'Their {strength1} and {strength2} skills are developing well.'
      ],
      growthAreasIntro: 'To support continued growth, we\'re working together on:',
      growthAreas: [
        'Building stronger understanding of {weakness1}, where comprehension is currently at {weaknessScore}%.',
        'Increasing {improvementArea}, which will help with overall confidence.'
      ],
      actionItemsIntro: 'You can support {studentName} at home by:',
      actionItems: [
        '{homeActivity} for 15-20 minutes, 3 times per week.',
        'Reviewing {topic} concepts using the resources I\'ve shared.',
        'Encouraging {studentName} to {encouragement}.'
      ],
      closing: 'I\'m committed to helping {studentName} succeed and reach their full potential. Please don\'t hesitate to contact me if you have any questions or would like to schedule a meeting.',
      signature: 'Best regards,\nMs. Kavitha\nMathematics Teacher'
    }
  },
  concern: {
    name: 'Concern / Support Needed',
    tone: 'supportive',
    structure: {
      subject: 'Important update regarding {studentName}\'s {subject} class',
      greeting: 'Dear {parentName},',
      opening: 'I hope this message finds you well. I\'m reaching out to discuss some concerns about {studentName}\'s recent performance in {subject}, and to work together on a support plan.',
      highlightsIntro: 'First, I want to acknowledge {studentName}\'s strengths:',
      positives: [
        '{studentName} shows good understanding of {strength1}.',
        'I appreciate {studentName}\'s {positiveQuality}.',
      ],
      concernsIntro: 'However, I\'ve noticed some areas that need attention:',
      concerns: [
        '{studentName}\'s comprehension of {weakness1} is currently at {weaknessScore}%, which is below the class average of {classAverage}%.',
        '{concernObservation} over the past {timeframe}.',
        '{behaviorConcern}.'
      ],
      interventionsIntro: 'I\'ve already taken the following steps to support {studentName}:',
      interventions: [
        '{intervention1}',
        '{intervention2}'
      ],
      actionItemsIntro: 'To help {studentName} get back on track, I recommend:',
      actionItems: [
        '{recommendation1}',
        '{recommendation2}',
        'Scheduling a parent-teacher conference to discuss additional support strategies.'
      ],
      closing: 'I believe that with consistent support from both school and home, {studentName} can overcome these challenges. Please let me know a good time for us to connect this week to create an action plan together.',
      signature: 'Best regards,\nMs. Kavitha\nMathematics Teacher'
    }
  }
}

// Helper function to generate a parent report based on student data
export function generateParentReport(student, template, customData = {}) {
  const selectedTemplate = parentCommunicationTemplates[template]
  if (!selectedTemplate) return null

  // Extract student data
  const studentName = student.name || customData.studentName || 'Student'
  const parentName = customData.parentName || 'Parent/Guardian'
  const subject = customData.subject || 'Mathematics'

  // Calculate top performance and weaknesses
  const scores = student.scores || {}
  const sortedTopics = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const topTopic = sortedTopics[0] ? sortedTopics[0][0].replace(/-/g, ' ') : 'recent topic'
  const topScore = sortedTopics[0] ? sortedTopics[0][1] : 0
  const weakTopic = sortedTopics[sortedTopics.length - 1] ? sortedTopics[sortedTopics.length - 1][0].replace(/-/g, ' ') : ''
  const weakScore = sortedTopics[sortedTopics.length - 1] ? sortedTopics[sortedTopics.length - 1][1] : 0

  const strengths = student.strengths || []
  const weaknesses = student.weaknesses || []

  // Replacement values
  const values = {
    studentName,
    parentName,
    subject,
    topTopic,
    topScore,
    strength1: strengths[0] ? strengths[0].replace(/-/g, ' ') : 'problem-solving',
    strength2: strengths[1] ? strengths[1].replace(/-/g, ' ') : 'analytical thinking',
    weakness1: weaknesses[0] ? weaknesses[0].replace(/-/g, ' ') : weakTopic,
    weakness2: weaknesses[1] ? weaknesses[1].replace(/-/g, ' ') : 'foundational concepts',
    weaknessScore: weakScore,
    comprehension: student.comprehension || 0,
    classAverage: customData.classAverage || 70,
    percentile: topScore >= 90 ? '10' : topScore >= 80 ? '20' : '30',
    positiveAction: customData.positiveAction || 'helping classmates during group work',
    positiveQuality: customData.positiveQuality || 'dedication and perseverance',
    improvementTopic: customData.improvementTopic || 'algebra',
    beforeScore: customData.beforeScore || 60,
    afterScore: customData.afterScore || 72,
    improvementArea: customData.improvementArea || 'participation in class discussions',
    homeActivity: customData.homeActivity || 'Practice ' + (weakTopic || 'current topics'),
    encouragement: customData.encouragement || 'ask questions when unsure',
    topic: topTopic,
    recommendation1: customData.recommendation1 || 'continued practice with challenging problems',
    recommendation2: customData.recommendation2 || 'one-on-one tutoring sessions twice weekly',
    advancedActivity: customData.advancedActivity || 'advanced problem sets',
    concernObservation: customData.concernObservation || 'declining engagement',
    timeframe: customData.timeframe || 'two weeks',
    behaviorConcern: customData.behaviorConcern || 'Participation has decreased',
    intervention1: customData.intervention1 || 'Provided additional practice materials',
    intervention2: customData.intervention2 || 'Offered after-school help sessions',
    ...customData // Allow custom overrides
  }

  // Generate report by replacing placeholders
  const replaceTokens = (text) => {
    if (!text) return ''
    return text.replace(/\{(\w+)\}/g, (match, key) => values[key] || match)
  }

  const structure = selectedTemplate.structure
  const generated = {
    template: template,
    tone: selectedTemplate.tone,
    subject: replaceTokens(structure.subject),
    body: {
      greeting: replaceTokens(structure.greeting),
      opening: replaceTokens(structure.opening),
      sections: []
    }
  }

  // Build sections based on template
  if (structure.highlightsIntro) {
    generated.body.sections.push({
      title: 'Highlights',
      intro: replaceTokens(structure.highlightsIntro),
      items: structure.positives.map(p => replaceTokens(p))
    })
  }

  if (structure.growthAreasIntro) {
    generated.body.sections.push({
      title: 'Growth Areas',
      intro: replaceTokens(structure.growthAreasIntro),
      items: structure.growthAreas.map(g => replaceTokens(g))
    })
  }

  if (structure.concernsIntro) {
    generated.body.sections.push({
      title: 'Concerns',
      intro: replaceTokens(structure.concernsIntro),
      items: structure.concerns.map(c => replaceTokens(c))
    })
  }

  if (structure.interventionsIntro) {
    generated.body.sections.push({
      title: 'Interventions',
      intro: replaceTokens(structure.interventionsIntro),
      items: structure.interventions.map(i => replaceTokens(i))
    })
  }

  if (structure.actionItemsIntro) {
    generated.body.sections.push({
      title: 'Action Items',
      intro: replaceTokens(structure.actionItemsIntro),
      items: structure.actionItems.map(a => replaceTokens(a))
    })
  }

  if (structure.nextSteps) {
    generated.body.sections.push({
      title: 'Next Steps',
      items: structure.nextSteps.map(n => replaceTokens(n))
    })
  }

  generated.body.closing = replaceTokens(structure.closing)
  generated.body.signature = replaceTokens(structure.signature)

  return generated
}

// Helper to format generated report as plain text email
export function formatAsEmail(generatedReport) {
  if (!generatedReport) return ''

  let email = `Subject: ${generatedReport.subject}\n\n`
  email += `${generatedReport.body.greeting}\n\n`
  email += `${generatedReport.body.opening}\n\n`

  generatedReport.body.sections.forEach(section => {
    if (section.intro) {
      email += `${section.intro}\n\n`
    }
    section.items.forEach((item, idx) => {
      email += `${idx + 1}. ${item}\n`
    })
    email += '\n'
  })

  email += `${generatedReport.body.closing}\n\n`
  email += `${generatedReport.body.signature}\n`

  return email
}

// Helper to format as HTML for PDF
export function formatAsHTML(generatedReport) {
  if (!generatedReport) return ''

  let html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">`
  html += `<h2>${generatedReport.subject}</h2>`
  html += `<p>${generatedReport.body.greeting}</p>`
  html += `<p>${generatedReport.body.opening}</p>`

  generatedReport.body.sections.forEach(section => {
    if (section.title) {
      html += `<h3 style="color: #10B981; margin-top: 20px;">${section.title}</h3>`
    }
    if (section.intro) {
      html += `<p><em>${section.intro}</em></p>`
    }
    html += `<ul>`
    section.items.forEach(item => {
      html += `<li>${item}</li>`
    })
    html += `</ul>`
  })

  html += `<p style="margin-top: 20px;">${generatedReport.body.closing}</p>`
  html += `<p style="white-space: pre-line;">${generatedReport.body.signature}</p>`
  html += `</div>`

  return html
}
