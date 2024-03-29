import styles from './userProductCard.module.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import ViewResult from '../../components/viewResult/viewResult';
export default function userProductCard({product})
{
    const router = useRouter();

    function navigateToProductDetailsPage()
    {
        router.push(`/product/${product["productId"]}`);
    }
    
    function getStatusColor(status)
    {
        if( status == "ongoing"){
            return "green";
        }else if( status == "upcoming"){
            return "blue";
        }else{
            return "red";
        }
    }

    function getResultsSection(status)
    {
        if( status == "ongoing"){
            return (
            <div onClick={openViewResultsModal} className={styles.viewResults}>
                View Status
            </div>);
        }else if( status == "upcoming"){
            return <div></div>;
        }else{
            return (
            <div onClick={openViewResultsModal} className={styles.viewResults}>
                View Results
            </div>);
        }
    }

    function getProductStatus(productInfo)
    {
            let startTime = new Date(productInfo["startTime"]);
            let endTime = new Date(productInfo["endTime"]);
            let currentTime =  new Date();
            if(currentTime>= startTime && currentTime <=endTime){
                return "ongoing";
            }else if (currentTime < startTime){
                return "upcoming";
            }else{
                return "ended";
            }
    }

    const [status, updateProductStatus] = useState(getProductStatus(product));
    const [showViewResults, updateShowViewResults] = useState(false);
    const [productIdForViewResults, updateProductIdForViewResults] = useState(product["productId"]);

    function openViewResultsModal()
    {
        updateShowViewResults(true);
        document.body.style.overflow = "hidden";
    }

    function onModalClose(){
        updateShowViewResults(false);
        document.body.style.overflow = "";
    }

    return (
        <div>
            {
                showViewResults &&
                <ViewResult productId = {productIdForViewResults} onModalClose = {onModalClose}></ViewResult>
            }
        <div className={styles.productCard}>
            <div onClick={navigateToProductDetailsPage}>
                <img src={product["productImageUrl"]} height="230px" width="100%"></img>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.row1}>
                    <span className={styles.productTitle}>{product["productName"].length > 50 ? product["productName"].slice(0,30)+" ..." : product["productName"]}</span>
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
                <div className={styles.statusContainer}>
                    <div className={styles.status} style={{ backgroundColor : getStatusColor(status)}}>
                        {status.toUpperCase()}
                    </div>
                    <div>
                        {getResultsSection(status)}
                    </div>
                </div>                
            </div>
        </div>
        </div>
    );
}