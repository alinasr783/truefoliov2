import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/Services.css'
import TiltedCard from '../../bits/jsx/TiltedCard';
import FuzzyText from '../../bits/jsx/FuzzyText';

const services = [
  {
    title: 'Web Design',
    description: 'We do Web Design',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8" />
        <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
      </svg>
    ),
    image: 'https://i.ibb.co/vbfYjMd/istockphoto-1456339578-612x612.jpg',
    link: '/services/webdesign',
  },
  {
    title: 'Mobile App',
    description: 'We do Software Design',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    image: 'https://i.ibb.co/hk1JDtw/istockphoto-1597039515-612x612.jpg',
    link: '/services/mobileapp',
  },
  {
    title: 'Marketing',
    description: 'De Advised That Image.',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    image: 'https://i.ibb.co/Q7GFgF3M/istockphoto-1492180527-612x612.jpg',
    link: '/services/marketing',
  },
  {
    title: 'SEO',
    description: 'Search Engine Optimisation',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M12 18v-6" />
        <path d="M8 21V3" />
      </svg>
    ),
    image: 'https://i.ibb.co/NdWT4f2v/istockphoto-1205193642-612x612.jpg',
    link: '/services/seo',
  },
];

export default function Services(){
  const navigate = useNavigate();
  return(
    <div className='services' id="services">
      <div className='services-content'>
        <div className="services-Header">
          <div className='services-Header-title'>
              Services
          </div>
          <div className='services-Header-subtitle'>
            We offer a wide range of services to help you achieve your goals
          </div>
        </div>

        <div className="services-cards">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <TiltedCard
                imageSrc={service.image}
                altText={service.title}
                captionText={service.description}
                containerHeight="300px"
                containerWidth="300px"
                imageHeight="300px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.3}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <>
                  <p className="tilted-card-demo-text">
                    {service.title}
                  </p>
                  <div className='services-cta'
                    onClick={() => navigate(service.link)}
                    >
                    How we do it ?
                  </div>
                  </>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}