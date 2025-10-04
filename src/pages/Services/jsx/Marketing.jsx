import React from 'react'
import Silk from '../../../components/bits/jsx/Silk';
import ElectricBorder from '../../../components/bits/jsx/ElectricBorder'
import Header from '../../../components/landing/jsx/Header'
import CTA from '../../../components/landing/jsx/CTAbtns'
import '../css/WebDesign.css'
import '../css/Marketing.css'

export default function Marketing() {
  return (
    <>
      <Header/>
      <CTA/>
    <div className='service-page marketing-page'>
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
          <h1 className='service-title'>Digital Marketing</h1>
          <p className='service-subtitle'>Innovative digital marketing strategies to enhance your digital presence and increase your sales</p>
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
            <h2>Our Marketing Services</h2>
            <div className='services-grid'>
              <div className='service-card'>
                <div className='service-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5"/>
                    <path d="M15 12a9 9 0 0 1 9-9"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <h3>Social Media Management</h3>
                <p>Professional management of your social media accounts</p>
              </div>

              <div className='service-card'>
                <div className='service-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20l9-9"/>
                    <path d="M12 11l9 9"/>
                  </svg>
                </div>
                <h3>Integrated Advertising</h3>
                <p>Well-planned advertising campaigns on various social media platforms</p>
              </div>

              <div className='service-card'>
                <div className='service-icon'>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2"/>
                    <path d="M22 3h-6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/>
                  </svg>
                </div>
                <h3>Data Analysis</h3>
                <p>Analyzing campaign performance and making data-driven decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}