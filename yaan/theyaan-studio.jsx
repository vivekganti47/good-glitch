import React, { useState, useEffect, useRef } from 'react';

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Floating particles background
const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 20}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}50px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Product card component
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColors = {
    'In Development': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'MVP in development': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Hardware prototyping': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Concept validation': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Proposal stage': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Concept stage': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      {/* Glow effect */}
      <div 
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${product.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}
      />
      
      {/* Card */}
      <div className="relative h-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl`}>
            {product.icon}
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[product.status]}`}>
            {product.status}
          </span>
        </div>

        {/* Sector tag */}
        <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
          {product.sector}
        </span>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mt-2 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          {product.tagline}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {product.features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${product.gradient} flex-shrink-0`} />
              {feature}
            </li>
          ))}
        </ul>

        {/* Learn more */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className={`flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            <span>Learn more</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ stroke: 'url(#gradient)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation component
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold text-white">
              the<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Yaan</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-slate-400 hover:text-white transition-colors text-sm">Products</a>
            <a href="#studio" className="text-slate-400 hover:text-white transition-colors text-sm">Studio Model</a>
            <a href="#why" className="text-slate-400 hover:text-white transition-colors text-sm">Why Us</a>
            <a href="#contact" className="px-5 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
              Partner With Us
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
            <div className="flex flex-col gap-4">
              <a href="#products" className="text-slate-400 hover:text-white transition-colors">Products</a>
              <a href="#studio" className="text-slate-400 hover:text-white transition-colors">Studio Model</a>
              <a href="#why" className="text-slate-400 hover:text-white transition-colors">Why Us</a>
              <a href="#contact" className="px-5 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-medium text-center">
                Partner With Us
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Main component
export default function TheYaanStudio() {
  const products = [
    {
      name: 'SENTRA',
      sector: 'Healthcare',
      tagline: 'Real-time AI-powered monitoring for senior and chronic care patients.',
      icon: '🫀',
      gradient: 'from-rose-500 to-orange-500',
      status: 'In Development',
      features: [
        'Edge hardware with continuous health tracking',
        'Low-latency alerts for critical events',
        'Privacy-first edge computing architecture',
        'Cloud dashboard for caregivers & professionals',
      ],
    },
    {
      name: 'AXIOM',
      sector: 'Healthcare',
      tagline: 'Voice-first clinical companion with custom medical-grade hardware.',
      icon: '🎧',
      gradient: 'from-purple-500 to-pink-500',
      status: 'Hardware prototyping',
      features: [
        'Medical-grade audio processing hardware',
        'On-device processing for HIPAA/DPDP compliance',
        '12+ hour battery for full shift coverage',
        'Hospital acoustic noise cancellation',
      ],
    },
    {
      name: 'PRAXIS',
      sector: 'Healthcare',
      tagline: 'Immersive AR/VR training platform for medical professionals.',
      icon: '🥽',
      gradient: 'from-blue-500 to-cyan-500',
      status: 'In Development',
      features: [
        'Surgical procedure simulation',
        'Rare case exposure without patient risk',
        'Performance analytics & skill progression',
        'Collaborative training environments',
      ],
    },
    {
      name: 'theYaan Learning',
      sector: 'Education',
      tagline: 'AI companion that makes ₹50,000/month tutoring accessible to every smartphone.',
      icon: '🚀',
      gradient: 'from-cyan-500 to-emerald-500',
      status: 'MVP in development',
      features: [
        'Adaptive learning for K-12 students',
        'CBSE-aligned with JEE/NEET pathway',
        'Space exploration metaphor: subjects as galaxies',
        'Personalized AI companion for each student',
      ],
    },
    {
      name: 'GUIDE',
      sector: 'Education',
      tagline: 'Teacher assistant that handles admin so teachers can teach.',
      icon: '📚',
      gradient: 'from-emerald-500 to-teal-500',
      status: 'Concept validation',
      features: [
        'Automated attendance & grading assistance',
        'Student progress tracking & early alerts',
        'Lesson planning support',
        'Report generation in minutes, not hours',
      ],
    },
    {
      name: 'DISHA',
      sector: 'Government',
      tagline: 'Department intelligence system trained on actual procedures, not generic FAQs.',
      icon: '🏛️',
      gradient: 'from-amber-500 to-orange-500',
      status: 'Proposal stage',
      features: [
        'Integrated AI chatbot for departments',
        'Local language support',
        'Intelligent escalation to humans',
        'Analytics dashboard for department heads',
      ],
    },
    {
      name: 'SEVA',
      sector: 'Government',
      tagline: 'Citizens shouldn\'t need agents to access their own government.',
      icon: '🤝',
      gradient: 'from-indigo-500 to-purple-500',
      status: 'Concept stage',
      features: [
        'Plain-language procedure explanations',
        'Document checklist generation',
        'Step-by-step guided applications',
        'Cross-department status tracking',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .gradient-text {
          background-size: 200% auto;
          animation: gradient-shift 8s ease infinite;
        }
        
        .glow-line {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Navigation />
      <ParticleField />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-8"
            style={{ animation: 'fadeInUp 0.6s ease-out' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-slate-400">AI Startup Studio • India</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
          >
            <span className="text-white">We build AI</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent gradient-text">
              that ships in India
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
          >
            The studio behind India's next-generation institutional AI. 
            We build products for Healthcare, Education, and Government—
            <span className="text-white"> from zero to production. Repeatedly.</span>
          </p>

          {/* Stats */}
          <div 
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={7} />
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={3} />
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                ₹<AnimatedCounter end={500} />Cr+
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Market Potential</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
          >
            <a 
              href="#products"
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 hover:scale-105"
            >
              Explore Our Products
            </a>
            <a 
              href="#contact"
              className="px-8 py-4 border border-slate-700 rounded-xl font-semibold hover:border-slate-500 hover:bg-slate-900/50 transition-all duration-300"
            >
              Partner With Us
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-slate-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Studio Model Section */}
      <section id="studio" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
                The Studio Model
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Not consultants.
                <br />
                <span className="text-slate-500">Builders.</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                We identify massive problems in underserved institutional sectors and build full products—
                not MVPs for others, but our own ventures. We either spin them out, partner with institutions, 
                or scale independently.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: '🎯', title: 'Problem Identification', desc: 'We find gaps where AI can create 10x improvements, not incremental features' },
                  { icon: '🏗️', title: 'Full Product Build', desc: 'Hardware + software where it makes sense. No half-measures.' },
                  { icon: '🇮🇳', title: 'India-First Design', desc: 'Built for Indian context from day one, not localization as an afterthought' },
                  { icon: '⚖️', title: 'Regulatory Expertise', desc: 'We know why AI projects die in Indian institutions. We\'ve been in those rooms.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🏭</div>
                  <h3 className="text-xl font-semibold text-white">Studio Infrastructure</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Shared AI/ML Platform',
                    'Compliance Frameworks',
                    'Deployment Pipelines',
                    'Domain Expertise',
                    'Regulatory Navigation',
                    'Patient Capital',
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-3 text-center text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative py-32 px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              Product Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What We're Building
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Each product addresses a massive gap in Indian institutional infrastructure. 
              Different stages, same ambition: category-defining solutions.
            </p>
          </div>

          {/* Sector filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['All', 'Healthcare', 'Education', 'Government'].map((sector) => (
              <button
                key={sector}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  sector === 'All'
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.name} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section id="why" className="relative py-32 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
                Why We Exist
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                AI projects in Indian institutions have a{' '}
                <span className="text-rose-400">70%+ failure rate</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                It's not the technology—it's the terrain. Procurement politics, regulatory uncertainty, 
                stakeholder misalignment. We've been in those rooms. We know why projects die.
              </p>
              <p className="text-xl text-white font-medium mt-6">
                So we stopped consulting and started building.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: '70%+', label: 'AI project failure rate', color: 'from-rose-500 to-orange-500' },
                { stat: '2-3yr', label: 'Typical procurement cycle', color: 'from-amber-500 to-yellow-500' },
                { stat: '56%', label: 'Learning poverty rate', color: 'from-purple-500 to-pink-500' },
                { stat: '∞', label: 'Problems worth solving', color: 'from-cyan-500 to-blue-500' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors">
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                    {item.stat}
                  </div>
                  <div className="text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Studio Advantage Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              The Studio Advantage
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Makes This Work
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔧',
                title: 'Shared Infrastructure',
                desc: 'AI/ML platform, compliance frameworks, and deployment pipelines shared across all products. Build once, deploy everywhere.',
                gradient: 'from-cyan-500 to-blue-500',
              },
              {
                icon: '🧭',
                title: 'Regulatory Navigation',
                desc: 'It\'s not a side skill—it\'s a core competency. We understand DPDP, healthcare regulations, and government procurement.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: '⏳',
                title: 'Patient Capital',
                desc: 'We build for the long term. These sectors don\'t transform overnight, and we\'re not chasing quick exits.',
                gradient: 'from-emerald-500 to-teal-500',
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full hover:border-slate-700 transition-colors">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-32 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            The Team
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built by practitioners
          </h2>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            We're not observers theorizing about these sectors. We've shipped in healthcare systems, 
            navigated government digitization, and built EdTech that actually works.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['Healthcare Systems', 'Government Digitization', 'EdTech', 'AI/ML Engineering', 'Regulatory Affairs'].map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
              Let's Talk
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Partner With Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏥',
                title: 'For Institutions',
                desc: 'Let\'s explore if our products solve your problems. Healthcare systems, educational institutions, government departments.',
                cta: 'Get in Touch',
                gradient: 'from-cyan-500 to-blue-500',
              },
              {
                icon: '💰',
                title: 'For Investors',
                desc: 'We\'re building category-defining products in underserved sectors. Patient capital for long-term impact.',
                cta: 'View Portfolio',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: '🛠️',
                title: 'For Talent',
                desc: 'We\'re hiring builders who want to work on hard problems. Engineers, designers, domain experts.',
                cta: 'View Openings',
                gradient: 'from-emerald-500 to-teal-500',
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 h-full hover:border-slate-700 transition-colors flex flex-col">
                  <span className="text-4xl mb-6">{item.icon}</span>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6 flex-grow">{item.desc}</p>
                  <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white font-semibold hover:opacity-90 transition-opacity`}>
                    {item.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="text-center mt-16">
            <p className="text-slate-500 mb-2">Or reach out directly</p>
            <a href="mailto:hello@theyaan.studio" className="text-xl text-white hover:text-cyan-400 transition-colors">
              hello@theyaan.studio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-slate-400">
              the<span className="text-white">Yaan</span> Studio
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>© 2025 theYaan Studio</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
