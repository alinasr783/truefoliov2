import React from 'react'
import Header from '../components/landing/jsx/Header'
import Hero from '../components/landing/jsx/Hero'
import CTAbtns from '../components/landing/jsx/CTAbtns'
import './landing.css'
export default function Landing(){
  return(
    <div className='landing'>
      <Header />
      <Hero />
      <CTAbtns />
    </div>
  )
}