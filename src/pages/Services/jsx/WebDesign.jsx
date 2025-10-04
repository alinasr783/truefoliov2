import React from 'react'
import Silk from '../../../components/bits/jsx/Silk';
import ElectricBorder from '../../../components/bits/jsx/ElectricBorder'
import Header from '../../../components/landing/jsx/Header'
import CTA from '../../../components/landing/jsx/CTAbtns'
import MagicBento from '../../../components/bits/jsx/MagicBento'
import '../css/WebDesign.css'

export default function WebDesign() {
  return (
    <>
      <Header />
      <CTA />
    <div className='service-page web-design-page'>
      <div className='service-hero-WebDesign'>
        <div className='service-hero-content-WebDesign'>
          <div className='service-hero-background'>
            <Silk
              speed={5}
              scale={1}
              color="#6333ff"
              noiseIntensity={1.5}
              rotation={0}
            />
          </div>
          <h1 className='service-title'>Web Development</h1>
          <p className='service-subtitle'>Professional and attractive website design that reflects your brand identity</p>
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
      <div className='service-details'>
        <div className='details-container'>
          <div className='details-content'>
            <h2>What we offer in web Development</h2>
            <div className='features-grid'>
              <div className='feature-card'>
                <div className='feature-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <path d="M3 9h18"/>
                  </svg>
                </div>
                <h3>Responsive Design</h3>
                <p>Websites that work perfectly on all devices and sizes.</p>
              </div>

              <div className='feature-card'>
                <div className='feature-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4z"/>
                    <path d="M6 18h12"/>
                  </svg>
                </div>
                <h3>Modern User Interface</h3>
                <p>Modern and user-friendly designs that enhance the user experience.</p>
              </div>

              <div className='feature-card'>
                <div className='feature-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8"/>
                    <path d="M8 12h8"/>
                  </svg>
                </div>
                <h3>SEO Optimization</h3>
                <p>SEO-optimized design to improve your site's visibility.</p>
              </div>

              {/* <MagicBento 
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="132, 0, 255"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}