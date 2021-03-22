import styles from './productsCarousell.module.css';
import ProductCard from '../productCard/productCard';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
export default function ProductsCarousell({products, title, status, timerExpiryCallback})
{

    const router = useRouter();

    const [productListingTitle, updateProductListingTitle] = useState(title);
    
    function navigateToProductPage()
    {
        if(status == "upcoming"){
            router.push("/product?status=Upcoming");
        }else if(status == "ongoing"){
            router.push("/product?status=Ongoing");
        }
    }

    return (
        <div id="productListingContainer" className={styles.productListingContainer}>
            <div className={styles.productListingWrapper}>
                <div className={styles.productListingTitleContainer}>
                    <span className={styles.productListingTitle}>{productListingTitle}</span>
                    <span onClick={navigateToProductPage} className={styles.moreBtn}>more</span>
                </div>
                <div className={styles.productListingCarousell}>
                    {
                        products.map(product => {
                            return <ProductCard timerExpiryCallback={timerExpiryCallback} status={status} key={product["productName"]} product={product}></ProductCard>;
                        })
                    }
                </div>
            </div>
        </div>
    );
}