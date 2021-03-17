import styles from './productCard.module.css';
export default function ProductCard({product})
{
    return (
        <div className={styles.productCard}>
            <div>
                <img src={product["productImageUrl"]} height="200px" width="100%"></img>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.row1}>
                    <span className={styles.productTitle}>{product["productName"]}</span>
                    <span className={styles.basePrice}>$ {product["productBasePrice"]}</span>
                </div>
                <div className={styles.row2}>
                    <span className={styles.lhs}>Start Time : </span>
                    <span className={styles.rhs}>{new Date(product["startTime"]).toLocaleString()}</span>
                </div>
                <div className={styles.row3}>
                    <span className={styles.lhs}>End Time : </span>
                    <span className={styles.rhs}>{new Date(product["endTime"]).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}