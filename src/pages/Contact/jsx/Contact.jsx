import React from 'react'
import '../css/Contact.css'
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaClock } from 'react-icons/fa'
import Dither from '../../../components/bits/jsx/Dither'
import ElectricBorder from '../../../components/bits/jsx/ElectricBorder'
export default function Contact() {
  const contactMethods = [
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      info: '+201158954215',
      action: () => window.open("https://wa.me/201158954215", "_blank"),
      buttonText: 'Start Chat',
      color: '#25D366'
    },
    {
      icon: <FaPhone />,
      title: 'Phone Call',
      description: 'Speak directly with our team',
      info: '+201158954215',
      action: () => window.open("tel:+201158954215", "_blank"),
      buttonText: 'Call Now',
      color: '#667eea'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      description: 'Send us a detailed message',
      info: 'info@company.com',
      action: () => window.open("mailto:info@company.com", "_blank"),
      buttonText: 'Send Email',
      color: '#EA4335'
    }
  ];

  const socialMedia = [
    {
      icon: <FaFacebook />,
      name: 'Facebook',
      username: '@ourcompany',
      url: 'https://facebook.com/ourcompany',
      color: '#1877F2'
    },
    {
      icon: <FaTwitter />,
      name: 'Twitter',
      username: '@ourcompany',
      url: 'https://twitter.com/ourcompany',
      color: '#1DA1F2'
    },
    {
      icon: <FaLinkedin />,
      name: 'LinkedIn',
      username: '/company',
      url: 'https://linkedin.com/company',
      color: '#0077B5'
    },
    {
      icon: <FaInstagram />,
      name: 'Instagram',
      username: '@ourcompany',
      url: 'https://instagram.com/ourcompany',
      color: '#E4405F'
    }
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ];

  return (
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
          <h1 className='contact-title'>Get In Touch</h1>
          <p className='contact-subtitle'>
            We're here to help you with your digital needs. Choose your preferred way to reach us.
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

      {/* Contact Methods Section */}
      <section className='contact-methods-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Contact Methods</h2>
            <p>Multiple ways to connect with our team</p>
          </div>
          <div className='contact-methods-grid'>
            {contactMethods.map((method, index) => (
              <div key={index} className='contact-method-card'>
                <div 
                  className='method-icon'
                  style={{ color: method.color }}
                >
                  {method.icon}
                </div>
                <h3>{method.title}</h3>
                <p className='method-description'>{method.description}</p>
                <p className='method-info'>{method.info}</p>
                <button 
                  className='method-button'
                  onClick={method.action}
                  style={{ backgroundColor: method.color }}
                >
                  {method.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className='social-media-section'>
        <div className='container'>
          <div className='section-header'>
            <h2>Follow Us</h2>
            <p>Stay updated with our latest news and updates</p>
          </div>
          <div className='social-media-grid'>
            {socialMedia.map((social, index) => (
              <div 
                key={index} 
                className='social-card'
                onClick={() => window.open(social.url, "_blank")}
              >
                <div 
                  className='social-icon'
                  style={{ backgroundColor: social.color }}
                >
                  {social.icon}
                </div>
                <div className='social-info'>
                  <h4>{social.name}</h4>
                  <span>{social.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Action Section */}
      <section className='quick-action-section'>
        <div className='container'>
          <div className='quick-action-content'>
            <h2>Need Immediate Assistance?</h2>
            <p>Our team is ready to help you with your project</p>
            <div className='action-buttons'>
              <button 
                className='action-button whatsapp'
                onClick={() => window.open("https://wa.me/201158954215", "_blank")}
              >
                <FaWhatsapp className='button-icon' />
                Message on WhatsApp
              </button>
              <button 
                className='action-button phone'
                onClick={() => window.open("tel:+201158954215", "_blank")}
              >
                <FaPhone className='button-icon' />
                Call Us Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}