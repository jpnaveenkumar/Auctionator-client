import StickyHeader from '../components/stickyHeader/stickyHeader';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Footer from '../components/footer/footer';
import ProductsCarousell from '../components/productsCarousell/productsCarousell';
import CategoryListing from '../components/categoryListing/categoryListing';
import { useState, useEffect } from "react";
import {httpGet} from '../library/httpRequest';
import styles from './index.module.css';
export default function Home({category, upcoming, err, ongoing}) {

  const [showStickyHeader, updateShowStickyHeader] = useState(false);
  const [ongoingBidding, updateOngoingBidding] = useState(ongoing);
  const [upcomingBidding, updateUpcomingBidding] = useState(upcoming);
  function scrollWatcher()
    {
      let curPosition = window.scrollY;
      let targetPosition = window.innerHeight - 50;
      if(curPosition > targetPosition){
        if(!showStickyHeader){
          updateShowStickyHeader(true);
        }
      }else{
        if(showStickyHeader){
          updateShowStickyHeader(false);
        }
      }
    }

  useEffect(()=>{
    window.addEventListener("scroll", scrollWatcher, {passive: true});
    return () => window.removeEventListener("scroll", scrollWatcher);
  },[showStickyHeader]);

  const handleOngoingEventsTimerExpiry = async () => {
    setTimeout(async () => {
      const events = await httpGet("/product/all?pageNumber=0&pageSize=10&status=Ongoing",{},{});
      updateOngoingBidding(events);
    }, 1000);
  }

  const handleUpcomingEventsTimerExpiry = async () => {
    setTimeout(async () => {
      const result = await Promise.all([
        httpGet("/product/all?pageNumber=0&pageSize=10&status=Upcoming",{},{}),
        httpGet("/product/all?pageNumber=0&pageSize=10&status=Ongoing",{},{})
      ]);
      updateOngoingBidding(result[1]);
      updateUpcomingBidding(result[0]);
    }, 1000);
  }

  return (
    <div>
      {showStickyHeader ? <StickyHeader></StickyHeader> : <Header></Header> }
      <Banner></Banner>
      <CategoryListing category={category}></CategoryListing>
      <ProductsCarousell timerExpiryCallback={handleUpcomingEventsTimerExpiry} status="upcoming" products={upcomingBidding} title="Upcoming Biddings"></ProductsCarousell>
      <ProductsCarousell timerExpiryCallback={handleOngoingEventsTimerExpiry} status="ongoing" products={ongoingBidding} title="Ongoing Biddings"></ProductsCarousell>
      <Footer></Footer>
    </div>
  );
}

export const getStaticProps = async () => {
  try{
      const result = await Promise.all([
        httpGet("/category/categories",{},{}),
        httpGet("/product/all?pageNumber=0&pageSize=10&status=Upcoming",{},{}),
        httpGet("/product/all?pageNumber=0&pageSize=10&status=Ongoing",{},{})
      ]);
      return {
          props : {
            category: result[0],
            upcoming: result[1],
            ongoing: result[2]
          }
      };
  }catch(e){
      console.log(e);
  }
}
