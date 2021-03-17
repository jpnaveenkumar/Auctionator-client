import styles from './productsCarousell.module.css';
import ProductCard from '../productCard/productCard';
export default function ProductsCarousell({products, title})
{
    console.log(products);
    return (
        <div id="productListingContainer" className={styles.productListingContainer}>
            <div className={styles.productListingTitle}>
                {title}
            </div>
            <div className={styles.productListingCarousell}>
                {
                    products.map(product => {
                        return <ProductCard key={product["productName"]} product={product}></ProductCard>;
                    })
                }
            </div>
        </div>
    );
}