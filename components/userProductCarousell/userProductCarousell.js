import {connect} from 'react-redux';
import {httpGet} from '../../library/httpRequest';
import {useEffect, useState} from 'react';
import UserProductCard from '../userProductCard/userProductCard';
import styles from '../userProductCarousell/userProductCarousell.module.css';
function UserProductListing({user})
{

    const [isFetching, updateIsFetching] = useState(true);

    useEffect(async () => {
        let url = `/user/${user["userId"]}/products`;
        let result = await httpGet(url, {}, {});
        updateIsFetching(false);
        updateProductListings(result);
        console.log(url);
    }, []);

    const [productListings, updateProductListings] = useState([]);

    return (
        <div className={styles.productContainer}>
            <div className={styles.containerTitle}>
                Your Products
            </div>
            <div className={styles.productBox}>
                {
                    productListings.length > 0 ?
                        productListings.map(product => {
                            return <UserProductCard key={product["productId"]} product={product} ></UserProductCard>
                        })
                    :
                    <div className={styles.productLoading}>
                        {isFetching ? "Fetching User Products..." : "No Products Added..."}
                    </div>
                }
            </div>
        </div>
    );

}

function mapStateToProps(state){
    return { user : state.user };
}

export default connect(mapStateToProps)(UserProductListing);