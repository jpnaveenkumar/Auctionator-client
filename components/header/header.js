import styles from './header.module.css';
import React from 'react';
import {useRouter} from 'next/router';

export default function Header(props)
{
    const router = useRouter();
    function signupLogin() {
        router.push('/login');
    }
    return (
        
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <span className={styles.logoText}>Auctionator</span>
                <div onClick={signupLogin} className={styles.loginBtn}>
                    <span className={styles.loginText}>Login</span>
                </div>
            </div>
        </div>
    );
}
