import styles from './footer.module.css';
export default function Footer()
{
    return (
        <div className={styles.footer}>
            <span className={styles.team}>Team Auctionator</span>
            <span className={styles.member}>NAVEEN KUMAR JAKUVA PREMKUMAR - A0212252X</span>
            <span className={styles.member}>SUDEEP KRISHNA NAGARAJAN - A0212219R</span>
            <span className={styles.member}>AKHIL VENKATESWARAN LAKSHMINARAYANAN - A0228512L</span>
        </div>
    );
}