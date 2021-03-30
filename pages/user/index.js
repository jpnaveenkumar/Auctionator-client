import { connect } from 'react-redux';
import styles from './index.module.css';
import {useRouter} from 'next/router';
import StickyHeader from '../../components/stickyHeader/stickyHeader';
import { store } from '../../store/store';
import {useEffect, useState} from 'react';
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
            <div className={styles.container}>
                <div onClick={logOutUser} className={styles.logoutBtn}>
                    Logout
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(User);
