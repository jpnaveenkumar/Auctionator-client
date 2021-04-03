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
            <div className={styles.userDetails}>
                <div className={styles.userImage}>
                    <img style={{width: '90px',height:'90px'}} src="/images/profile_pic.jpg"></img>
                    {console.log('User object ' + user["userName"])}
                </div>

                <div className={styles.user}>
                    {/* <div>
                        {user["userId"]}
                    </div> */}

                    <div>
                        {user["userName"]}
                    </div>

                    <div>
                        {user["userEmail"]}
                    </div>
                    
                    <div>
                        {user["userAddress"]}
                    </div>   
                </div>
            </div>
            
            <div>
                <div>
                   <AddProduct />
                </div>
                
            </div>
            
        </div>
    );
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(User);
