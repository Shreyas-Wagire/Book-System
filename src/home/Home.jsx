import React from 'react'
import Banner from '../components/Banner'
// import FavBooks from './FavBooks'
import MostViewed from './MostViewed'
import FavBook from './FavBook'
import PromoBanner from './PromoBanner'
import OtherBooks from './OtherBooks'
import Review from './Review'

const Home = () => {
  return (
    <div>
      <Banner/>
      <MostViewed/>
      {/* <FavBook/> */}
      <PromoBanner/>
      <OtherBooks/>
      <Review/>
    </div>
  )
}

export default Home