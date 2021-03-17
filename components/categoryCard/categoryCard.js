import styles from './categoryCard.module.css';
export default function CategoryCard({category}){
    return (
        <div className={styles.categoryCard}>
            <div>
                <img height="100px" width="100px" src={category["categoryIconUrl"]}></img>
            </div>
            <div>
                <p className={styles.categoryName}>{category["categoryName"]}</p>
            </div>
        </div>
    );
}