import StickyHeader from '../components/stickyHeader/stickyHeader';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import { useState, useEffect } from "react";
import styles from './index.module.css';
export default function Home() {

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
      {/* <StickyHeader></StickyHeader> */}
      <Banner></Banner>
      <div className="afterBanner" style={{"height":"1500px"}}></div>
    </div>
  );
}
