import React, {useEffect} from 'react'
import Headerbit from '../../bits/jsx/CardNav'
import logo from '../../../assets/logo.png'
import '../css/Header.css'
export default function Header(){
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Services", 
      bgColor: "#1F1230",
      textColor: "#fff",
      links: [
        { label: "Web Development", ariaLabel: "Our Web Development Service", href: "/services/webdesign" },
        { label: "Mobile Apps", ariaLabel: "Our Mobile Apps Service", href: "/services/mobileapp" },
        { label: "SEO", ariaLabel: "Search Engine Optimisation", href: "/services/seo" },
        { label: "Digital Marketing", ariaLabel: "Our Digital Marketing Service", href: "/services/marketing" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Phone", ariaLabel: "Phone" },
        { label: "Facebook", ariaLabel: "Facebook" }
      ]
    }
  ];
  return(
    <div className='Header'>
      <Headerbit
        logo={logo}
        logoAlt="TrueFolio"
        items={items}
        baseColor="#000"
        menuColor="#fff"
        buttonBgColor="#fff"
        buttonTextColor="#000"
        ease="back.out(1.7)"
      />
    </div>
  )
}