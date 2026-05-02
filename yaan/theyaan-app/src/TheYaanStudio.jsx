import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// STAR FIELD - Subtle parallax stars
// ============================================================
function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let stars = []

    const starColors = [
      { r: 255, g: 255, b: 255 },
      { r: 200, g: 220, b: 255 },
      { r: 255, g: 240, b: 220 },
      { r: 255, g: 200, b: 150 },
      { r: 180, g: 200, b: 255 },
    ]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 8
      initStars()
    }

    const initStars = () => {
      stars = []
      const numStars = Math.floor((canvas.width * canvas.height) / 8000)
      for (let i = 0; i < numStars; i++) {
        const layer = Math.random()
        const colorIndex = Math.floor(Math.random() * starColors.length)
        const isBright = Math.random() > 0.97
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: isBright ? Math.random() * 1.8 + 1 : Math.random() * 1 + 0.2,
          baseOpacity: layer < 0.3 ? 0.2 : layer < 0.7 ? 0.4 : 0.7,
          twinkleSpeed: Math.random() * 0.002 + 0.0005,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleAmplitude: Math.random() * 0.4 + 0.2,
          color: starColors[colorIndex],
          hasGlow: isBright,
        })
      }
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase)
          * star.twinkleAmplitude + (1 - star.twinkleAmplitude)
        const opacity = star.baseOpacity * twinkle
        const { r, g, b } = star.color

        if (star.hasGlow) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3)
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`)
          gradient.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw(0)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
}

// ============================================================
// NEBULA GLOW - Ambient colored gradients
// ============================================================
function NebulaGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)',
          top: '5%', left: '-10%',
          animation: 'nebulaPulse 15s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
          top: '35%', right: '-5%',
          animation: 'nebulaPulse 20s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.025]"
        style={{
          background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
          bottom: '30%', left: '15%',
          animation: 'nebulaPulse 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.025]"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)',
          bottom: '10%', right: '10%',
          animation: 'nebulaPulse 22s ease-in-out infinite reverse',
        }}
      />
    </div>
  )
}

// ============================================================
// NAVIGATION DOTS
// ============================================================
function NavigationDots({ sections, activeSection }) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className="group flex items-center gap-3">
          <span className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
            activeSection === section.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`} style={{ color: section.color }}>
            {section.label}
          </span>
          <span
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === section.id ? 'scale-150' : 'scale-100 opacity-40'
            }`}
            style={{ backgroundColor: activeSection === section.id ? section.color : '#F8FAFC' }}
          />
        </a>
      ))}
    </div>
  )
}

// ============================================================
// SECTION WRAPPER with scroll animations
// ============================================================
function Section({ id, className, children, noAnimate }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (!ref.current || noAnimate) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 80%' }
        }
      )
    })
    return () => ctx.revert()
  }, [noAnimate])

  return (
    <section id={id} ref={ref} className={`relative ${className || ''}`}>
      {children}
    </section>
  )
}

// ============================================================
// PRODUCT DETAILS - Full detail data for every product
// ============================================================
const PRODUCT_DETAILS = {
  SENTRA: {
    color: '#EC4899',
    sector: 'Healthcare',
    tagline: 'Always-on edge AI monitoring for seniors, chronic illness patients, and neurodivergent individuals.',
    vision: 'Healthcare monitoring shouldn\'t require an internet connection or a subscription to a server farm. SENTRA processes everything locally — on-device AI that understands context, detects anomalies, and alerts caregivers in under a second. Built on custom edge hardware with silicon-level encryption, patient data never leaves the device.',
    flow: [
      { title: 'Wearable Sensors', desc: 'Continuous vitals, movement, and behavioral data captured from non-intrusive wearable devices.' },
      { title: 'On-Device AI', desc: 'All processing runs on custom edge hardware. Zero data transmitted externally.' },
      { title: 'Pattern Analysis', desc: 'Learns individual baselines. Detects anomalies in behavior, vitals, and routine.' },
      { title: 'Instant Response', desc: 'Sub-second caregiver alerts. Automated emergency protocols. Family dashboard updates.' },
    ],
    capabilities: [
      { title: 'Chronic Condition Intelligence', desc: 'Specialized modules for diabetes, hypertension, COPD, and cardiac conditions with condition-specific baselines.' },
      { title: 'Sensory-Friendly Design', desc: 'Non-intrusive monitoring configurable for neurodivergent users. Adaptive alert thresholds.' },
      { title: 'Family Circle', desc: 'Secure caregiver dashboard with real-time status, historical trends, and instant alerts.' },
      { title: 'Offline-First Architecture', desc: 'Full functionality without internet connectivity. Data syncs when connection is available.' },
    ],
    architecture: [
      'Custom edge processor with hardware-level encryption',
      'Sub-second alert pipeline — under 1s end-to-end',
      'DPDP and HIPAA compliant by architectural design',
      'Full operation in zero-connectivity environments',
    ],
    useCases: [
      'Senior living facilities with 24/7 resident monitoring',
      'Home care for chronic disease patients',
      'Post-surgical recovery tracking',
      'Neurodivergent individual support programs',
    ],
    metrics: [
      { stat: '<1s', label: 'Alert latency' },
      { stat: '100%', label: 'Offline capable' },
      { stat: '24/7', label: 'Continuous monitoring' },
    ],
  },
  DRISHTI: {
    color: '#EC4899',
    sector: 'Healthcare',
    tagline: 'The doctor\'s AI companion. In-ear guidance, ambient visual AI, and voice-first interface.',
    vision: 'A consultation room where the AI companion has already reviewed the patient\'s history, is watching through intelligent cameras, listening to every word, and surfacing exactly what the doctor needs — before they ask. DRISHTI combines in-ear prompts, wearable display overlays, and ambient room intelligence into a seamless clinical workflow.',
    flow: [
      { title: 'Ambient Capture', desc: 'Cameras, microphones, and ambient sensors capture the full consultation context in real time.' },
      { title: 'Multi-Modal AI', desc: 'Visual, audio, and clinical data processed simultaneously on custom edge hardware.' },
      { title: 'Context Synthesis', desc: 'Patient history, current symptoms, drug interactions, and clinical guidelines merged into insight.' },
      { title: 'Doctor Interface', desc: 'In-ear prompts, wearable display overlays, and ambient screen updates delivered in real time.' },
    ],
    capabilities: [
      { title: 'Visual AI', desc: 'Cameras analyze skin conditions, track patient movement, and auto-capture examination findings.' },
      { title: 'Voice-First Interface', desc: 'Custom audio hardware optimized for Indian accents and hospital acoustic environments.' },
      { title: 'Clinical Synthesis', desc: 'Merges patient history, labs, imaging, and guidelines into a coherent clinical picture.' },
      { title: 'Adaptive Workflow', desc: 'Learns each doctor\'s preferred commands, shortcuts, and clinical decision patterns.' },
    ],
    architecture: [
      'Multi-modal sensor fusion on edge hardware',
      'Custom audio DSP for Indian acoustic environments',
      'Ambient display protocol for multi-screen output',
      'EHR and ABHA integration ready',
    ],
    useCases: [
      'Outpatient department consultations',
      'Specialist clinic workflows',
      'Rural telemedicine with limited infrastructure',
      'Emergency department triage',
    ],
    metrics: [
      { stat: '50%', label: 'Less documentation' },
      { stat: '0', label: 'Keyboard touches needed' },
      { stat: '100%', label: 'Patient face-time' },
    ],
  },
  PRAXIS: {
    color: '#EC4899',
    sector: 'Healthcare',
    tagline: 'Medical education through immersive VR/AR. From anatomy to rare conditions — learn anything in healthcare.',
    vision: 'A medical student in Tier-2 India should have the same learning opportunities as one at AIIMS. Walk through a 3D heart. Practice procedures a hundred times. Encounter rare diseases without waiting years. PRAXIS delivers AIIMS-level medical training through immersive, haptic-enabled simulation accessible anywhere.',
    flow: [
      { title: 'Scenario Selection', desc: 'Choose from thousands of clinical scenarios, rare cases, and surgical procedures.' },
      { title: 'Immersive Simulation', desc: 'Full VR/AR environment with anatomically accurate 3D models and real-time physics.' },
      { title: 'Haptic Interaction', desc: 'Feel tissue resistance, instrument feedback, and physiological responses through haptics.' },
      { title: 'Assessment', desc: 'AI evaluates technique, decision-making speed, and identifies areas for improvement.' },
    ],
    capabilities: [
      { title: 'Rare Case Library', desc: 'Build diagnostic pattern recognition for conditions that textbooks and clinical rotations can\'t teach.' },
      { title: 'Beyond Surgery', desc: 'Diagnostic reasoning, patient communication, emergency response, and clinical decision scenarios.' },
      { title: 'Haptic Realism', desc: 'Feel the resistance of tissue, the feedback of instruments, physiological responses during procedures.' },
      { title: 'Collaborative Training', desc: 'Multi-user scenarios for team-based and cross-functional medical training exercises.' },
    ],
    architecture: [
      'Real-time 3D rendering with physics simulation',
      'Haptic engine with force-feedback calibration',
      'Multiplayer scenario synchronization',
      'Cloud-free local operation available',
    ],
    useCases: [
      'Medical college anatomy and procedure training',
      'Surgical skills development and assessment',
      'Emergency medicine drill simulations',
      'Continuing medical education programs',
    ],
    metrics: [
      { stat: '42%', label: 'Better diagnostic accuracy' },
      { stat: '38%', label: 'Faster skill acquisition' },
      { stat: '∞', label: 'Practice attempts available' },
    ],
  },
  KAVACH: {
    color: '#EC4899',
    sector: 'Healthcare',
    tagline: 'Hardware security module purpose-built for healthcare. Silicon-level patient data encryption.',
    vision: 'Patient data privacy can\'t be a software patch or a policy document — it needs to be a physical guarantee. KAVACH is a hardware security module that encrypts patient data at the silicon level with tamper-resistant design. The physical foundation that makes our entire healthcare ecosystem trustworthy.',
    flow: [
      { title: 'Data Ingestion', desc: 'Patient data enters through authenticated, encrypted channels with identity verification.' },
      { title: 'Hardware Encryption', desc: 'Silicon-level encryption processes data within tamper-resistant hardware modules.' },
      { title: 'Secure Processing', desc: 'All computation happens within the secure enclave. No plaintext data exposure at any stage.' },
      { title: 'Verified Output', desc: 'Encrypted results delivered only to authorized endpoints with full cryptographic audit trail.' },
    ],
    capabilities: [
      { title: 'Silicon-Level Security', desc: 'Encryption happens at the hardware layer — not in software that can be patched or bypassed.' },
      { title: 'Tamper Detection', desc: 'Physical and electronic tamper-evident design with automatic data protection on breach attempt.' },
      { title: 'Zero-Trust Architecture', desc: 'Every access request is verified independently. No implicit trust granted within the system.' },
      { title: 'Compliance by Design', desc: 'DPDP, HIPAA, and sector-specific regulatory requirements met at the architectural level.' },
    ],
    architecture: [
      'AES-256 encryption at silicon level',
      'Tamper-resistant physical enclosure',
      'Zero-knowledge proof verification support',
      'Full cryptographic audit chain',
    ],
    useCases: [
      'Hospital data center patient record protection',
      'Clinic-level patient data security',
      'Telemedicine session data encryption',
      'Medical research data protection',
    ],
    metrics: [
      { stat: 'AES-256', label: 'Hardware encryption' },
      { stat: '0', label: 'Data leaks by design' },
      { stat: '100%', label: 'Audit trail coverage' },
    ],
  },
  antarYaan: {
    color: '#10B981',
    sector: 'Education',
    tagline: 'The AI mentor solving Bloom\'s 2-sigma problem. Personalized tutoring through a gamified universe of mastery.',
    vision: 'In 1984, Benjamin Bloom proved one-on-one tutoring makes average students perform two standard deviations better. antarYaan is that tutor — an AI companion that adapts to each student\'s pace, fills knowledge gaps, and makes learning feel like an adventure across a universe of knowledge. Available in 12 Indian languages.',
    flow: [
      { title: 'Learning Assessment', desc: 'AI evaluates current knowledge, learning style, and pace through adaptive questioning.' },
      { title: 'Personalized Path', desc: 'Dynamic curriculum generated. Subjects as constellations, topics as planets to explore.' },
      { title: 'Guided Practice', desc: 'AI mentor provides context, hints, and explanations adapted to the student\'s understanding.' },
      { title: 'Mastery Tracking', desc: 'Progress mapped across a knowledge graph. Gaps identified and addressed automatically.' },
    ],
    capabilities: [
      { title: 'Adaptive Difficulty', desc: 'Questions and content adjust in real-time based on the student\'s demonstrated mastery level.' },
      { title: 'Mastery Constellations', desc: 'Visual knowledge graph where subjects are constellations and each concept is a star to unlock.' },
      { title: 'Real-World Quests', desc: 'Learning extends beyond screens with missions that connect to physical world activities.' },
      { title: 'Multi-Language Support', desc: 'Full learning experience in 12 Indian languages with culturally relevant content.' },
    ],
    architecture: [
      'Knowledge graph with 50,000+ mapped concepts',
      'Reinforcement learning curriculum engine',
      'Offline-capable content delivery',
      'Multi-device sync across phone, tablet, desktop',
    ],
    useCases: [
      'Government school supplementary education',
      'Personalized tutoring for underserved students',
      'Competitive exam preparation',
      'Self-directed adult learning programs',
    ],
    metrics: [
      { stat: '2σ', label: 'Improvement target' },
      { stat: '1:1', label: 'Tutor-to-student ratio' },
      { stat: '12', label: 'Languages supported' },
    ],
  },
  PULSE: {
    color: '#10B981',
    sector: 'Education',
    tagline: 'The teacher\'s sixth sense. Real-time comprehension mapping, emotional indicators, and learning gap detection.',
    vision: 'A teacher with 40 students can\'t know where each one is struggling. PULSE changes that. Real-time insight into comprehension, engagement, and emotional state for every student — turning a class of 40 into 40 individuals, each understood and supported.',
    flow: [
      { title: 'Classroom Input', desc: 'Student responses, interaction patterns, and behavioral signals collected in real time.' },
      { title: 'AI Analysis', desc: 'Comprehension levels, emotional states, and engagement patterns computed per student.' },
      { title: 'Teacher Dashboard', desc: 'Real-time visualization of class understanding. Individual student insight cards and trends.' },
      { title: 'Guided Intervention', desc: 'Smart grouping suggestions, activity recommendations, and gap-specific exercises.' },
    ],
    capabilities: [
      { title: 'Comprehension Radar', desc: 'Real-time visualization showing which students are following and who needs attention.' },
      { title: 'Emotional Intelligence', desc: 'Subtle indicators of frustration, boredom, anxiety, and engagement levels per student.' },
      { title: 'Smart Grouping', desc: 'AI-suggested student groups for activities, peer tutoring, and collaborative exercises.' },
      { title: 'Lesson Analytics', desc: 'Post-class analysis of what worked, what didn\'t, and recommended content adjustments.' },
    ],
    architecture: [
      'Real-time behavioral signal processing',
      'Classroom sensor array integration',
      'Teacher mobile companion app',
      'Parent communication and reporting module',
    ],
    useCases: [
      'Daily classroom teaching and monitoring',
      'Remedial and intervention programs',
      'Teacher training and skill development',
      'School-wide academic performance tracking',
    ],
    metrics: [
      { stat: '40→1', label: 'Individual attention' },
      { stat: '3x', label: 'Faster gap detection' },
      { stat: '↑17%', label: 'Learning outcomes' },
    ],
  },
  SETU: {
    color: '#F59E0B',
    sector: 'Government',
    tagline: 'The integration layer India\'s government systems need. Connecting siloed databases and legacy systems.',
    vision: 'India has incredible digital infrastructure — Aadhaar, UPI, DigiLocker. But most departments run on disconnected systems built across different decades. SETU bridges them all, making "single window clearance" a reality by connecting legacy databases to modern APIs with citizen-controlled consent.',
    flow: [
      { title: 'Legacy Systems', desc: 'Connect to government databases from any era — COBOL mainframes to modern REST APIs.' },
      { title: 'Adapter Layer', desc: 'Custom protocol translators normalize data across incompatible system formats.' },
      { title: 'Consent Gateway', desc: 'Citizen-controlled data sharing with explicit consent management and audit trails.' },
      { title: 'Unified API', desc: 'Clean, documented APIs expose multi-department services through a single interface.' },
    ],
    capabilities: [
      { title: 'Legacy Bridge', desc: 'Protocol adapters for systems from any era. Connects databases built decades apart.' },
      { title: 'Consent-First', desc: 'Citizens control their data. Sharing requires explicit, revocable consent at every step.' },
      { title: 'Service Orchestration', desc: 'Multi-department workflows — parallel where possible, transparent and tracked throughout.' },
      { title: 'High Availability', desc: 'Multi-region deployment with automatic failover. Designed for continuous uptime.' },
    ],
    architecture: [
      'Protocol adapters for 40+ legacy data formats',
      'Consent ledger with cryptographic anchoring',
      '99.99% uptime architectural design',
      'Geographically redundant deployment',
    ],
    useCases: [
      'Inter-department workflow automation',
      'Certificate and document issuance',
      'Subsidy and benefit disbursement',
      'License and permit processing',
    ],
    metrics: [
      { stat: '6→1', label: 'Single window' },
      { stat: '10B+', label: 'Monthly transactions' },
      { stat: '100%', label: 'Audit trail' },
    ],
  },
  NAGRIK: {
    color: '#F59E0B',
    sector: 'Government',
    tagline: 'Government services that work like apps you actually use. Mobile-first, vernacular, accessible.',
    vision: 'Government portals are built for desktops and English speakers. NAGRIK is designed for one-handed use on crowded buses, low-end Android phones, and 2G connections. Complete voice navigation, 12 Indian languages, and WhatsApp integration — government services accessible to all 750 million smartphone users.',
    flow: [
      { title: 'Citizen Access', desc: 'Mobile-first interface in 12 languages. Voice navigation. Works on low-end Android devices.' },
      { title: 'Service Discovery', desc: 'AI-powered search understands citizen intent in plain language, not bureaucratic terminology.' },
      { title: 'Smart Processing', desc: 'Auto-fills forms from existing data. Guides citizens through procedures step by step.' },
      { title: 'Status & Resolution', desc: 'Real-time tracking. WhatsApp notifications. No follow-up office visits required.' },
    ],
    capabilities: [
      { title: 'True Mobile-First', desc: 'Designed for one-handed use on crowded transit. Optimized for low-end Android devices.' },
      { title: 'Voice Navigation', desc: 'Complete interface through voice. Navigate, fill forms, and check status hands-free.' },
      { title: 'Intelligent Assistance', desc: 'AI that understands government procedures and guides citizens through complex processes.' },
      { title: 'WhatsApp Integration', desc: 'Service updates, notifications, and basic interactions through the platform people already use.' },
    ],
    architecture: [
      'Progressive web app — works on any device',
      '2G-optimized data transfer protocols',
      'Aadhaar and DigiLocker integration',
      'WhatsApp Business API integration',
    ],
    useCases: [
      'Citizen service applications and renewals',
      'Document and certificate requests',
      'Complaint filing and resolution tracking',
      'Benefit enrollment and status checks',
    ],
    metrics: [
      { stat: '750M', label: 'Users addressable' },
      { stat: '12', label: 'Languages supported' },
      { stat: '0', label: 'Agents needed' },
    ],
  },
  YANTRA: {
    color: '#6366F1',
    sector: 'Robotics & Edge AI',
    tagline: 'Edge AI quality inspection for manufacturing floors. Detects defects invisible to the human eye.',
    vision: 'Manual quality inspection misses defects, slows production, and can\'t operate 24/7. YANTRA brings computer vision to the factory floor — running entirely on edge hardware purpose-built for industrial conditions. Dust, vibration, extreme heat — it handles them all while catching defects at 99.2% accuracy in under 50 milliseconds.',
    flow: [
      { title: 'Production Capture', desc: 'High-resolution cameras and sensors positioned at critical points across the manufacturing line.' },
      { title: 'Edge Inference', desc: 'On-device computer vision processes every frame in under 50ms. No cloud round-trip needed.' },
      { title: 'Defect Classification', desc: 'AI categorizes defects by type, severity, and correlates with root cause patterns.' },
      { title: 'Quality Decision', desc: 'Real-time pass/fail determination. Automated line alerts. Shift-level quality reporting.' },
    ],
    capabilities: [
      { title: 'Sub-Frame Inference', desc: 'Computer vision processes every frame in under 50ms on custom edge hardware.' },
      { title: 'Environmental Hardening', desc: 'Built for dust, vibration, extreme temperatures, and 24/7 continuous operation.' },
      { title: 'Defect Taxonomy', desc: 'AI classifies defects by type and correlates with root cause patterns over time.' },
      { title: 'Line Integration', desc: 'Plugs into existing manufacturing lines with minimal installation and zero downtime.' },
    ],
    architecture: [
      'Industrial-grade compute modules (IP67 rated)',
      'Sub-50ms inference pipeline',
      'Modular line integration — plug and inspect',
      'OPC-UA compatible for factory systems',
    ],
    useCases: [
      'Automotive component inspection',
      'Electronics assembly verification',
      'Textile quality control',
      'Pharmaceutical packaging inspection',
    ],
    metrics: [
      { stat: '99.2%', label: 'Defect detection' },
      { stat: '<50ms', label: 'Inference time' },
      { stat: '0', label: 'Cloud dependency' },
    ],
  },
  VAYUBOT: {
    color: '#6366F1',
    sector: 'Robotics & Edge AI',
    tagline: 'Autonomous aerial inspection drones for infrastructure monitoring.',
    vision: 'Inspecting bridges, powerlines, solar farms, and cell towers is dangerous, expensive, and infrequent. VAYUBOT changes this with autonomous drones that fly predefined routes, capture multi-spectral data, and run anomaly detection on-board — delivering inspection reports without risking human lives or shutting down operations.',
    flow: [
      { title: 'Mission Planning', desc: 'Define inspection routes, areas of interest, and specific anomaly detection parameters.' },
      { title: 'Autonomous Flight', desc: 'GPS-guided navigation with obstacle avoidance. Operates without a human pilot.' },
      { title: 'Continuous Capture', desc: 'Multi-spectral imaging — thermal, visual, and LiDAR data collected simultaneously.' },
      { title: 'Analysis & Report', desc: 'On-board AI processes imagery during flight. Anomalies flagged with location and severity.' },
    ],
    capabilities: [
      { title: 'Autonomous Navigation', desc: 'GPS-guided flight with obstacle avoidance. Operates independently after mission planning.' },
      { title: 'Multi-Spectral Sensing', desc: 'Thermal, visual, and LiDAR data captured simultaneously for comprehensive analysis.' },
      { title: 'Real-Time Detection', desc: 'On-board AI flags anomalies during flight — no post-processing wait time required.' },
      { title: 'Mission Templates', desc: 'Pre-built inspection protocols for bridges, powerlines, solar farms, and cell towers.' },
    ],
    architecture: [
      'Multi-spectral sensor array (thermal + visual + LiDAR)',
      'RTK GPS for centimeter-level positioning',
      'Onboard AI compute module for real-time analysis',
      'Automated flight reporting and anomaly mapping',
    ],
    useCases: [
      'Bridge structural integrity inspection',
      'Powerline and transmission tower monitoring',
      'Solar farm panel efficiency auditing',
      'Cell tower and antenna inspection',
    ],
    metrics: [
      { stat: '10x', label: 'Faster than manual' },
      { stat: '100%', label: 'Autonomous operation' },
      { stat: 'Real-time', label: 'Anomaly detection' },
    ],
  },
  KRISHI: {
    color: '#6366F1',
    sector: 'Robotics & Edge AI',
    tagline: 'Precision agriculture robotics. Crop monitoring, targeted spraying, and yield prediction.',
    vision: 'Indian agriculture needs to produce more with fewer resources and unpredictable climate. KRISHI brings precision agriculture to farms of any size — from 1-acre smallholdings to large commercial operations. Autonomous ground and aerial systems monitor crop health, apply inputs with centimeter-level accuracy, and predict yields based on real-time field data.',
    flow: [
      { title: 'Field Mapping', desc: 'Aerial and ground-level survey of the entire farm. Soil and crop baseline established.' },
      { title: 'Continuous Monitoring', desc: 'Autonomous sensors track crop health, soil moisture, pest indicators, and growth stage.' },
      { title: 'AI Recommendations', desc: 'Targeted spraying zones, irrigation schedules, and optimal harvest timing predictions.' },
      { title: 'Precision Action', desc: 'Ground robots and drones execute targeted actions with centimeter-level accuracy.' },
    ],
    capabilities: [
      { title: 'Farm-Size Agnostic', desc: 'Works on 1-acre smallholder farms and large commercial operations with the same technology.' },
      { title: 'Precision Application', desc: 'Centimeter-level accuracy for spraying, irrigation, and planting decisions.' },
      { title: 'Crop Intelligence', desc: 'AI models trained on Indian crop varieties, regional soil types, and local climate patterns.' },
      { title: 'Farmer Interface', desc: 'Simple, vernacular-first interface. Voice-driven interactions. Works on basic smartphones.' },
    ],
    architecture: [
      'Soil-crop-weather model fusion engine',
      'Variable rate technology for precision application',
      'Autonomous ground and aerial platform coordination',
      'Smallholder-optimized economics and deployment',
    ],
    useCases: [
      'Crop health monitoring and early disease detection',
      'Targeted pest management with minimal chemicals',
      'Irrigation optimization based on soil moisture data',
      'Yield forecasting for market planning',
    ],
    metrics: [
      { stat: '40%', label: 'Less pesticide usage' },
      { stat: '25%', label: 'Yield increase' },
      { stat: '1 acre', label: 'Minimum farm size' },
    ],
  },
}

// ============================================================
// PRODUCT DETAIL MODAL
// ============================================================
function ProductDetailModal({ productName, onClose }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const product = PRODUCT_DETAILS[productName]

  if (!product) return null

  const { color } = product

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useLayoutEffect(() => {
    if (!overlayRef.current || !contentRef.current) return
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    gsap.fromTo(contentRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power3.out' })
  }, [])

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: onClose })
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#0B1120]/92 backdrop-blur-md overflow-y-auto"
      onClick={handleClose}
    >
      <div className="min-h-screen py-16 px-6">
        <div
          ref={contentRef}
          className="max-w-5xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="fixed top-6 right-6 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-[#0B1120] transition-all z-[110]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* ── Header ── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color }}>{product.sector}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ color }}>{productName}</h2>
            <p className="text-xl text-white/50 max-w-3xl">{product.tagline}</p>
          </div>

          {/* ── Vision ── */}
          <div className="mb-14 p-6 md:p-8 rounded-2xl border-l-4 bg-white/[0.02]" style={{ borderColor: color }}>
            <div className="font-mono text-xs uppercase tracking-widest text-white/30 mb-3">The Vision</div>
            <p className="text-lg text-white/70 leading-relaxed max-w-4xl">{product.vision}</p>
          </div>

          {/* ── How It Works ── */}
          <div className="mb-14">
            <div className="font-mono text-xs uppercase tracking-widest mb-8" style={{ color }}>How It Works</div>
            <div className="relative">
              {/* Desktop connection line */}
              <div
                className="hidden md:block absolute top-10 left-[13%] right-[13%] h-px"
                style={{ background: `linear-gradient(to right, ${color}00, ${color}30, ${color}30, ${color}00)` }}
              />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-5">
                {product.flow.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="text-center p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                      <div
                        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-base font-black relative z-10"
                        style={{ backgroundColor: color + '15', color }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2">{step.title}</h4>
                      <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                    {/* Mobile connector */}
                    {i < product.flow.length - 1 && (
                      <div className="md:hidden flex justify-center py-1">
                        <svg className="w-3 h-5" viewBox="0 0 12 20" fill="none">
                          <path d="M6 0v16M2 12l4 4 4-4" stroke={color} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Capabilities ── */}
          <div className="mb-14">
            <div className="font-mono text-xs uppercase tracking-widest text-white/30 mb-6">Capabilities</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {product.capabilities.map((cap, i) => (
                <div key={i} className="p-5 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <h4 className="font-bold text-sm mb-2" style={{ color }}>{cap.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Architecture + Use Cases ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-mono text-xs uppercase tracking-widest text-white/30 mb-4">Architecture</div>
              <ul className="space-y-3">
                {product.architecture.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: color + '15' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    </div>
                    <span className="text-white/50 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-mono text-xs uppercase tracking-widest text-white/30 mb-4">Use Cases</div>
              <ul className="space-y-3">
                {product.useCases.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: color + '15' }}>
                      <span className="text-[10px] font-bold" style={{ color }}>{i + 1}</span>
                    </div>
                    <span className="text-white/50 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Key Metrics ── */}
          <div className="p-6 md:p-8 rounded-2xl border" style={{ backgroundColor: color + '08', borderColor: color + '25' }}>
            <div className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color }}>Key Metrics</div>
            <div className="grid grid-cols-3 gap-6">
              {product.metrics.map((item, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-black" style={{ color }}>{item.stat}</div>
                  <div className="text-white/40 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Try Demo CTA ── */}
          {(productName === 'antarYaan' || productName === 'PULSE') && (
            <div className="mt-10 text-center">
              <Link
                to={productName === 'antarYaan' ? '/antaryaan' : '/pulse'}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                  color: '#0B1120',
                  boxShadow: `0 0 30px ${color}40`,
                }}
                onClick={(e) => { e.stopPropagation(); onClose() }}
              >
                Try the Demo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TheYaanStudio() {
  const [activeSection, setActiveSection] = useState('hero')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const sections = [
    { id: 'hero', label: 'Home', color: '#F59E0B' },
    { id: 'edge', label: 'Our Edge', color: '#F59E0B' },
    { id: 'healthcare', label: 'Healthcare', color: '#EC4899' },
    { id: 'education', label: 'Education', color: '#10B981' },
    { id: 'government', label: 'Government', color: '#F59E0B' },
    { id: 'robotics', label: 'Robotics', color: '#6366F1' },
    { id: 'contact', label: 'Contact', color: '#F59E0B' },
  ]

  // Case studies data
  const caseStudies = {
    healthcare: {
      color: '#EC4899',
      label: 'Healthcare',
      headline: 'When Every Second Counts',
      challenge: 'India has 0.7 physicians per 1,000 people. Those doctors spend 40% of their time on paperwork instead of patients. Elderly care is fragmented across disconnected systems. Medical training is limited by geography and access.',
      approach: 'An integrated edge AI healthcare ecosystem where every device processes data locally. Hardware-level encryption ensures patient privacy at the silicon layer — a guarantee built into the architecture itself.',
      moat: {
        title: 'The Hardware Moat',
        description: 'Patient data encryption and privacy is built into the silicon. Our edge AI devices process everything on-device with hardware-level encryption. Data never leaves the hardware. DPDP-compliant by design, not by afterthought.',
        points: [
          'Silicon-level encryption — patient data is encrypted at the hardware layer, not software',
          'On-device AI processing — zero cloud dependency, works in rural clinics with no internet',
          'Tamper-resistant hardware modules — physical security against data extraction',
          'DPDP and HIPAA compliant by architecture, not policy patches',
        ]
      },
      interface: {
        title: 'The Interface Revolution',
        description: 'We\'re reimagining how doctors interact with technology. No more keyboards and mouse clicks during consultations.',
        points: [
          'In-ear AI assistants that whisper context, alerts, and drug interactions during consultations',
          'Wearable displays that surface patient history and vitals hands-free',
          'Ambient room intelligence that captures, transcribes, and analyzes every consultation',
          'High-tech assistant interfaces across multiple display types — wall-mounted, tablet, wearable',
          'Dynamic interface adaptation based on context — surgery vs. consultation vs. rounds',
        ]
      },
      products: [
        {
          name: 'SENTRA',
          description: 'Always-on edge AI monitoring for seniors, chronic illness patients, and neurodivergent individuals. Processes everything locally with sub-second alert latency.',
          metrics: ['<1s alert latency', '100% offline', '24/7 monitoring'],
        },
        {
          name: 'DRISHTI',
          description: 'The doctor\'s AI companion. In-ear guidance, ambient visual AI, voice-first interface. Like a brilliant colleague who never forgets a patient\'s history.',
          metrics: ['50% less paperwork', 'Zero keyboard touches', 'In-ear + ambient display'],
        },
        {
          name: 'PRAXIS',
          description: 'Medical education through immersive VR/AR. Walk through a 3D heart. Practice rare procedures. A student in Tier-2 India gets AIIMS-level training.',
          metrics: ['42% better accuracy', '38% faster training', 'Haptic feedback'],
        },
        {
          name: 'KAVACH',
          description: 'Hardware security module purpose-built for healthcare. Silicon-level patient data encryption with tamper-resistant design. The physical foundation of our privacy guarantee.',
          metrics: ['Hardware encryption', 'Tamper-resistant', 'Zero data leaks'],
        },
      ],
      impact: [
        { stat: '<1s', label: 'Alert latency across all devices' },
        { stat: '0', label: 'Patient data points sent to cloud' },
        { stat: '50%', label: 'Reduction in doctor documentation time' },
        { stat: '100%', label: 'Offline operation capability' },
      ],
    },
    education: {
      color: '#10B981',
      label: 'Education',
      headline: 'Solving Bloom\'s 2-Sigma Problem',
      challenge: 'In 1984, Benjamin Bloom proved that one-on-one tutoring makes average students perform 2 standard deviations better. India has a 56% learning poverty rate. One-on-one tutoring costs ₹50,000/month. Teachers manage 40+ students with zero real-time insight into who\'s following and who\'s lost.',
      approach: 'AI that genuinely adapts to each learner\'s pace and style, combined with tools that give teachers real-time perception of every student in their classroom. Personalized learning at scale, measured by outcomes.',
      products: [
        {
          name: 'antarYaan',
          description: 'The AI mentor that solves Bloom\'s 2-sigma problem. Personalized tutoring through a gamified universe of mastery. Each subject is a constellation, each topic a planet to explore.',
          metrics: ['2σ improvement goal', '1:1 tutor ratio', '12 languages'],
        },
        {
          name: 'PULSE',
          description: 'The teacher\'s sixth sense. Real-time comprehension mapping, emotional indicators, learning gap detection, and smart student grouping. Turns a class of 40 into 40 individuals.',
          metrics: ['40→1 feels individual', '3x faster detection', '↑17% outcomes'],
        },
      ],
      impact: [
        { stat: '2σ', label: 'The improvement we\'re targeting' },
        { stat: '56%', label: 'Learning poverty rate we\'re attacking' },
        { stat: '12', label: 'Indian languages supported' },
        { stat: '↑17%', label: 'Learning outcomes improvement' },
      ],
    },
    government: {
      color: '#F59E0B',
      label: 'Government',
      headline: 'Making Digital India Accessible',
      challenge: 'India has incredible digital infrastructure — Aadhaar, UPI, DigiLocker. But most departments still run on disconnected legacy systems. Citizens need 6 office visits for one clearance. 750 million smartphone users interact with desktop-first government portals built only for English speakers.',
      approach: 'Integration infrastructure that connects legacy government systems to modern APIs, combined with a mobile-first citizen interface that works in 12 languages, on low-end Android phones, over 2G networks. Single window clearance that actually works.',
      products: [
        {
          name: 'SETU',
          description: 'The integration layer India\'s government systems need. Bridges legacy databases from the 1990s to modern APIs. Consent-first data sharing. Multi-department orchestration. Never goes down.',
          metrics: ['6→1 windows', '10B+ monthly txns', '100% audit trail'],
        },
        {
          name: 'NAGRIK',
          description: 'Government services that work like apps you actually use. Mobile-first, vernacular-first. Designed for one-handed use on crowded buses. Voice navigation. WhatsApp integration.',
          metrics: ['750M users reached', '12 languages', '0 agents needed'],
        },
      ],
      impact: [
        { stat: '6→1', label: 'Office visits reduced to single window' },
        { stat: '750M', label: 'Smartphone users we\'re reaching' },
        { stat: '34%', label: 'Rural-urban digital gap we\'re closing' },
        { stat: '0', label: 'Middlemen or agents needed' },
      ],
    },
    robotics: {
      color: '#6366F1',
      label: 'Robotics & Edge AI',
      headline: 'Intelligence at the Edge',
      challenge: 'India\'s manufacturing sector inspects quality manually—missing defects that cost billions. Agricultural productivity must increase with fewer resources and unpredictable climate. Critical infrastructure—bridges, powerlines, solar farms—needs continuous monitoring that humans can\'t provide at scale.',
      approach: 'Edge-first AI systems that operate autonomously in harsh, real-world environments. Real-time decision making with on-device inference. Purpose-built for Indian industrial conditions — dust, heat, humidity, connectivity gaps. Intelligence at the point of action.',
      products: [
        {
          name: 'YANTRA',
          description: 'Edge AI quality inspection for manufacturing floors. Computer vision systems that detect defects invisible to the human eye, running entirely on-device. Built to handle dust, vibration, and 45°C factory conditions.',
          metrics: ['99.2% defect detection', '< 50ms inference', 'Zero cloud dependency'],
        },
        {
          name: 'VAYUBOT',
          description: 'Autonomous aerial inspection drones for infrastructure monitoring. Bridges, powerlines, solar farms, cell towers—inspected continuously without risking human lives or shutting down operations.',
          metrics: ['10x faster inspection', 'Autonomous flight', 'Real-time anomaly detection'],
        },
        {
          name: 'KRISHI',
          description: 'Precision agriculture robotics. Crop health monitoring, targeted spraying, yield prediction—all from autonomous ground and aerial systems that work on farms of any size.',
          metrics: ['40% less pesticide', '25% yield increase', 'Works on 1-acre farms'],
        },
      ],
      impact: [
        { stat: '99.2%', label: 'Defect detection accuracy' },
        { stat: '60%', label: 'Inspection cost reduction' },
        { stat: '24/7', label: 'Autonomous operation' },
        { stat: '0', label: 'Cloud dependency for edge inference' },
      ],
    },
  }

  // Track active section
  useEffect(() => {
    const observers = sections.map(section => {
      const el = document.getElementById(section.id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(section.id) },
        { threshold: 0.2 }
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <div className="bg-[#0B1120] text-white overflow-x-hidden">
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --horizon: #F59E0B;
          --nova-pink: #EC4899;
          --emerald: #10B981;
          --indigo: #6366F1;
          --deep-space: #0B1120;
        }

        * { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
        h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        html { scroll-behavior: smooth; }
        ::selection { background: var(--horizon); color: var(--deep-space); }

        @keyframes nebulaPulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.03; }
          50% { transform: scale(1.1) translate(20px, -20px); opacity: 0.05; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--deep-space); }
        ::-webkit-scrollbar-thumb { background: var(--horizon); border-radius: 3px; }
      `}</style>

      <StarField />
      <NebulaGlow />
      <NavigationDots sections={sections} activeSection={activeSection} />

      {/* ============================================================ */}
      {/* STICKY HEADER */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
              <span className="text-[#0B1120] font-black text-sm">Y</span>
            </div>
            <span className="font-bold text-white/90 text-lg">theYaan</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Our Edge', href: '#edge' },
              { label: 'Healthcare', href: '#healthcare' },
              { label: 'Education', href: '#education' },
              { label: 'Government', href: '#government' },
              { label: 'Robotics', href: '#robotics' },
            ].map(item => (
              <a key={item.href} href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
            <a href="#contact" className="text-sm px-5 py-2 bg-[#F59E0B] text-[#0B1120] font-semibold rounded-full hover:bg-white transition-colors">
              Get in Touch
            </a>
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <Section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="font-mono text-sm text-[#F59E0B] uppercase tracking-[0.3em] mb-8 opacity-80">
            theYaan Studio
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-8">
            <span className="text-white">Engineered to solve.</span>
            <br />
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#EC4899] bg-clip-text text-transparent">
              Designed to feel.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed">
            We apply behavioral psychology, neurolinguistic science, and intelligent
            design to build AI products that solve complex problems — through
            experiences that feel intuitive and extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#edge"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#F59E0B] text-[#0B1120] font-bold text-lg rounded-full hover:bg-white transition-colors"
            >
              Explore Our Work
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-semibold text-lg rounded-full hover:border-white/50 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* OUR EDGE - Why we're different */}
      {/* ============================================================ */}
      <Section id="edge" className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="font-mono text-sm text-[#F59E0B] uppercase tracking-[0.2em] mb-6">
              What We Bring
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-white">Trusted relationships.</span>
              <br />
              <span className="text-white/30">Real capability.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto">
              Industry veterans who trust us. Decades of domain expertise across the team.
              Full-stack infrastructure from silicon to interface. And a design philosophy
              rooted in how people actually think.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pillar 1 - Trusted Relationships */}
            <div className="group p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#F59E0B]/30 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Trusted Relationships</h3>
              <p className="text-white/50 leading-relaxed mb-4">
                Years of working alongside hospital administrators, education leaders,
                government officials, and industry veterans who shape their sectors.
                These relationships are built on trust and shared purpose — our products
                are shaped directly by the people who deploy them.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Hospital Networks', 'State Governments', 'Educational Institutes', 'Industry Veterans'].map(tag => (
                  <span key={tag} className="font-mono text-xs px-3 py-1 bg-[#F59E0B]/10 text-[#F59E0B]/70 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Pillar 2 - Domain Expertise */}
            <div className="group p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#EC4899]/30 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-[#EC4899]/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Domain Expertise</h3>
              <p className="text-white/50 leading-relaxed mb-4">
                Our team has worked inside the systems we build for — understanding
                procurement, regulation, stakeholder dynamics, and the operational
                realities that determine whether a product succeeds or fails in the field.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Healthcare Operations', 'Education Policy', 'Regulatory Landscape', 'Industrial Systems'].map(tag => (
                  <span key={tag} className="font-mono text-xs px-3 py-1 bg-[#EC4899]/10 text-[#EC4899]/70 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Pillar 3 - Full-Stack Infrastructure */}
            <div className="group p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#10B981]/30 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Full-Stack Infrastructure</h3>
              <p className="text-white/50 leading-relaxed mb-4">
                Custom edge hardware. On-device AI models. Deployment pipelines
                engineered for Indian infrastructure — from metro hospitals
                to rural clinics, factory floors to open fields.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Edge Hardware', 'On-Device AI', 'Custom Silicon', 'Rural-Ready'].map(tag => (
                  <span key={tag} className="font-mono text-xs px-3 py-1 bg-[#10B981]/10 text-[#10B981]/70 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Pillar 4 - Human-Centered Design */}
            <div className="group p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#6366F1]/30 transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Human-Centered Design</h3>
              <p className="text-white/50 leading-relaxed mb-4">
                Every interface is grounded in behavioral psychology and neurolinguistic
                science. We design products around how people actually think, decide,
                and act — so complex technology feels intuitive and effortless.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Behavioral Psychology', 'Neurolinguistic Design', 'Cognitive UX', 'Interaction Science'].map(tag => (
                  <span key={tag} className="font-mono text-xs px-3 py-1 bg-[#6366F1]/10 text-[#6366F1]/70 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Process strip */}
          <div className="mt-16 p-8 bg-white/[0.02] border border-white/10 rounded-2xl">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-6 text-center">How We Work</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Understand', desc: 'Deep immersion with industry partners. Map the real constraints.' },
                { step: '02', title: 'Design', desc: 'Apply behavioral science to architect the experience.' },
                { step: '03', title: 'Build', desc: 'Full-stack: custom hardware, AI models, intelligent interfaces.' },
                { step: '04', title: 'Deploy', desc: 'On-ground deployment. Measure outcomes. Iterate.' },
              ].map((item) => (
                <div key={item.step} className="text-center md:text-left">
                  <div className="font-mono text-[#F59E0B] text-sm mb-2">{item.step}</div>
                  <div className="text-white font-bold text-lg mb-1">{item.title}</div>
                  <div className="text-white/40 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* HEALTHCARE CASE STUDY */}
      {/* ============================================================ */}
      <Section id="healthcare" className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#EC4899]" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#EC4899]">
              {caseStudies.healthcare.label}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-[#EC4899]">{caseStudies.healthcare.headline}</span>
          </h2>

          {/* Challenge */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">The Challenge</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.healthcare.challenge}
            </p>
          </div>

          {/* Approach */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Our Approach</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.healthcare.approach}
            </p>
          </div>

          {/* Hardware Moat - THE KEY SECTION */}
          <div className="mb-16 p-8 md:p-12 rounded-2xl border-2 border-[#EC4899]/30 bg-[#EC4899]/[0.04]">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <h3 className="text-2xl md:text-3xl font-black text-[#EC4899]">
                {caseStudies.healthcare.moat.title}
              </h3>
            </div>
            <p className="text-lg text-white/60 mb-8 max-w-3xl">
              {caseStudies.healthcare.moat.description}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudies.healthcare.moat.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-[#EC4899]/[0.06] rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-[#EC4899]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interface Revolution */}
          <div className="mb-16 p-8 md:p-12 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                {caseStudies.healthcare.interface.title}
              </h3>
            </div>
            <p className="text-lg text-white/50 mb-8 max-w-3xl">
              {caseStudies.healthcare.interface.description}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseStudies.healthcare.interface.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-[#EC4899]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#EC4899] text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-8">Products Built</div>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.healthcare.products.map((product) => (
                <div key={product.name} className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#EC4899]/30 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedProduct(product.name)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EC4899]/10 flex items-center justify-center">
                      <span className="text-[#EC4899] font-black text-sm">{product.name.charAt(0)}</span>
                    </div>
                    <h4 className="text-xl font-black text-white group-hover:text-[#EC4899] transition-colors">{product.name}</h4>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.metrics.map((m, i) => (
                      <span key={i} className="font-mono text-xs px-3 py-1.5 bg-[#EC4899]/10 text-[#EC4899]/80 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="p-8 md:p-12 bg-[#EC4899]/[0.04] border border-[#EC4899]/20 rounded-2xl">
            <div className="font-mono text-xs text-[#EC4899] uppercase tracking-widest mb-8">Measured Impact</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudies.healthcare.impact.map((item, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-[#EC4899]">{item.stat}</div>
                  <div className="text-white/40 text-sm mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* EDUCATION CASE STUDY */}
      {/* ============================================================ */}
      <Section id="education" className="px-6 py-32 bg-[#0F172A]/50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#10B981]">
              {caseStudies.education.label}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-[#10B981]">{caseStudies.education.headline}</span>
          </h2>

          {/* Challenge */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">The Challenge</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.education.challenge}
            </p>
          </div>

          {/* Approach */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Our Approach</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.education.approach}
            </p>
          </div>

          {/* Products */}
          <div className="mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-8">Products Built</div>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.education.products.map((product) => (
                <div key={product.name} className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#10B981]/30 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedProduct(product.name)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                      <span className="text-[#10B981] font-black text-sm">{product.name.charAt(0)}</span>
                    </div>
                    <h4 className="text-xl font-black text-white group-hover:text-[#10B981] transition-colors">{product.name}</h4>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.metrics.map((m, i) => (
                      <span key={i} className="font-mono text-xs px-3 py-1.5 bg-[#10B981]/10 text-[#10B981]/80 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={product.name === 'antarYaan' ? '/antaryaan' : '/pulse'}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/25 transition-colors"
                  >
                    Try Demo
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="p-8 md:p-12 bg-[#10B981]/[0.04] border border-[#10B981]/20 rounded-2xl">
            <div className="font-mono text-xs text-[#10B981] uppercase tracking-widest mb-8">Measured Impact</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudies.education.impact.map((item, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-[#10B981]">{item.stat}</div>
                  <div className="text-white/40 text-sm mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* GOVERNMENT CASE STUDY */}
      {/* ============================================================ */}
      <Section id="government" className="px-6 py-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#F59E0B]">
              {caseStudies.government.label}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-[#F59E0B]">{caseStudies.government.headline}</span>
          </h2>

          {/* Challenge */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">The Challenge</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.government.challenge}
            </p>
          </div>

          {/* Approach */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Our Approach</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.government.approach}
            </p>
          </div>

          {/* Products */}
          <div className="mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-8">Products Built</div>
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.government.products.map((product) => (
                <div key={product.name} className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#F59E0B]/30 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedProduct(product.name)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                      <span className="text-[#F59E0B] font-black text-sm">{product.name.charAt(0)}</span>
                    </div>
                    <h4 className="text-xl font-black text-white group-hover:text-[#F59E0B] transition-colors">{product.name}</h4>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.metrics.map((m, i) => (
                      <span key={i} className="font-mono text-xs px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B]/80 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="p-8 md:p-12 bg-[#F59E0B]/[0.04] border border-[#F59E0B]/20 rounded-2xl">
            <div className="font-mono text-xs text-[#F59E0B] uppercase tracking-widest mb-8">Measured Impact</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudies.government.impact.map((item, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-[#F59E0B]">{item.stat}</div>
                  <div className="text-white/40 text-sm mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* ROBOTICS & EDGE AI CASE STUDY */}
      {/* ============================================================ */}
      <Section id="robotics" className="px-6 py-32 bg-[#0F172A]/50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#6366F1]" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#6366F1]">
              {caseStudies.robotics.label}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            <span className="text-[#6366F1]">{caseStudies.robotics.headline}</span>
          </h2>

          {/* Challenge */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">The Challenge</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.robotics.challenge}
            </p>
          </div>

          {/* Approach */}
          <div className="max-w-4xl mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-4">Our Approach</div>
            <p className="text-xl text-white/60 leading-relaxed">
              {caseStudies.robotics.approach}
            </p>
          </div>

          {/* Products */}
          <div className="mb-16">
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest mb-8">Products Built</div>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.robotics.products.map((product) => (
                <div key={product.name} className="p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-[#6366F1]/30 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedProduct(product.name)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
                      <span className="text-[#6366F1] font-black text-sm">{product.name.charAt(0)}</span>
                    </div>
                    <h4 className="text-xl font-black text-white group-hover:text-[#6366F1] transition-colors">{product.name}</h4>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.metrics.map((m, i) => (
                      <span key={i} className="font-mono text-xs px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1]/80 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="p-8 md:p-12 bg-[#6366F1]/[0.04] border border-[#6366F1]/20 rounded-2xl">
            <div className="font-mono text-xs text-[#6366F1] uppercase tracking-widest mb-8">Measured Impact</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudies.robotics.impact.map((item, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black text-[#6366F1]">{item.stat}</div>
                  <div className="text-white/40 text-sm mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* ALL PRODUCTS OVERVIEW - Clean grid */}
      {/* ============================================================ */}
      <Section id="products-overview" className="px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono text-sm text-[#F59E0B] uppercase tracking-[0.2em] mb-6">
              Full Product Suite
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-white">11 products</span>{' '}
              <span className="text-white/30">across 4 industries.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { name: 'SENTRA', sector: 'Healthcare', color: '#EC4899', desc: 'Edge AI patient monitoring' },
              { name: 'DRISHTI', sector: 'Healthcare', color: '#EC4899', desc: 'Doctor\'s AI companion' },
              { name: 'PRAXIS', sector: 'Healthcare', color: '#EC4899', desc: 'VR/AR medical training' },
              { name: 'KAVACH', sector: 'Healthcare', color: '#EC4899', desc: 'Hardware security module' },
              { name: 'antarYaan', sector: 'Education', color: '#10B981', desc: 'AI-powered personalized tutor' },
              { name: 'PULSE', sector: 'Education', color: '#10B981', desc: 'Teacher insight dashboard' },
              { name: 'SETU', sector: 'Government', color: '#F59E0B', desc: 'System integration layer' },
              { name: 'NAGRIK', sector: 'Government', color: '#F59E0B', desc: 'Mobile citizen platform' },
              { name: 'YANTRA', sector: 'Robotics', color: '#6366F1', desc: 'Factory quality inspection' },
              { name: 'VAYUBOT', sector: 'Robotics', color: '#6366F1', desc: 'Aerial inspection drones' },
              { name: 'KRISHI', sector: 'Robotics', color: '#6366F1', desc: 'Precision agriculture' },
            ].map((product) => (
              <div
                key={product.name}
                className="p-5 bg-white/[0.02] border border-white/8 rounded-xl hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedProduct(product.name)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.color }} />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                    {product.sector}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white group-hover:text-[var(--c)] transition-colors mb-1" style={{ '--c': product.color }}>
                  {product.name}
                </h4>
                <p className="text-white/40 text-sm">{product.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* CONTACT */}
      {/* ============================================================ */}
      <Section id="contact" className="px-6 py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F59E0B]/5 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="font-mono text-sm text-[#F59E0B] uppercase tracking-[0.2em] mb-6">
              Let's Build Together
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-white">Let's build</span>
              <br />
              <span className="text-[#F59E0B]">something that matters.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12">
              Whether you're an institution looking for the right technology partner,
              an investor, or a builder who wants to work on meaningful problems.
            </p>
          </div>

          <div className="text-center mb-16">
            <a
              href="mailto:hello@theyaan.studio"
              className="text-3xl md:text-5xl font-mono text-white/60 hover:text-[#F59E0B] transition-colors"
            >
              hello@theyaan.studio
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'For Institutions',
                desc: 'Healthcare, education, government, manufacturing—let\'s see if our products solve your problems. We come with the tech and the team.',
                color: '#EC4899',
              },
              {
                title: 'For Investors',
                desc: 'Products with validated institutional demand across four sectors. Full-stack capability from hardware to interface. Long-term plays with real impact.',
                color: '#F59E0B',
              },
              {
                title: 'Join the Team',
                desc: 'Hiring engineers, designers, domain experts, and roboticists. Work on products that matter in industries that need it. Interesting problems guaranteed.',
                color: '#6366F1',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 border border-white/10 rounded-xl hover:border-white/20 transition-colors group">
                <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: item.color }} />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--c)] transition-colors" style={{ '--c': item.color }}>
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#F59E0B] flex items-center justify-center">
              <span className="text-[#0B1120] font-black text-xs">Y</span>
            </div>
            <span className="text-white/40 font-mono text-sm">theYaan Studio</span>
          </div>

          <div className="flex items-center gap-8 font-mono text-xs text-white/30 uppercase tracking-widest">
            <span>&copy; {new Date().getFullYear()}</span>
            <Link to="/privacy" className="hover:text-[#F59E0B] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#F59E0B] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          productName={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
