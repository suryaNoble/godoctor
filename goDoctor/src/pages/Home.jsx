// import React from 'react'
// import { CarouselDefault } from "../components/Header"
// import Header from "../components/Header"
import Carousel from "../components/Carousel"
import Specials from "../components/Specials"
import TopDcotors from "../components/TopDcotors"
import Banner from "../components/Banner"
const Home = () => {
  return (
    <div>
      <Carousel />
      <Specials />
      <TopDcotors />
      <Banner />
    </div>
  )
}

export default Home