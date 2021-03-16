import styles from './stickyHeader.module.css';
export default function StickyHeader()
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