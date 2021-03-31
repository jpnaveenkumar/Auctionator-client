import styles from './stickyHeader.module.css';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import UserAuthenticationModal from '../userAuthenticationModal/userAuthenticationModal';
import { connect } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
function StickyHeader({user})
{
    const router = useRouter();
    const [showLoginModal, updateShowLoginModal] = useState(false);
    function signupLogin() {
        updateShowLoginModal(true);
        document.body.style.overflow = "hidden";
    }

    function onModalClose(){
        updateShowLoginModal(false);
        document.body.style.overflow = "";
    }

    function navigateToProfilePage(){
        router.push(`/user`);
    }

    function navigateToHome(){
        router.push(`/`);
    }

    return (
        <div className={styles.headerContainer}>
            { showLoginModal && <UserAuthenticationModal onModalClose = {onModalClose}></UserAuthenticationModal>}
            <div className={styles.header}>
                <span onClick={navigateToHome} className={styles.logoText}>Auctionator</span>
                { user != null ? 
                    <div onClick={navigateToProfilePage} className={styles.userProfileContainer}>
                        <AccountCircleIcon style={{ color: '#023e8a' }}></AccountCircleIcon>
                        <div className={styles.userName}>{user != null ? user["userName"] : ""}</div>
                    </div>
                    :
                    <div onClick={signupLogin} className={styles.loginBtn}>
                        <span className={styles.loginText}>Login</span>
                    </div>
                }
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { user : state.user }
}

export default connect(mapStateToProps)(StickyHeader)