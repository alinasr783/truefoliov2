import React from 'react'
import '../css/About.css'
import { FaRocket, FaGem, FaHandshake, FaChartLine, FaEye, FaAward, FaBullseye } from 'react-icons/fa'

export default function About() {
  const stats = [
    { number: '150+', label: 'مشاريع مكتملة' },
    { number: '50+', label: 'عملاء سعداء' },
    { number: '5+', label: 'سنوات خبرة' },
    { number: '24/7', label: 'دعم مستمر' }
  ];

  const values = [
    {
      icon: <FaRocket />,
      title: 'الابتكار',
      description: 'نستكشف باستمرار أحدث التقنيات والحلول المبتكرة لنظل في الصدارة.'
    },
    {
      icon: <FaGem />,
      title: 'الجودة',
      description: 'نلتزم بأعلى معايير الجودة في كل مشروع لضمان التميّز.'
    },
    {
      icon: <FaHandshake />,
      title: 'الشفافية',
      description: 'نعمل بعلاقات واضحة وصادقة مع عملائنا ونُطلعهم على كل المستجدات.'
    },
    {
      icon: <FaChartLine />,
      title: 'النمو',
      description: 'نركّز على تمكين عملائنا من تحقيق نمو مستدام ونجاح طويل الأمد.'
    }
  ];

  const goals = [
    {
      icon: <FaBullseye />,
      title: 'رسالتنا',
      description: 'تقديم حلول رقمية مبتكرة تمكّن الشركات من تحقيق أهدافها عبر تقنيات حديثة واستراتيجيات إبداعية.'
    },
    {
      icon: <FaEye />,
      title: 'رؤيتنا',
      description: 'أن نكون الشريك الرقمي المفضل للشركات الطموحة في المنطقة بتحويل الأفكار إلى نجاح ملموس.'
    },
    {
      icon: <FaAward />,
      title: 'هدفنا',
      description: 'تجاوز توقعات العملاء دائمًا عبر تسليم المشاريع في الوقت المحدد وبجودة ودعم لا يُضاهى.'
    }
  ];

  return (
    <div className='about-page'>
      {/* Hero Section */}
      <section className='about-hero'>
        <div className='about-hero-content'>
          <h1 className='about-title'>من نحن</h1>
          <p className='about-subtitle'>
            شركة حلول رقمية رائدة تقدّم خدمات شاملة لمساعدة عملائنا على النمو والتميّز في العالم الرقمي عبر الابتكار والخبرة.
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
            <h2>رسالتنا ورؤيتنا</h2>
            <p>ما يدفعنا للتقدّم ويحدّد مسارنا نحو النجاح</p>
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
            <h2>قيمنا</h2>
            <p>المبادئ التي توجه عملنا وعلاقاتنا</p>
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
            <h2>لماذا تختارنا</h2>
            <p>ما يجعلنا الشريك الأنسب لرحلتك الرقمية</p>
          </div>
          <div className='features-grid'>
            <div className='feature-item'>
              <div className='feature-number'>01</div>
              <h3>فريق خبراء</h3>
              <p>يضم فريقنا محترفين ذوي خبرة وشغف بالتقنية والابتكار.</p>
            </div>
            <div className='feature-item'>
              <div className='feature-number'>02</div>
              <h3>حلول مخصّصة</h3>
              <p>نُصمّم خدماتنا لتناسب احتياجات وأهداف عملك بدقّة.</p>
            </div>
            <div className='feature-item'>
              <div className='feature-number'>03</div>
              <h3>نتائج مثبَتة</h3>
              <p>لدينا سجل ناجح في تنفيذ مشاريع تحقق قيمة حقيقية للأعمال.</p>
            </div>
            <div className='feature-item'>
              <div className='feature-number'>04</div>
              <h3>دعم مستمر</h3>
              <p>نقدّم دعمًا وصيانة مستمرة لضمان نجاحك على المدى الطويل.</p>
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
