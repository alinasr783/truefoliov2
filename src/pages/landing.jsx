import React, { Suspense } from "react";
import Header from "../components/landing/jsx/Header";
import Hero from "../components/landing/jsx/Hero";
import CTAbtns from "../components/landing/jsx/CTAbtns";
import SeoHead from "../components/SeoHead";
const Services = React.lazy(() => import("../components/landing/jsx/Services"));
const About = React.lazy(() => import("../components/landing/jsx/About"));
import ScrollStack, {
  ScrollStackItem,
} from "../components/bits/jsx/ScrollStack";
import "./landing.css";
export default function Landing() {
  return (
    <div className="landing">
      <SeoHead
        title="إنشاء موقع إلكتروني احترافي | TrueFolio"
        description="نقدّم في TrueFolio خدمة إنشاء موقع إلكتروني احترافي وسريع ومُحسّن لمحركات البحث، مع تصميم عصري وتجربة مستخدم ممتازة تناسب شركتك."
        keywords="إنشاء موقع إلكتروني, تصميم مواقع, تطوير مواقع, شركة برمجة, متجر إلكتروني, مواقع احترافية, SEO"
        canonical="https://truefolio.vercel.app/"
        ogTitle="إنشاء موقع إلكتروني احترافي | TrueFolio"
        ogDescription="مواقع سريعة ومُحسّنة لـ SEO بتصميم عصري وتجربة مستخدم ممتازة."
        ogImage="https://truefolio.vercel.app/logo.png"
        ogUrl="https://truefolio.vercel.app/"
        twitterTitle="إنشاء موقع إلكتروني احترافي | TrueFolio"
        twitterDescription="مواقع سريعة ومُحسّنة لـ SEO بتصميم عصري وتجربة مستخدم ممتازة."
        twitterImage="https://truefolio.vercel.app/logo.png"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "TrueFolio Home",
            description:
              "صفحة الهبوط لخدمة إنشاء موقع إلكتروني احترافي وسريع ومُحسّن لـ SEO",
            url: "https://truefolio.vercel.app/",
            mainEntity: {
              "@type": "Service",
              name: "إنشاء موقع إلكتروني",
              serviceType: "Website Development",
              provider: {
                "@type": "Organization",
                name: "TrueFolio",
                url: "https://truefolio.vercel.app/"
              },
              areaServed: "Middle East",
              offers: {
                "@type": "Offer",
                availability: "InStock"
              }
            }
          }
        ]}
      />
      <Header />

      <CTAbtns />

      <Hero />

      <Suspense fallback={<div style={{padding: '2rem', textAlign: 'center', color: '#999'}}>...جارِ تحميل الخدمات</div>}>
        <Services />
      </Suspense>

      <Suspense fallback={<div style={{padding: '2rem', textAlign: 'center', color: '#999'}}>...جارِ تحميل من نحن</div>}>
        <About />
      </Suspense>
    </div>
  );
}
