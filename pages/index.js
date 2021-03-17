import StickyHeader from '../components/stickyHeader/stickyHeader';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import ProductsCarousell from '../components/productsCarousell/productsCarousell';
import CategoryListing from '../components/categoryListing/categoryListing';
import { useState, useEffect } from "react";
import {httpGet} from '../library/httpRequest';
import styles from './index.module.css';
export default function Home({category, upcoming, err}) {

  const [showStickyHeader, updateShowStickyHeader] = useState(false);
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

  return (
    <div>
      {showStickyHeader ? <StickyHeader></StickyHeader> : <Header></Header> }
      <Banner></Banner>
      <CategoryListing category={category}></CategoryListing>
      <ProductsCarousell products={upcoming} title="Upcoming Biddings"></ProductsCarousell>
      <div className="afterBanner" style={{"height":"1500px"}}></div>
    </div>
  );
}

export const getStaticProps = async () => {
  try{
      const result = await Promise.all([
        httpGet("/category/categories",{},{}),
        httpGet("/product/all?status=All&pageNumber=0&pageSize=10&categories=ff808081783ea0a401783ea2a9ad0007",{},{})
      ]);
      return {
          props : {
            category: result[0],
            upcoming: result[1]
          }
      };
  }catch(e){
      console.log(e);
  }
}
