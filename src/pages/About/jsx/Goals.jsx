import React from 'react'
import '../css/Goals.css'
import Silk from '../../../components/bits/jsx/Silk';
import Dither from '../../../components/bits/jsx/Dither'
import ElectricBorder from '../../../components/bits/jsx/ElectricBorder'
import FaultyTerminal from '../../../components/bits/jsx/FaultyTerminal'
import Header from '../../../components/landing/jsx/Header'
import CTA from '../../../components/landing/jsx/CTAbtns'
import { FaBullseye, FaEye, FaAward, FaRocket, FaChartLine, FaUsers } from 'react-icons/fa'

export default function Goals() {
  const mainGoals = [
    {
      icon: <FaBullseye />,
      title: 'Our Mission',
      description: 'To deliver innovative digital solutions that empower businesses to achieve their goals through cutting-edge technology and creative strategies.',
      features: [
        'Develop custom digital solutions tailored to client needs',
        'Implement latest technologies and best practices',
        'Provide ongoing support and maintenance',
        'Ensure client satisfaction and success'
      ]
    },
    {
      icon: <FaEye />,
      title: 'Our Vision',
      description: 'To be the preferred digital partner for ambitious companies in the region, transforming ideas into tangible success through exceptional technological solutions.',
      features: [
        'Become the leading digital agency in the Middle East',
        'Pioneer innovative solutions in the digital space',
        'Build long-term partnerships with our clients',
        'Contribute to digital transformation in the region'
      ]
    },
    {
      icon: <FaAward />,
      title: 'Our Goal',
      description: 'To consistently exceed client expectations by delivering projects on time, within budget, and with unmatched quality and support.',
      features: [
        'Maintain 99% client satisfaction rate',
        'Deliver projects 15% faster than industry average',
        'Achieve 40% year-over-year growth',
        'Expand services to 3 new countries by 2025'
      ]
    }
  ];

  const objectives = [
    {
      icon: <FaRocket />,
      title: 'Innovation & Technology',
      items: [
        'Research and develop new technologies',
        'Stay ahead of industry trends',
        'Implement AI and machine learning solutions',
        'Create scalable and future-proof systems'
      ]
    },
    {
      icon: <FaChartLine />,
      title: 'Business Growth',
      items: [
        'Help clients increase revenue by 30%',
        'Reduce operational costs by 25%',
        'Improve customer engagement metrics',
        'Expand market reach and presence'
      ]
    },
    {
      icon: <FaUsers />,
      title: 'Client Success',
      items: [
        'Provide 24/7 dedicated support',
        'Offer comprehensive training programs',
        'Ensure seamless project delivery',
        'Build trust and long-term relationships'
      ]
    }
  ];

  return (
    <>
      <Header />
      <CTA />
    <div className='service-page web-design-page'>
      {/* Hero Section */}
      <div className='service-hero-WebDesign'>
        <div className='service-hero-content-WebDesign'>
          <div className='service-hero-background'>
              <Dither
                waveColor={[0.5, 0.5, 0.5]}
                disableAnimation={false}
                enableMouseInteraction={true}
                mouseRadius={0.3}
                colorNum={4}
                waveAmplitude={0.3}
                waveFrequency={3}
                waveSpeed={0.05}
              />

          </div>
          <h1 className='goals-title-page'>Our Goals & Vision</h1>
          <p className='goals-subtitle'>
            Driving digital transformation through clear objectives, innovative solutions, 
            and unwavering commitment to excellence.
          </p>
          <div className='service-cta-WebDesign'>

              <button 
                className='cta-button-WebDesign'
                onClick={() => window.open("https://wa.me/201158954215", "_blank")}
              >
                <ElectricBorder
                  color="#6333ff"
                  speed={1}
                  chaos={0.5}
                  thickness={2}
                  style={{ borderRadius: 999 }}
                >
                  <div className='cta-button-text'>
                    Request a Price
                  </div>

                  </ElectricBorder>
              </button>

          </div>
        </div>

      </div>

      {/* Main Goals Section */}
      <section className='main-goals-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Our Core Purpose</h2>
            <p>The foundation of everything we do and strive to achieve</p>
          </div>
          <div className='main-goals-grid'>
            {mainGoals.map((goal, index) => (
              <div key={index} className='main-goal-card'>
                <div className='goal-header'>
                  <div className='goal-icon'>{goal.icon}</div>
                  <h3>{goal.title}</h3>
                </div>
                <p className='goal-description'>{goal.description}</p>
                <ul className='goal-features'>
                  {goal.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className='objectives-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Strategic Objectives</h2>
            <p>Key focus areas that drive our success and growth</p>
          </div>
          <div className='objectives-grid'>
            {objectives.map((objective, index) => (
              <div key={index} className='objective-card'>
                <div className='objective-icon'>{objective.icon}</div>
                <h3>{objective.title}</h3>
                <ul className='objective-items'>
                  {objective.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className='timeline-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Our Journey</h2>
            <p>Milestones we've achieved and future targets</p>
          </div>
          <div className='timeline'>
            <div className='timeline-item'>
              <div className='timeline-year'>2020</div>
              <div className='timeline-content'>
                <h4>Company Foundation</h4>
                <p>Started with a vision to revolutionize digital services in the region</p>
              </div>
            </div>
            <div className='timeline-item'>
              <div className='timeline-year'>2022</div>
              <div className='timeline-content'>
                <h4>Expansion & Growth</h4>
                <p>Expanded our team and services to cover multiple digital domains</p>
              </div>
            </div>
            <div className='timeline-item'>
              <div className='timeline-year'>2024</div>
              <div className='timeline-content'>
                <h4>Market Leadership</h4>
                <p>Became one of the top digital solution providers in the market</p>
              </div>
            </div>
            <div className='timeline-item'>
              <div className='timeline-year'>2025</div>
              <div className='timeline-content'>
                <h4>Global Reach</h4>
                <p>Planning to expand our services to international markets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='goals-cta'>
        <div className='container'>
          <div className='cta-content'>
            <h2>Share Our Vision?</h2>
            <p>Join us in shaping the future of digital solutions</p>
            <button 
              className='cta-button'
              onClick={() => window.open("https://wa.me/201158954215", "_blank")}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}