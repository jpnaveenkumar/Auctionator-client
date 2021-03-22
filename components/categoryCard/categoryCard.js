import styles from './categoryCard.module.css';
import {useRouter} from 'next/router';
export default function CategoryCard({category}){

    const router = useRouter();

    function navigateToProductPage()
    {
        router.push(`/product?category=${category["categoryId"]}`);
    }

    return (
        <div onClick={navigateToProductPage} className={styles.categoryCard}>
            <div>
                <img height="100px" width="100px" src={category["categoryIconUrl"]}></img>
            </div>
            <div>
                <p className={styles.categoryName}>{category["categoryName"]}</p>
            </div>
        </div>
    );
}