import React from 'react'
import GlassSurface from '../../bits/jsx/GlassSurface'
import '../css/CTAbtns.css'

export default function CTAbtns(){
  return(
    <div className='CTAbtns'>
      <GlassSurface
        displace={0.5}
        distortionScale={-150}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        brightness={50}
        opacity={0.93}
        mixBlendMode="screen"
      >
        <div className='CTAbtns-content'>
          <div 
            className="getbtn cursor-pointer"
            onClick={() => window.open("https://wa.me/201158954215", "_blank")}
          >
            Message Us
          </div>
          <div className='connectbtn'>
            Get Started
          </div>
        </div>
      </GlassSurface>
    </div>
  )
}