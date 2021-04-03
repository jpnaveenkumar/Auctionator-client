import {useEffect, useState} from 'react';
import styles from './banner.module.css';
import ValuationTool from '../../components/valuationTool/valuationTool';
export default function Banner()
{
    const [screenHeight, setHeight] = useState(0);
    const [showValuationToolModal, updateShowValuationToolModal] = useState(false);
    useEffect(()=>{
        setHeight(window.innerHeight);
    },[]);

    function scrollToEvents()
    {
        document.querySelector("#productListingContainer")
        .scrollIntoView({behaviour:'smooth'});
    }

    function openValuationToolModal()
    {
        updateShowValuationToolModal(true);
        document.body.style.overflow = "hidden";
    }

    function onModalClose(){
        updateShowValuationToolModal(false);
        document.body.style.overflow = "";
    }

    return (
        <div className={styles.bannerImage} style={{height: screenHeight}}>
            {
                showValuationToolModal &&
                <ValuationTool onModalClose = {onModalClose}></ValuationTool>
            }
            <div className={styles.bannerContent}>
                <div className={styles.bannerTextContainer}>
                    <h1 className={styles.bannerText}>Auctionator The Auction Listing Platform</h1>
                </div>
                <div className={styles.bannerDescriptionContainer}>
                    <p>The Auctionator is a C2C business model, where a customer can add products for auction,
                         and customers can also bid during an auction to buy the products.Customers can browse 
                         among auction listings across a variety of product categories.The Auction listings will 
                         be either an Upcoming auction or an Ongoing auction.
                    </p>
                </div>
                <div className={styles.buttonContainer}>
                    <div onClick={openValuationToolModal} className={styles.bannerButton}>
                        AI Valuation Tool
                    </div>
                    <div onClick={scrollToEvents} className={styles.bannerButton}>
                        Participate
                    </div>
                </div>
            </div>
        </div>
    );
}