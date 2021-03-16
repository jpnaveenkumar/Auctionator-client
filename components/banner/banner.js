import {useEffect, useState} from 'react';
import styles from './banner.module.css';
export default function Banner()
{
    const [screenHeight, setHeight] = useState(0);

    useEffect(()=>{
        setHeight(window.innerHeight);
    },[]);

    return (
        <div className={styles.bannerImage} style={{height: screenHeight}}>
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
            </div>
        </div>
    );
}