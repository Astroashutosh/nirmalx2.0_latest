import React from 'react'
import banner from '/images/banner3.png'
import mobileBanner from '/images/mobile-banner1.png'

function Hero() {
  return (
   <section className="hero-wrap">
  
  <img src={banner} className="banner-desktop" alt="Banner Desktop"/>
  
 
  <img src={mobileBanner} className="banner-mobile" alt="Banner Mobile"/>
</section>

  )
}

export default Hero