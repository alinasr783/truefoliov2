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
      label: "Projects", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" }
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
        ease="power3.out"
      />
    </div>
  )
}