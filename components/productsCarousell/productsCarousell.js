import styles from './productsCarousell.module.css';
import ProductCard from '../productCard/productCard';
import {useEffect, useState} from 'react';
export default function ProductsCarousell({products, title, status, timerExpiryCallback})
{

    const [productListingTitle, updateProductListingTitle] = useState(title);
    
    return (
        <div id="productListingContainer" className={styles.productListingContainer}>
            <div className={styles.productListingWrapper}>
                <div className={styles.productListingTitleContainer}>
                    <span className={styles.productListingTitle}>{productListingTitle}</span>
                    <span className={styles.moreBtn}>more</span>
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