import React from 'react'
import Silk from '../../../components/bits/jsx/Silk';
import ElectricBorder from '../../../components/bits/jsx/ElectricBorder'
import Header from '../../../components/landing/jsx/Header'
import CTA from '../../../components/landing/jsx/CTAbtns'
import '../css/WebDesign.css'
import "../css/MobileApp.css"

export default function MobileApp() {
  return (
    <>
      <Header/>
      <CTA/>
    <div className='service-page mobile-app-page'>
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
          <h1 className='service-title'>Mobile App Development</h1>
          <p className='service-subtitle'>Innovative mobile app development that meets your business needs and provides an exceptional user experience.</p>
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
            <h2>Development Platforms</h2>
            <div className='platforms-grid'>
              <div className='platform-card'>
                <div className='platform-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H12a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
                    <path d="M18 6V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2"/>
                  </svg>
                </div>
                <h3>iOS</h3>
                <p>High-performance and elegant design for iPhone and iPad applications.</p>
              </div>

              <div className='platform-card'>
                <div className='platform-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
                    <path d="M16 18h4"/>
                  </svg>
                </div>
                <h3>Android</h3>
                <p>Android applications compatible with all devices.</p>
              </div>

              <div className='platform-card'>
                <div className='platform-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3h6l2 4h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l2-4z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                </div>
                <h3>Hybrid</h3>
                <p>Applications that work on all platforms with cost-effective.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </>
  )
}