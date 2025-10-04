import React from 'react'
import '../css/Hosting.css'

export default function Hosting() {
  return (
    <div className='service-page hosting-page'>
      <div className='service-hero'>
        <div className='service-hero-content'>
          <h1 className='service-title'>Web Hosting</h1>
          <p className='service-subtitle'>حلول استضافة ويب فائقة السرعة والموثوقية مع دعم فني على مدار الساعة</p>
          <div className='service-cta'>
            <button 
              className='cta-button'
              onClick={() => window.open("https://wa.me/201158954215", "_blank")}
            >
              اطلب خدمتك الآن
            </button>
          </div>
        </div>
      </div>

      <div className='service-details'>
        <div className='details-container'>
          <div className='details-content'>
            <h2>باقات الاستضافة</h2>
            <div className='hosting-plans'>
              <div className='plan-card'>
                <div className='plan-header'>
                  <h3>الاستضافة المشتركة</h3>
                  <div className='plan-price'>$9.99<span>/شهر</span></div>
                </div>
                <ul className='plan-features'>
                  <li>مساحة تخزين 10GB</li>
                  <li>نطاق مجاني</li>
                  <li>بريد إلكتروني غير محدود</li>
                  <li>شهادة SSL مجانية</li>
                </ul>
              </div>

              <div className='plan-card featured'>
                <div className='plan-header'>
                  <h3>VPS</h3>
                  <div className='plan-price'>$29.99<span>/شهر</span></div>
                </div>
                <ul className='plan-features'>
                  <li>2 vCPU Core</li>
                  <li>4GB RAM</li>
                  <li>80GB SSD Storage</li>
                  <li>نطاق غير محدود</li>
                </ul>
              </div>

              <div className='plan-card'>
                <div className='plan-header'>
                  <h3>السحابية</h3>
                  <div className='plan-price'>$49.99<span>/شهر</span></div>
                </div>
                <ul className='plan-features'>
                  <li>موارد قابلة للتوسع</li>
                  <li>نسخ احتياطي تلقائي</li>
                  <li>CDN مجاني</li>
                  <li>دعم فني متميز</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}