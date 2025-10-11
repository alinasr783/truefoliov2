import React from 'react'
import '../css/About.css'
import { FaRocket, FaGem, FaHandshake, FaChartLine, FaEye, FaAward, FaBullseye } from 'react-icons/fa'

export default function About() {
  const stats = [
    { number: '150+', label: 'Projects Completed' },
    { number: '50+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '24/7', label: 'Support' }
  ];

  const values = [
    {
      icon: <FaRocket />,
      title: 'Innovation',
      description: 'We constantly explore the latest technologies and innovative solutions to stay ahead in the digital landscape.'
    },
    {
      icon: <FaGem />,
      title: 'Quality',
      description: 'We commit to the highest quality standards in every project, ensuring excellence in delivery and performance.'
    },
    {
      icon: <FaHandshake />,
      title: 'Transparency',
      description: 'We maintain clear and honest relationships with our clients, keeping them informed at every stage.'
    },
    {
      icon: <FaChartLine />,
      title: 'Growth',
      description: 'We focus on helping our clients achieve sustainable growth and long-term success in their markets.'
    }
  ];

  const goals = [
    {
      icon: <FaBullseye />,
      title: 'Our Mission',
      description: 'To deliver innovative digital solutions that empower businesses to achieve their goals through cutting-edge technology and creative strategies.'
    },
    {
      icon: <FaEye />,
      title: 'Our Vision',
      description: 'To be the preferred digital partner for ambitious companies in the region, transforming ideas into tangible success through exceptional technological solutions.'
    },
    {
      icon: <FaAward />,
      title: 'Our Goal',
      description: 'To consistently exceed client expectations by delivering projects on time, within budget, and with unmatched quality and support.'
    }
  ];

  return (
    <div className='about-page'>
      {/* Hero Section */}
      <section className='about-hero'>
        <div className='about-hero-content'>
          <h1 className='about-title'>About Us</h1>
          <p className='about-subtitle'>
            A leading digital solutions company providing comprehensive services that help our clients 
            grow and excel in the digital world through innovation and expertise.
          </p>
          <div className='hero-stats'>
            {stats.map((stat, index) => (
              <div key={index} className='stat-item'>
                <div className='stat-number'>{stat.number}</div>
                <div className='stat-label'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section - Mission, Vision, Goal */}
      <section className='goals-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Our Purpose</h2>
            <p>What drives us forward and defines our path to success</p>
          </div>
          <div className='goals-grid'>
            {goals.map((goal, index) => (
              <div key={index} className='goal-card'>
                <div className='goal-icon'>{goal.icon}</div>
                <h3>{goal.title}</h3>
                <p>{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='values-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Our Values</h2>
            <p>The principles that guide our work and relationships</p>
          </div>
          <div className='values-grid'>
            {values.map((value, index) => (
              <div key={index} className='value-card'>
                <div className='value-icon'>{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className='features-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Why Choose Us</h2>
            <p>What makes us the right partner for your digital journey</p>
          </div>
          <div className='features-grid'>
            <div className='feature-item'>
              <div className='feature-number'>01</div>
              <h3>Expert Team</h3>
              <p>Our team consists of experienced professionals who are passionate about technology and innovation.</p>
            </div>
            <div className='feature-item'>
              <div className='feature-number'>02</div>
              <h3>Custom Solutions</h3>
              <p>We tailor our services to meet your specific business needs and objectives.</p>
            </div>
            <div className='feature-item'>
              <div className='feature-number'>03</div>
              <h3>Proven Results</h3>
              <p>We have a track record of delivering successful projects that drive real business value.</p>
            </div>
            <div className='feature-item'>
              <div className='feature-number'>04</div>
              <h3>Ongoing Support</h3>
              <p>We provide continuous support and maintenance to ensure your long-term success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className='about-cta'>
        <div className='container'>
          <div className='cta-content'>
            <h2>Ready to Start Your Next Project?</h2>
            <p>Let's discuss how we can help you achieve your digital goals</p>
            <button 
              className='cta-button'
              onClick={() => window.open("https://wa.me/201158954215", "_blank")}
            >
              Contact Us Now
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}