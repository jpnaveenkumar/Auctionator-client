import ProductCard from "../../components/productCard/productCard";
import StickyHeader from '../../components/stickyHeader/stickyHeader';
import styles from './index.module.css';
import Footer from '../../components/footer/footer';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {httpGet} from '../../library/httpRequest';
export default function Product({products, pageType, category}){
    const router = useRouter();
    console.log(products);
    const [activeTab, updateActiveTab] = useState("upcoming");
    const [productsByStatus, updateProductsByStatus] = useState([]);
    const [productsByCategoryOngoing, updateProductsByCategoryOngoing] = useState([]);
    const [productsByCategoryUpcoming, updateProductsByCategoryUpcoming] = useState([]);

    const productsByStatusTimerExpiryCallBack = async () => {
        setTimeout(async () => {
            let url = `/product/all?pageNumber=0&pageSize=100&status=${router.query['status']}`;
            let result = await httpGet(url, {}, {});
            result = markProductsWithStatus(result);
            updateProductsByStatus(result);
        }, 1000);
    }

    const productsByCategoryTimerExpiryCallBack = async () => {
        setTimeout(async () => {
            let url = `/product/all?pageNumber=0&pageSize=100&status=Ongoing&categories=${router.query['category']}`;
            let result = await httpGet(url, {}, {});
            result = markProductsWithStatus(result);
            updateProducstsByCategory(result);
        }, 1000);
    }

    function updateProducstsByCategory(items)
    {
        let upcomingProducts = [];
        let ongoingProducts = [];
        for(let product of items){
            if(product["status"] == "ongoing"){
                ongoingProducts.push(product);
            }else if (product["status"] == "upcoming"){
                upcomingProducts.push(product);
            }
        }
        updateProductsByCategoryOngoing(ongoingProducts);
        updateProductsByCategoryUpcoming(upcomingProducts);
    }

    function markProductsWithStatus(items)
    {
        for(let product of items){
            let startTime = new Date(product["startTime"]);
            let endTime = new Date(product["endTime"]);
            let currentTime =  new Date();
            if(currentTime>= startTime && currentTime <=endTime){
                product["status"] = "ongoing";
            }else if (currentTime < startTime){
                product["status"] = "upcoming";
            }
        }
        return items;
    }

    function switchTab(selected) {
        if(activeTab != selected){
            updateActiveTab(selected);
        }
    }

    useEffect(() => {
        products = markProductsWithStatus(products);
        if(pageType == "category"){
            updateProducstsByCategory(products);
        }else if(pageType == "status"){
            updateProductsByStatus(products);
        }
    }, []);

    if(pageType == "category"){
        let datasource = activeTab == "upcoming" ? productsByCategoryUpcoming : productsByCategoryOngoing;
        return (
            <div>
                <StickyHeader></StickyHeader>
                <div className={styles.container}>
                    <div className={styles.holder}>
                        <div className={styles.titleBox}>
                            <span className={styles.title}>{category["categoryName"]}</span>
                        </div>
                        <div className={styles.statusTabsContainer}>
                            <div onClick={() => switchTab("upcoming")} className={`${styles.statusTabs} ${ activeTab == 'upcoming' ? styles.activeTab : ''}`}>Upcoming</div>
                            <div onClick={() => switchTab("ongoing")} className={ `${styles.statusTabs} ${styles.noBorderLeft} ${ activeTab == 'ongoing' ? styles.activeTab : ''}`}>Ongoing</div>
                        </div>
                        <div className={styles.productsContainer}>
                            {   
                                datasource.length > 0 ?
                                datasource.map(product => {
                                    return <ProductCard timerExpiryCallback={productsByCategoryTimerExpiryCallBack} status={product["status"]} key={product["productId"]} product={product}></ProductCard>;
                                }) :
                                <div className={styles.notFound}>No Products Found</div>
                            }
                        </div>
                    </div>
                    
                </div>
                <Footer></Footer>
            </div>
        );
    }else if(pageType == "status"){
        return (
            <div>
                <StickyHeader></StickyHeader>
                <div className={styles.container}>
                    <div className={styles.holder}>
                    <div className={styles.titleBox}>
                        <span className={styles.title}>{router.query['status']}</span>
                    </div>
                    <div className={styles.productsContainer}>
                        {
                            productsByStatus.length > 0 ?
                            productsByStatus.map(product => {
                                return <ProductCard timerExpiryCallback={productsByStatusTimerExpiryCallBack} status={product["status"]} key={product["productId"]} product={product}></ProductCard>;
                            }) : 
                            <div className={styles.notFound}>No Products Found</div>
                        }
                    </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        );
    }
}

export const getServerSideProps = async (context) => {
    try{
        let pageType;
        let query = context.query;
        let url;
        let result;
        if('category' in query){
            url = `/product/all?pageNumber=0&pageSize=100&statuses=Ongoing,Upcoming&categories=${query['category']}`;
            pageType = 'category';
            result = await Promise.all([httpGet(url,{},{}), httpGet("/category/categories",{},{})]);
            console.log(url);
            return {
                props : {
                    products : result[0],
                    category : result[1].filter(d => d["categoryId"] == query["category"])[0],
                    pageType
                }
            }
        }else if('status' in query){
            url = `/product/all?pageNumber=0&pageSize=100&statuses=${query['status']}`;
            pageType = 'status';
            result = await Promise.all([httpGet(url,{},{})]);
            return {
                props : {
                    products : result[0],
                    pageType
                }
            }
        }
    }catch(e){
        console.log(e);
    }
}