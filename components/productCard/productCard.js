import styles from './productCard.module.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {getRemainingTime} from '../../library/dateHelper';
export default function ProductCard({product, status, timerExpiryCallback})
{

    const router = useRouter();

    const [timeLeft, updateTimeLeft] = useState(" ");

    function navigateToProductDetailsPage()
    {
        router.push(`/product/${product["productId"]}`);
    }

    useEffect(()=>{
        let timer = setInterval(() => {
            let timeLeft;
            if(status == "ongoing"){
                timeLeft = getRemainingTime(new Date().toISOString(),product["endTime"]);
            }else if(status == "upcoming"){
                timeLeft = getRemainingTime(new Date().toISOString(),product["startTime"]);
            }
            if(timeLeft == " 0 hr : 0 min : 0 sec"){
                clearInterval(timer);
                timerExpiryCallback();
                return;
            }
            updateTimeLeft(timeLeft);
        }, 1000);
        return () => clearInterval(timer);
    },[])

    return (
        <div onClick={navigateToProductDetailsPage} className={styles.productCard}>
            <div>
                <img src={product["productImageUrl"]} height="200px" width="100%"></img>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.row1}>
                    <span className={styles.productTitle}>{product["productName"]}</span>
                    <span className={styles.basePrice}>$ {product["productBasePrice"]}</span>
                </div>
                <div className={styles.row5}>
                    <span className={styles.lhs}>Number of Bids : </span>
                    <span className={styles.rhs}>{product["numberOfBids"]}</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.lhs}>Start Time : </span>
                    <span className={styles.rhs}>{new Date(product["startTime"]).toLocaleString()}</span>
                </div>
                <div className={styles.row3}>
                    <span className={styles.lhs}>End Time : </span>
                    <span className={styles.rhs}>{new Date(product["endTime"]).toLocaleString()}</span>
                </div>
                <div className={styles.row4}>
                    { status == 'ongoing' ? <span>Remaining Time Left</span> : <span>Time Left to Start</span>}
                </div>
                <div className={styles.timer}>
                    <span>{timeLeft}</span>
                </div>
            </div>
        </div>
    );
}