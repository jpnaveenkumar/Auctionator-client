import styles from './header.module.css';
export default function Header()
{
    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <span className={styles.logoText}>Auctionator</span>
                <div className={styles.loginBtn}>
                    <span className={styles.loginText}>Login</span>
                </div>
            </div>
        </div>
    );
}