import React from 'react'
import Headerbit from '../../bits/jsx/CardNav'
import logo from '../../../assets/logo.png'
import '../css/Header.css'
export default function Header(){
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
        { label: "Web Development", ariaLabel: "Our Web Development Service", href: "#services" },
        { label: "Mobile Apps", ariaLabel: "Our Mobile Apps Service", href: "#services" },
        { label: "UI/UX Design", ariaLabel: "Our UI/UX Design Service", href: "#services" },
        { label: "Digital Marketing", ariaLabel: "Our Digital Marketing Service", href: "#services" }
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