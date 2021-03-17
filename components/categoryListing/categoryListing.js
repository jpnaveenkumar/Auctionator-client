import styles from './categoryListing.module.css';
import CategoryCard from '../categoryCard/categoryCard';
export default function CategoryListing(props)
{

    return (
        <div className={styles.categoryListingContainer}>
            <div className={styles.categoryListingTitle}>
                Category
            </div>
            <div className={styles.categoryCardContainer}>
                {props.category.map(category => {
                    return <CategoryCard key={category["categoryId"]} category={category}></CategoryCard>;
                })}
            </div>
        </div>
    );   
}