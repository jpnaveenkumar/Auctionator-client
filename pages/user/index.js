import { connect } from 'react-redux';
import styles from './index.module.css';
import {useRouter} from 'next/router';
import StickyHeader from '../../components/stickyHeader/stickyHeader';
import { store } from '../../store/store';
import {useEffect, useState} from 'react';
import AddProduct from '../../components/addProduct/addProduct';

function User({user, dispatch}){

    const router = useRouter();
    function logOutUser()
    {
        dispatch({
            "type" : "unsetUser",
            "user" : null
        });
        navigateToHomePage();
    }

    if(!user){
        navigateToHomePage();
    }

    function navigateToHomePage(){
        router.push(`/`);
    }

    return (
        <div>
            <StickyHeader></StickyHeader>
            <div className={styles.profileContainer}>
                <div className={styles.profileBox}>

                    <div className={styles.userDetails}>
                        <div className={styles.userImage}>
                            <img style={{width: '120px',height:'120px'}} src="/images/profile_pic.jpg"></img>
                        </div>

                        <div className={styles.user}>
                            <div className={styles.userItem}>
                               <div className={styles.userItemLHS}> Name : </div> {user["userName"].toUpperCase()}
                            </div>
                            <div className={styles.userItem}>
                                <div className={styles.userItemLHS}> Phone number: </div> {user["userPhonenumber"] ? user["userPhonenumber"] : '-'}
                            </div>
                            <div className={styles.userItem}>
                                <div className={styles.userItemLHS}> Email Id : </div>{user["userEmail"].toUpperCase()}
                            </div>
                            <div className={styles.userItem}>
                                <div className={styles.userItemLHS}> Address: </div> {user["userAddress"].toUpperCase()}
                            </div>   
                        </div>
                    </div>
                    
                    <div>
                        <div>
                        <AddProduct />
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(User);
